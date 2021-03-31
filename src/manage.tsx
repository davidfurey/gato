import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { OSDComponents } from './OSDComponent';
import { Display, OSDLiveEvents, Styles, Themes } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { ManageAppState, createReducer } from './reducers/manageapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import * as ManageAppActions from './actions/manageapp';
import { ManageSelectorPanelContainer } from './containers/ManageSelectorPanelContainer';
import * as Connectivity from './actions/connectivity'
import { EditPanelContainer } from './containers/EditPanelContainer'
import * as RequestMessage from './api/Requests'
import { EditPanelState } from './reducers/editpanel';
import { Col, Container, Row } from 'react-bootstrap';
import { PageNav } from './components/PageNav';
import { ConnectivityPanelContainer } from './containers/ConnectivityPanelContainer';
import { PageFooter } from './components/PageFooter';
import * as Navigation from './libs/navigation';
import { PageStyle } from './components/PageStyle';

interface ManageProps {
  displays: Display[];
  components: OSDComponents;
  events: OSDLiveEvents;
  themes: Themes;
  styles: Styles;
  editPanel: EditPanelState;
  liveEventId: string;
}

let maybeStore: Store<ManageAppState, ManageAppActions.Action> | undefined = undefined

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
      "manage-connection"
  }
  return `ws://localhost:3040/manage-connection`
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

export function Manage(props: ManageProps): JSX.Element {
  return (
    <Container className="mt-4">
      <Row>
        <Col sm="auto" style={{ width: "25rem"}}>
          <ManageSelectorPanelContainer
            events={props.events}
            components={props.components}
            liveEventId={props.liveEventId}
          />
          <ConnectivityPanelContainer />
        </Col>
        <Col xl={true}>
          <EditPanelContainer
            editPanel={props.editPanel}
            components={props.components}
            events={props.events}
            styles={props.styles}
            themes={props.themes}
          />
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = (state: ManageAppState): ManageProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    editPanel: state.editPanel,
    liveEventId: state.shared.settings.eventId,
    styles: state.shared.styles,
    themes: state.shared.themes
  }
}

const ManageContainer = connect(mapStateToProps)(Manage)

Navigation.init(store)

ReactDOM.render(
  <Provider store={store}>
    <PageStyle />
    <PageNav page="manage" />
    <ManageContainer />
    <PageFooter />
  </Provider>,
  document.getElementById("root")
);