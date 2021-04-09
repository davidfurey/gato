import React from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent, OSDComponents } from './OSDComponent';
import { SharedState, Display, OnScreenComponent, OSDLiveEvents, Styles, Themes, OSDWithState } from './reducers/shared'
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
import { PageStyle } from './components/PageStyle';

interface ViewerProps {
  displays: Display[];
  components: OSDComponents;
  events: OSDLiveEvents;
  eventId: string;
  themes: Themes;
  styles: Styles;
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

setInterval(() => {
  if (
    store.getState().connectivity.connected
    && Date.now() - store.getState().connectivity.lastPong > 2000) {
    store.dispatch({ type: Connectivity.ActionType.Disconnected})
  }
  store.dispatch(send({"type": RequestMessage.MessageType.Ping }))
}, 1000)

export function Viewer(props: ViewerProps): JSX.Element {

  const lookupComponent =
  (osc: OnScreenComponent): OSDWithState<OSDComponent>[] => {
    const component = props.components[osc.id]
    if (component) {
      return [{
        state: osc.state,
        component
      }]
    }
    return []
  }

  const display = props.displays.find((d) => d.name === displayName)
  const liveEvent = props.events[props.eventId]

  return (
    <div>
    {display ?
      <ViewPanel
        key={display.id}
        name={display.name}
        showCaption={false}
        preview={false}
        components={display.onScreenComponents.flatMap(lookupComponent)}
        parameters={liveEvent?.parameters}
        themes={props.themes}
        styles={props.styles}
        themeId={liveEvent?.theme || null}
      /> : null}
    </div>
  )
}


interface ViewerApplicationState {
  shared: SharedState;
}

const mapStateToProps = (state: ViewerApplicationState): ViewerProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    eventId: state.shared.settings.eventId,
    themes: state.shared.themes,
    styles: state.shared.styles
  }
}

const ViewerContainer = connect(mapStateToProps)(Viewer)

ReactDOM.render(
  <Provider store={store}>
    <PageStyle />
    <ViewerContainer />
  </Provider>,
  document.getElementById("root")
);
