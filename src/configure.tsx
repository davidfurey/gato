import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { OSDComponents } from './OSDComponent';
import { ComponentType, Display, OSDLiveEvents, Styles, Themes } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { ConfigureAppState, createReducer } from './reducers/configureapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import * as ConfigureAppActions from './actions/configureapp';
import { ConfigureSelectorPanelContainer } from './containers/ConfigureSelectorPanelContainer';
import * as Connectivity from './actions/connectivity'
import { EditPanelContainer } from './containers/EditPanelContainer'
import * as RequestMessage from './api/Requests'
import { EditPanelState } from './reducers/editpanel';
import { Col, Container, Row } from 'react-bootstrap';
import { PageNav } from './components/PageNav';
import { ConnectivityPanelContainer } from './containers/ConnectivityPanelContainer';
import { PageFooter } from './components/PageFooter';
import * as Navigation from './libs/navigation';
import { SettingsPanelContainer } from './containers/SettingsPanelContainer';

interface ConfigureProps {
  displays: Display[];
  components: OSDComponents;
  events: OSDLiveEvents;
  themes: Themes;
  styles: Styles;
  editPanel: EditPanelState;
  defaultStyles: Record<ComponentType, string | null>;
  liveEventId: string;
}

let maybeStore: Store<ConfigureAppState, ConfigureAppActions.Action> | undefined = undefined

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: (_: WebSocket) => {
    maybeStore? maybeStore.dispatch(send({"type": RequestMessage.MessageType.GetSharedState })) : null
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
      "configure-connection"
  }
  return `ws://localhost:3040/configure-connection`
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

export function Configure(props: ConfigureProps): JSX.Element {
  const themeId = props.events[props.liveEventId]?.theme
  return (
    <Container className="mt-4">
      <Row>
        <Col sm="auto" style={{ width: "25rem"}}>
          <ConfigureSelectorPanelContainer
            themes={props.themes}
            styles={props.styles}
          />
          <SettingsPanelContainer />
          <ConnectivityPanelContainer />
        </Col>
        <Col xl={true}>
          <EditPanelContainer
            editPanel={props.editPanel}
            components={props.components}
            liveEvent={props.liveEventId}
            events={props.events}
            themes={props.themes}
            styles={props.styles}
            defaultStyles={props.defaultStyles}
            theme={themeId ? props.themes[themeId] : undefined}
          />
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = (state: ConfigureAppState): ConfigureProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    editPanel: state.editPanel,
    themes: state.shared.themes,
    styles: state.shared.styles,
    defaultStyles: state.shared.settings.defaultStyles,
    liveEventId: state.shared.settings.eventId
  }
}

const ConfigureContainer = connect(mapStateToProps)(Configure)

// Temporary to tidy previous data
window.localStorage.removeItem("gato.editPanel")

Navigation.init(store)

ReactDOM.render(
  <Provider store={store}>
    <PageNav page="configure" />
    <ConfigureContainer />
    <PageFooter />
  </Provider>,
  document.getElementById("root")
);