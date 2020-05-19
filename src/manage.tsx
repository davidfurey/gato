import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent } from './OSDComponent';
import { Display, OSDLiveEvent } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { ManageAppState, createReducer } from './reducers/manageapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import { ConnectivityPanel } from './components/ConnectivityPanel';
import { ClientStatus } from './api/Responses';
import * as ManageAppActions from './actions/manageapp';
import { uuid } from 'uuidv4';
import { ManageSelectorPanel } from './components/ManageSelectorPanel';
import * as Connectivity from './actions/connectivity'
import * as RequestMessage from './api/Requests'

interface ManageProps {
  displays: Display[];
  components: { [key: string]: OSDComponent };
  events: OSDLiveEvent[];
  connectivity: {
    serverName: string | undefined;
    connected: boolean;
    clients: ClientStatus[];
  };
}

let maybeStore: Store<ManageAppState, ManageAppActions.Action> | undefined = undefined

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: (_: WebSocket) => { 
    maybeStore? maybeStore.dispatch(send({"type": RequestMessage.MessageType.GetSharedState })) : null
  },
});

const store = createStore(createReducer(), applyMiddleware(reduxWebsocketMiddleware))

maybeStore = store

export type AppDispatch = typeof store.dispatch

store.dispatch(websocketConnect('ws://localhost:3040/manage-connection'));


export class Manage extends Component<ManageProps> {
  constructor(props: ManageProps) {
    super(props)
    setInterval(() => {
      if (
        store.getState().connectivity.connected && 
        Date.now() - store.getState().connectivity.lastPong > 2000
      ) {
        store.dispatch({ type: Connectivity.ActionType.Disconnected})
      }
      store.dispatch(send({"type": RequestMessage.MessageType.Ping }))
    }, 1000)
  }

  privateDisplay: Display = {
    eventId: "test",
    name: "local",
    id: uuid(),
    resolution: {
      width: 1920,
      height: 1080
    },
    type: "Preview",
    onScreenComponents: [],
  }

  render(): JSX.Element {
    console.log(this.props)
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col col-sm-auto">
            <ManageSelectorPanel events={this.props.events} components={this.props.components} /> 
            {/* todo: should only be shared components */}
            <ConnectivityPanel 
              serverName={this.props.connectivity.serverName || "streamer-1.yellowbill.co.uk"} 
              connected={this.props.connectivity.connected} 
              clients={this.props.connectivity.clients} />
          </div>
          <div className="col-md-auto">
            <ViewPanel 
              key={this.privateDisplay.id} 
              name={this.privateDisplay.name} 
              showCaption={true} 
              preview={true}
              components={[]}
            />  
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: ManageAppState): ManageProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    connectivity: state.connectivity
  }
}

const ManageContainer = connect(mapStateToProps)(Manage)

ReactDOM.render(
  <Provider store={store}>
    <ManageContainer />
  </Provider>,
  document.getElementById("root")
);
