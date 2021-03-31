import React, { useMemo } from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent, OSDComponents } from './OSDComponent';
import QuickCreatePanelContainer from './containers/QuickCreatePanelContainer'
import PickedComponentsPanelContainer from './containers/PickedComponentsPanelContainer'
import { Display, OnScreenComponent, OSDLiveEvents, OSDWithState, Styles, Themes } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { ControlAppState, createReducer } from './reducers/controlapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import * as ControlAppActions from './actions/controlapp';
import * as Connectivity from  './actions/connectivity';
import * as RequestMessage from './api/Requests'
import { PageNav } from './components/PageNav';
import { ConnectivityPanelContainer } from './containers/ConnectivityPanelContainer';
import { LoadEventPanelContainer } from './containers/LoadEventPanelContainer';
import LiveComponentsPanelContainer from './containers/LiveComponentsPanelContainer';
import { PageFooter } from './components/PageFooter';
import { PageStyle } from './components/PageStyle';

interface ControlProps {
  displays: Display[];
  components: OSDComponents;
  themes: Themes;
  styles: Styles;
  events: OSDLiveEvents;
  eventId: string;
}

let maybeStore: Store<ControlAppState, ControlAppActions.Action> | undefined = undefined

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: (_: WebSocket) => {
    maybeStore ? maybeStore.dispatch(send({"type": RequestMessage.MessageType.GetSharedState })) : null
  },
  reconnectOnClose: true,
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

setInterval(() => {
  if (
    store.getState().connectivity.connected &&
    Date.now() - store.getState().connectivity.lastPong > 2000
  ) {
    store.dispatch({ type: Connectivity.ActionType.Disconnected})
  }
  store.dispatch(send({"type": RequestMessage.MessageType.Ping }))
}, 1000)

export function Control(props: ControlProps): JSX.Element {

  const lookupComponent = (osc: OnScreenComponent):
    OSDWithState<OSDComponent>[] => {
    const component = props.components[osc.id]
    if (component) {
      return [{
        state: osc.state,
        component
      }]
    }
    return []
  }

  const overlayDisplay = props.displays.find((d) => d.name === "Overlay")
  const liveEvent = props.events[props.eventId]
  const displays = useMemo(
    () => {
      console.log('CALCULATING')
      return props.displays.map((display) =>
        display.onScreenComponents.flatMap(lookupComponent)
      )
    },
    [props.components, props.displays]
  )

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col col-sm-auto" style={{ width: '30rem' }}>
          { liveEvent ? <PickedComponentsPanelContainer
            title="Picked Components"
            eventId={liveEvent.id} /> : null
            }
            <LiveComponentsPanelContainer title="Live Components" />
          { overlayDisplay ? <QuickCreatePanelContainer
            display={overlayDisplay}
            eventId={props.eventId}
          /> : null }
          <LoadEventPanelContainer />
          <ConnectivityPanelContainer />
        </div>
        <div className="col-md-auto">
          {props.displays.map((display, index) =>
            <ViewPanel
              key={display.id}
              name={display.name}
              showCaption={true}
              preview={true}
              components={displays[index] || []}
              parameters={liveEvent?.parameters}
              themes={props.themes}
              styles={props.styles}
              themeId={liveEvent?.theme || null}
            />
          )}
{/* <ViewPanel name="Preview" components={props.components} showCaption={true} /> */}

        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: ControlAppState): ControlProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    eventId: state.shared.settings.eventId,
    styles: state.shared.styles,
    themes: state.shared.themes
  }
}

const ControlContainer = connect(mapStateToProps)(Control)

const mapStateToNavProps =
  (state: ControlAppState, ownProps: { page: string }): { event?: string; page: string } => {
  const event = state.shared.events[state.shared.settings.eventId]
  return {
    event: event?.name,
    page: ownProps.page
  }
}

const ConnectedNav = connect(mapStateToNavProps)(PageNav)

ReactDOM.render(
  <Provider store={store}>
    <PageStyle />
    <ConnectedNav page="control" />
    <ControlContainer />
    <PageFooter />
  </Provider>,
  document.getElementById("root")
);
