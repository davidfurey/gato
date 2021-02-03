import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent, OSDComponents } from './OSDComponent';
import { SharedState, Display, OnScreenComponent, OnScreenComponentState, OSDLiveEvent } from './reducers/shared'
import { connect } from 'react-redux'
import './viewer.css';
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { createReducer, ViewerAppState } from './reducers/viewerapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import * as ViewAppActions from './actions/viewapp';
import * as Connectivity from './actions/connectivity';
import * as RequestMessage from './api/Requests'

interface ViewerProps {
  displays: Display[];
  components: OSDComponents;
  events: { [key: string]: OSDLiveEvent };
  eventId: string;
}

let maybeStore: Store<ViewerAppState, ViewAppActions.Action> | undefined = undefined

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: (_: WebSocket) => { maybeStore ? maybeStore.dispatch(send({"type": RequestMessage.MessageType.GetSharedState })) : null },
  reconnectOnClose: true,
});

const store = createStore(createReducer(), applyMiddleware(reduxWebsocketMiddleware))

maybeStore = store

export type AppDispatch = typeof store.dispatch

const params = new URLSearchParams(window.location.search)
const displayName = params.get('display') || "Overlay"
const client = params.get('client') || "unknown"

function socketUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return ((window.location.protocol === 'https:') ? 'wss://' : 'ws://') +
      window.location.host +
      window.location.pathname.replace(/[^/]*$/, '') +
      `view-connection?display=${displayName}&client=${client}`
  }
  return `ws://localhost:3040/view-connection?display=${displayName}&client=${client}`
}

store.dispatch(websocketConnect(socketUrl()));

export class Viewer extends Component<ViewerProps> {

  constructor(props: ViewerProps) {
    super(props)
    // setInterval(() => {
    //   console.log(store.getState())
    // }, 1000)
    setInterval(() => {
      if (
        store.getState().connectivity.connected
        && Date.now() - store.getState().connectivity.lastPong > 2000) {
        store.dispatch({ type: Connectivity.ActionType.Disconnected})
      }
      store.dispatch(send({"type": RequestMessage.MessageType.Ping }))
    }, 1000)
  }

  lookupComponent =
  (osc: OnScreenComponent): { state: OnScreenComponentState; component: OSDComponent}[] => {
    const component = this.props.components[osc.id]
    if (component) {
      return [{
        state: osc.state,
        component
      }]
    }
    return []
  }

  render(): JSX.Element {
    const display = this.props.displays.find((d) => d.name === displayName)
    const liveEvent = this.props.events[this.props.eventId]
    return (
      <div>
      {display ?
        <ViewPanel
          key={display.id}
          name={display.name}
          showCaption={false}
          preview={false}
          components={display.onScreenComponents.flatMap(this.lookupComponent)}
          parameters={liveEvent?.parameters}
        /> : null}
      </div>
    )
  }
}


interface ViewerApplicationState {
  shared: SharedState;
}

const mapStateToProps = (state: ViewerApplicationState): ViewerProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    eventId: state.shared.eventId
  }
}

const ViewerContainer = connect(mapStateToProps)(Viewer)

ReactDOM.render(
  <Provider store={store}>
    <ViewerContainer />
  </Provider>,
  document.getElementById("root")
);
