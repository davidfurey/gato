import 'core-js/features/object/from-entries';
import path from 'path';
import express from 'express';
import compression from 'compression';
import * as WebSocket from 'ws';
import * as http from 'http';
import * as net from 'net';
import { Message } from '../api/Messages'
import * as Request from '../api/Requests'
import * as Response from '../api/Responses'
import { ClientStatus, ClientInterface } from '../api/Responses'
import { OSDLiveEvent, SharedState, reducer } from '../reducers/shared'
import { v4 as uuid } from 'uuid';
import fs from 'fs'
import url from 'url'
import flat from 'array.prototype.flat'
import { Config, loadConfig } from '../config';
import { createApiRoutes } from './api';
import { renderComponent } from '../preview';
import { capture } from '../screenshot';
import { loadState, storeComponents, storeDisplays, storeEvents, storeSettings, storeStyles, storeThemes } from './datastore';

flat.shim()

const port = 3040;

const accessPort = process.env.NODE_ENV === "production" ? port : 8080

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
  themes: {},
  styles: {},
  settings: {
    eventId: initialEvent.id,
    defaultStyles: {
      'image': null,
      'lower-thirds': null,
      'slide': null
    }
  },
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
  if (newState.themes !== state.themes) {
    storeThemes(newState.themes)
  }
  if (newState.styles !== state.styles) {
    storeStyles(newState.styles)
  }
  if (newState.settings !== state.settings) {
    storeSettings(newState.settings)
  }
  state = newState
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
  const iface = req.url != null ? ((s: string) => {
    switch (url.parse(s).path) {
      case "/manage-connection": return "manage"
      case "/configure-connection": return "configure"
      default: return "control"
    }
  })(req.url) : "manage"
  const id = uuid()
  clients.push({
    ip: ip || "unknown",
    name: user || ip || "unknown",
    interface: iface,
    screenName: undefined,
    lastSeen: Date.now(),
    id,
    ws,
  })

  console.log("new connection")
    ws.on('message', (rawMessage: string) => {
      const message: Message = JSON.parse(rawMessage) as Message;
      if (!Request.isRequestMessage(message)) {
        broadcastMessage(rawMessage)
        updateState(message);
      } else {
        handleRequest(ws, message, id)
      }
    })
});

loadState(state)

viewerServer.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  const id = uuid()
  console.log("new connection")
  if (req.url != null) {
    const query = url.parse(req.url, true).query
    const screenName = (Array.isArray(query['display'])) ? query['display'][0] : query['display']
    const client = ((Array.isArray(query['client'])) ? query['client'][0] : query['client']) || "Unknown client"

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
      const message: Message = JSON.parse(rawMessage) as Message;
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

createApiRoutes(
  app,
  () => state,
  (message) => {
    broadcastMessage(JSON.stringify(message))
    updateState(message);
  }
)

let config: Config | undefined = undefined

void loadConfig().then((c) => {
  config = c
})

app.get('/drive/:path(*)', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  if (config === undefined) {
    res.status(400)
    res.send("Bad request")
    return
  }
  const extensions: string[] | undefined = (typeof req.query['extensions'] === 'string') ?
    req.query['extensions'].split(',') : undefined

  function extensionsFilter(filename: string): boolean {
    if (extensions) {
      return extensions.includes(path.extname(filename).toLowerCase().slice(1))
    }
    return true
  }

  const reqPath: string = req.params['path'] || ""
  const basePath = path.normalize(config.drive.basePath)
  const absPath = path.normalize(basePath + reqPath)

  if (!absPath.startsWith(basePath)) {
    res.status(400)
    res.send("Bad request")
  } else {
    fs.promises.readdir(absPath).then((dir) =>
      Promise.all(dir.map((file) => {
        const filePath = path.join(absPath, file)
        return fs.promises.stat(filePath).then((stat) => {
          if (stat.isDirectory() || extensionsFilter(file)) {
            return [{
              filename: file,
              path: "/" + filePath.substring(basePath.length),
              type: stat.isDirectory() ? "folder" : "image",
              url: (config?.drive.baseUrl || "") + filePath.substring(basePath.length)
            }]
          }
          return []
        })
      }))
    ).then((array) => {
      res.send({
        path: "/" + absPath.substring(basePath.length),
        name: absPath === basePath ? "Drive" : path.basename(absPath),
        items: array.flat(),
        parent: absPath === basePath ? undefined : "/" + path.dirname(absPath).substring(basePath.length)
      })
    }).catch((e) => {
      console.log(e)
      res.status(500)
      res.send("Server error")
    })
  }
});

app.get('/api/preview/:id.html', (req, res) => {
  const component = state.components[req.params.id || ""]
  if (component) {
    const themeName = req.query['theme']
    const themeId = typeof req.query['themeId'] === 'string' ?
      req.query['themeId'] :
      typeof themeName === 'string' ?
      Object.values(state.themes).find((t) => t.name === themeName)?.id || null :
      null
    const eventId = typeof req.query['eventId'] === 'string' ? req.query['eventId'] : null
    const event = eventId ? state.events[eventId] : undefined
    const parameters = Object.entries(req.query).reduce(
      (acc, [k, v]) =>
        k.startsWith('param-') && typeof v === 'string' ?
          {
            ...acc,
            [k.slice(6)]: v
          }
        : acc,
      event?.parameters || {}
    )
    renderComponent(
      component,
      parameters,
      state.themes,
      state.styles,
      themeId
    ).then((html) => res.send(html)).catch((e) => {
      res.status(500).send("Error rendering component")
      console.log(e)
    })
  } else {
    res.status(404).send("Component not found")
  }
})

app.get('/api/preview/:id.png', (req, res) => {
  const id = req.params.id || ""
  const component = state.components[id]
  const query = new URL("http://localhost" + req.url).search
  if (component) {
    capture(`http://localhost:${accessPort}/api/preview/${id}.html${query}`).then((p) => {
      res.setHeader("Content-type", "image/png")
      res.send(p)
    }).catch((e) => {
      res.status(500).send(JSON.stringify(e))
    })
  } else {
    res.status(404).send("Component not found")
  }
})

app.get('/public/preview.png', (req, res) => {
  const eventName = req.query['event']
  const componentName = req.query['component']
  if (typeof eventName !== 'string' || typeof componentName !== 'string') {
    return res.status(400).send("Missing required parameters event and component")
  }

  const event = Object.values(state.events).find((e) => e.name === eventName)
  if (event === undefined) {
    return res.status(404).send("Event not found")
  }

  const componentId = event.components.find((cId) => state.components[cId]?.name === componentName)
  if (componentId === undefined) {
    return res.status(404).send("Component not found")
  }

  const query = new URL("http://localhost" + req.url).search
  const themeParam = event.theme ? `&themeId=${event.theme}` : ""
  const eventParam = `&eventId=${event.id}`
  capture(`http://localhost:${accessPort}/api/preview/${componentId}.html${query}${themeParam}${eventParam}`).then((p) => {
    res.setHeader("Content-type", "image/png")
    res.send(p)
  }).catch((e) => {
    res.status(500).send(JSON.stringify(e))
  })
})

server.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
  if (!request.url) {
    socket.destroy()
    return
  }
  const pathname = url.parse(request.url || "").pathname;
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
  } else if (pathname === '/configure-connection') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Server listening on port ${port}`);
  } else {
    console.log(`Webpack dev server is listening on port ${accessPort}, app running on ${port}`);
  }
});
