import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent } from './OSDComponent';
import QuickCreatePanelContainer from './containers/QuickCreatePanelContainer'
import PickedComponentsPanelContainer from './containers/PickedComponentsPanelContainer'
import { Display, OnScreenComponent, OnScreenComponentState, OSDLiveEvent } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { ControlAppState, createReducer } from './reducers/controlapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import { ConnectivityPanel } from './components/ConnectivityPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { ClientStatus } from './api/Responses';
import * as ControlAppActions from './actions/controlapp';
import * as Connectivity from  './actions/connectivity';
import * as RequestMessage from './api/Requests'

interface ControlProps {
  displays: Display[];
  components: { [key: string]: OSDComponent };
  events: OSDLiveEvent[];
  connectivity: {
    serverName: string | undefined;
    connected: boolean;
    clients: ClientStatus[];
  };
}

let maybeStore: Store<ControlAppState, ControlAppActions.Action> | undefined = undefined

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: (_: WebSocket) => { 
    maybeStore ? maybeStore.dispatch(send({"type": RequestMessage.MessageType.GetSharedState })) : null
  },
});

const store = createStore(createReducer(), applyMiddleware(reduxWebsocketMiddleware))
 
maybeStore = store

export type AppDispatch = typeof store.dispatch

store.dispatch(websocketConnect('ws://localhost:3040/control-connection'));

export class Control extends Component<ControlProps> {
  constructor(props: ControlProps) {
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

  lookupComponent = (osc: OnScreenComponent): 
    { state: OnScreenComponentState; component: OSDComponent}[] => {
    const component = this.props.components[osc.id]
    if (component) {
      return [{
        state: osc.state,
        component
      }]
    }
    return []
  }

  lookupComponentById = (id: string): OSDComponent[] => {
    const component = this.props.components[id]
    return component ? [component] : []
  }

  render(): JSX.Element {
    const liveDisplay = this.props.displays.find((d) => d.name === "live")
    const liveEvent = liveDisplay !== undefined ? 
      this.props.events.find((e) => e.id === liveDisplay.eventId) : undefined
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col col-sm-auto" style={{ width: '25rem' }}>
            { liveEvent ? <PickedComponentsPanelContainer eventId={liveEvent.id} pickedComponents={liveEvent.lists.find((l) => l.listType === "picked")?.components || []} components={liveEvent.components.flatMap(this.lookupComponentById)} displays={this.props.displays}/> : null }
            { liveDisplay ? <QuickCreatePanelContainer display={liveDisplay}/> : null }
            <SettingsPanel events={this.props.events} event={liveEvent} setEvent={(): void => {
              // do nothing
            }} />
            <ConnectivityPanel serverName={this.props.connectivity.serverName || "streamer-1.yellowbill.co.uk"} connected={this.props.connectivity.connected} clients={this.props.connectivity.clients} />
          </div>
          <div className="col-md-auto">
            {this.props.displays.map((display =>
              <ViewPanel 
                key={display.id} 
                name={display.name} 
                showCaption={true} 
                preview={true}
                components={display.onScreenComponents.flatMap(this.lookupComponent)}
              />  
            ))}
{/* <ViewPanel name="Preview" components={this.props.components} showCaption={true} /> */}
            
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: ControlAppState): ControlProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    connectivity: state.connectivity
  }
}

const ControlContainer = connect(mapStateToProps)(Control)

ReactDOM.render(
  <Provider store={store}>
    <ControlContainer />
  </Provider>,
  document.getElementById("root")
);
