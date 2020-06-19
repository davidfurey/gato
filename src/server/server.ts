import 'core-js/features/object/from-entries';
import path from 'path';
import express, { Request as ExpressRequest } from 'express';
import compression from 'compression';
import * as WebSocket from 'ws';
import * as http from 'http';
import { Message } from '../api/Messages'
import * as Request from '../api/Requests'
import * as Response from '../api/Responses'
import { ClientStatus, ClientInterface } from '../api/Responses'
import { OSDLiveEvent, SharedState, reducer, Display } from '../reducers/shared'
import { uuid } from 'uuidv4'
import fs from 'fs'
import { OSDComponent } from '../OSDComponent';
import url from 'url'

const port = 3040;

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

const viewerServer = new WebSocket.Server({ noServer: true });

const initialEvent: OSDLiveEvent = {
  name: "Some event",
  id: uuid(),
  components: [],
  lists: []
}

export interface ConnectionStatus {
  ip: string;
  name: string;
  interface: ClientInterface;
  screenName: string | undefined;
  lastSeen: number;
  id: string;
  ws: WebSocket;
}

let clients: ConnectionStatus[] = []

let state: SharedState = {
  components: {},
  events: { [initialEvent.id]: initialEvent },
  eventId: initialEvent.id,
  displays: [{
    type: "OnAir",
    name: "Overlay",
    id: uuid(),
    resolution: {
      width: 1920,
      height: 1080
    },
    onScreenComponents: [],
  },{
    type: "OnAir",
    name: "Picture Box",
    id: uuid(),
    resolution: {
      width: 1920,
      height: 1080
    },
    onScreenComponents: [],
  },{
    type: "Preview",
    name: "preview",
    id: uuid(),
    resolution: {
      width: 1920,
      height: 1080
    },
    onScreenComponents: [],
  }],
}

function handlePing(ws: WebSocket, message: Request.Ping, id: string): void {
  clients = clients.map((client) => client.id === id ? { ...client, lastSeen: Date.now() } : client)
  
  const clientState: ClientStatus[] = clients.map((client) => {
    const duration = Date.now() - client.lastSeen
    const connected = duration < 2000 ? "yes" : duration < 5000 ? "missed-ping" : "no"
    return {
      name: client.name,
      interface: client.interface,
      id: client.id,
      screenName: client.screenName,
      connected
    }
  })

  const mergedClients = clientState.reduce(function (clients, client) {
    const existingClient = clients.find((c) => 
      c.name === client.name && 
      c.interface === client.interface && 
      c.screenName === client.screenName
    )
    if (!existingClient) {
      return clients.concat(client)
    } else {
      if (existingClient.connected === "missed-ping" && client.connected === "yes") {
        return clients.map((c) => c !== existingClient ? c : client)
      } else if (existingClient.connected === "no" && (client.connected === "yes" || client.connected === "missed-ping")) {
        return clients.map((c) => c !== existingClient ? c : client)
      }
      return clients
    }
  }, [] as ClientStatus[]);

  const pongResponse: Response.Pong = {
    type: Response.MessageType.Pong,
    clients: mergedClients,
  }
  ws.send(JSON.stringify(pongResponse));
}

const handleRequest = (ws: WebSocket, message: Request.Message, id: string): void => {
  // todo: validation required here to avoid crash
  // return pattern[message.type](message);
  //  TypeError: pattern[message.type] is not a function
  Request.matcher({
    [Request.MessageType.GetSharedState]: (_) => {
      const response: Response.State = {
        type: Response.MessageType.SharedState,
        state
      }
      ws.send(JSON.stringify(response));
    },
    [Request.MessageType.Ping]: (msg) => handlePing(ws, msg, id)
  })(message)
}

function cleanupConnections(): void {
  const now = Date.now()
  clients = clients.filter((item) => {
    if ((now - item.lastSeen) > 60000) {
      item.ws.terminate()
      return false
    }
    return true
  })
}

setInterval(() => {
  cleanupConnections()
}, 10000)

const emptyCallback = (): void => {
  // do nothing.
}

function storeComponents(components: { [key: string]: OSDComponent } ): void {
  fs.mkdirSync('config', { recursive: true })
  fs.writeFile('config/components.json', JSON.stringify(components), {}, emptyCallback)
}
function storeDisplays(displays: Display[]): void {
  fs.mkdirSync('config', { recursive: true })
  fs.writeFile('config/displays.json', JSON.stringify(displays), {}, emptyCallback)
}
function storeEvents(events: { [key: string]: OSDLiveEvent }): void {
  fs.mkdirSync('config', { recursive: true })
  fs.writeFile('config/events.json', JSON.stringify(events), {}, emptyCallback)
}

function loadComponents(): Promise<{ [key: string]: OSDComponent }> {
  const p = fs.promises.readFile('config/components.json', 'utf8').then((data) => JSON.parse(data) as { [key: string]: OSDComponent })
  p.catch((error) => { console.log("Error parsing components"); console.log(error) })
  return p
}
function loadDisplays(): Promise<Display[]> {
  const p = fs.promises.readFile('config/displays.json', 'utf8').then((data) => JSON.parse(data) as Display[])
  p.catch((error) => { console.log("Error parsing displays"); console.log(error) })
  return p
}
function loadEvents(): Promise<{ [key: string]: OSDLiveEvent }> {
  const p = fs.promises.readFile('config/events.json', 'utf8').then((data) => JSON.parse(data) as { [key: string]: OSDLiveEvent })
  p.catch((error) => { console.log("Error parsing events"); console.log(error) })
  return p
}

function updateState(message: Message): void {
  const newState = reducer(state, message)
  if (newState.components !== state.components) {
    storeComponents(newState.components)
  }
  if (newState.displays !== state.displays) {
    storeDisplays(newState.displays)
  }
  if (newState.events !== state.events) {
    storeEvents(newState.events)
  }
  state = newState
}

function loadStateFromDisk(): void {
  loadComponents().then((components) => {
    state['components'] = components
  })
  loadDisplays().then((displays) => {
    state['displays'] = displays
  })
  loadEvents().then((events) => {
    state['events'] = events
    state['eventId'] = Object.values(events)[0].id  // todo: should persist this to disk!
  })
}
// needs better error handling to avoid bad requests killing the server

function broadcastMessage(rawMessage: string): void {
  viewerServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(rawMessage);
    }
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(rawMessage);
    }
  });
}

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  const user = Array.isArray(req.headers['x-user']) ? req.headers['x-user'][0] : req.headers['x-user']
  const iface = req.url != null && url.parse(req.url).path === "/manage-connection" ? "manage" : "control"
  const id = uuid()
  clients.push({
    ip: user || ip || "unknown",
    name: ip || "unknown",
    interface: iface,
    screenName: undefined,
    lastSeen: Date.now(),
    id,
    ws,
  })

  console.log("new connection")
    ws.on('message', (rawMessage: string) => {
      const message: Message = JSON.parse(rawMessage);
      if (!Request.isRequestMessage(message)) {
        broadcastMessage(rawMessage)
        updateState(message);
      } else {
        handleRequest(ws, message, id)
      }
    })
});

loadStateFromDisk()

viewerServer.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  const id = uuid()
  console.log("new connection")
  if (req.url != null) {
    const query = url.parse(req.url, true).query
    const screenName = (Array.isArray(query['display'])) ? query['display'][0] : query['display']
    const client = (Array.isArray(query['client'])) ? query['client'][0] : query['client']
  
    // bail if client and screen name not set
    clients.push({
      ip: ip || "unknown",
      name: client,
      interface: "view",
      screenName: screenName || "unknown",
      lastSeen: Date.now(),
      id,
      ws,
    })

    ws.on('message', (rawMessage: string) => {
      const message: Message = JSON.parse(rawMessage);
      if (Request.isPing(message) || Request.isState(message)) {
        handleRequest(ws, message, id)
      } else {
        console.error("Received unexpected message from view connection")
        console.error(message)
      }
    })
  } else {
    console.error("URL was null, bailing") // should send error first?
    ws.terminate()
  }
});

app.use(compression());

app.all('*', (request, response, next) => {
    const start = Date.now();

    response.once('finish', () => {
        const duration = Date.now() - start;
        console.log(`HTTP ${request.method} ${request.path} returned ${response.statusCode} in ${duration}ms`);
    });

    next();
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/healthcheck', (_req, res) => res.send("Ok"));

server.on('upgrade', (request: ExpressRequest<any,any, any, any>, socket, head) => {
  const pathname = url.parse(request.url).pathname;
  console.log(request.headers['user-agent'])
  console.log(request.headers)
  if (pathname === '/control-connection') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else if (pathname === '/view-connection') {
    viewerServer.handleUpgrade(request, socket, head, function done(ws) {
      viewerServer.emit('connection', ws, request);
    });
  } else if (pathname === '/manage-connection') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Server listening on port ${port}!`);
  } else {
    console.log(`Webpack dev server is listening on port ${port}`);
  }
});
