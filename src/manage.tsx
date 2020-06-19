import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { OSDComponent } from './OSDComponent';
import { Display, OSDLiveEvent } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { ManageAppState, createReducer } from './reducers/manageapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import * as ManageAppActions from './actions/manageapp';
import { uuid } from 'uuidv4';
import { ManageSelectorPanelContainer } from './containers/ManageSelectorPanelContainer';
import * as Connectivity from './actions/connectivity'
import { EditPanelContainer } from './containers/EditPanelContainer'
import * as RequestMessage from './api/Requests'
import { EditPanelState } from './reducers/editpanel';
import { Col, Container, Row } from 'react-bootstrap';
import { PageNav } from './components/PageNav';
import { ConnectivityPanelContainer } from './containers/ConnectivityPanelContainer';
import { PageFooter } from './components/PageFooter';

interface ManageProps {
  displays: Display[];
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
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

function objectFilter<T>(
  obj: { [key: string]: T }, 
  fn: (pv: T, pk: string, pi: number) => boolean
): 
{ [key: string]: T } {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v], i) => fn(v, k, i)
    )
  )
}

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
    return (
      <Container className="mt-4">
        <Row>
          <Col sm="auto" style={{ width: "25rem"}}>
            <ManageSelectorPanelContainer 
              events={this.props.events} 
              components={objectFilter(this.props.components, (c) => c.shared)} 
              liveEventId={this.props.liveEventId}
            /> 
            {/* todo: should only be shared components */}
            <ConnectivityPanelContainer /> 
          </Col>
          <Col xl={true}>
            {/* <ViewPanel 
              key={this.privateDisplay.id} 
              name={this.privateDisplay.name} 
              showCaption={true} 
              preview={true}
              components={[]}
            /> */}
            <EditPanelContainer 
              editPanel={this.props.editPanel}
              components={this.props.components}
              events={this.props.events}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state: ManageAppState): ManageProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    editPanel: state.editPanel,
    liveEventId: state.shared.eventId
  }
}

const ManageContainer = connect(mapStateToProps)(Manage)

ReactDOM.render(
  <Provider store={store}>
    <PageNav page="manage" />
    <ManageContainer />
    <PageFooter />
  </Provider>,
  document.getElementById("root")
);