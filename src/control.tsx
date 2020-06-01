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
import { ClientStatus } from './api/Responses';
import * as ControlAppActions from './actions/controlapp';
import * as Connectivity from  './actions/connectivity';
import * as RequestMessage from './api/Requests'
import { PageNav } from './components/PageNav';
import { ConnectivityPanelContainer } from './containers/ConnectivityPanelContainer';
import { SettingsPanelContainer } from './containers/SettingsPanelContainer';

interface ControlProps {
  displays: Display[];
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
  connectivity: {
    serverName: string | undefined;
    connected: boolean;
    clients: ClientStatus[];
  };
  eventId: string;
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

function socketUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return ((window.location.protocol === 'https:') ? 'wss://' : 'ws://') +
      window.location.host +
      window.location.pathname.replace(/[^/]*$/, '') +
      "control-connection"
  }
  return 'ws://localhost:3040/control-connection'
}

store.dispatch(websocketConnect(socketUrl()));

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
    const liveEvent = this.props.events[this.props.eventId]
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col col-sm-auto" style={{ width: '25rem' }}>
            { liveEvent ? <PickedComponentsPanelContainer 
              eventId={liveEvent.id} 
              pickedComponents={liveEvent.lists.find((l) => l.listType === "picked")?.components || []} 
              components={liveEvent.components.flatMap(this.lookupComponentById)} 
              displays={this.props.displays}/> : null 
              }
            { liveDisplay ? <QuickCreatePanelContainer 
              display={liveDisplay} 
              eventId={this.props.eventId} 
            /> : null }
            <SettingsPanelContainer />
            <ConnectivityPanelContainer /> 
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
    connectivity: state.connectivity,
    eventId: state.shared.eventId
  }
}

const ControlContainer = connect(mapStateToProps)(Control)

const mapStateToNavProps = 
  (state: ControlAppState, ownProps: { page: string }): { event?: string; page: string } => {
  const event = state.shared.events[state.shared.eventId]
  return {
    event: event?.name,
    page: ownProps.page
  }
}


const ConnectedNav = connect(mapStateToNavProps)(PageNav)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedNav page="control" />
    <ControlContainer />
  </Provider>,
  document.getElementById("root")
);
