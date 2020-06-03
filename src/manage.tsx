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
import { ManageSelectorPanel } from './components/ManageSelectorPanel';
import * as Connectivity from './actions/connectivity'
import * as EditPanelActions from './actions/editpanel'
import { EditPanel } from './components/EditPanel'
import * as RequestMessage from './api/Requests'
import * as ComponentMessage from './api/Components'
import * as EventMessage from './api/Events'
import { EditPanelState, EditPane } from './reducers/editpanel';
import { Col, Container, Row } from 'react-bootstrap';
import { PageNav } from './components/PageNav';
import { ConnectivityPanelContainer } from './containers/ConnectivityPanelContainer';

interface ManageProps {
  displays: Display[];
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
  deleteComponent: (id: string) => void;
  deleteEvent: (id: string) => void;
  editPanel: EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPane) => void;
  updateComponent: <T extends OSDComponent>(component: T) => void;
  addComponent: (eventId: string, componentId: string) => void;
  removeComponent: (eventId: string, componentId: string) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
  newEvent: (eventId: string, name: string) => void;
  liveEventId: string;
  updateEvent: (event: OSDLiveEvent) => void;
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
// todo: this causes quite a lot of components to be re-rendered - how can we avoid this?
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
            <ManageSelectorPanel 
              events={this.props.events} 
              components={this.props.components} 
              deleteComponent={this.props.deleteComponent}
              liveEventId={this.props.liveEventId}
              deleteEvent={this.props.deleteEvent}
              openTab={this.props.openTab}
              newComponent={this.props.newComponent}
              newEvent={this.props.newEvent}
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
            <EditPanel 
              editPanel={this.props.editPanel}
              closeTab={this.props.closeTab}
              selectTab={this.props.selectTab}
              openTab={this.props.openTab}
              components={this.props.components}
              events={this.props.events}
              updateComponent={this.props.updateComponent}
              addComponent={this.props.addComponent}
              removeComponent={this.props.removeComponent}
              newComponent={this.props.newComponent}
              updateEvent={this.props.updateEvent}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state: ManageAppState) => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    editPanel: state.editPanel,
    liveEventId: state.shared.eventId
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    deleteComponent: (id: string): void => {
      const action: ComponentMessage.Delete = {
        type: ComponentMessage.MessageType.Delete,
        id,
      }
      dispatch(send(action))
    },
    deleteEvent: (id: string): void => {
      const action: EventMessage.Delete = {
        type: EventMessage.MessageType.Delete,
        id,
      }
      dispatch(send(action))
    },
    closeTab: (id: string): void => {
      const action: EditPanelActions.Close = {
        type: EditPanelActions.ActionType.Close,
        id,
      }
      dispatch(action)
    },
    selectTab: (id: string): void => {
      const action: EditPanelActions.Select = {
        type: EditPanelActions.ActionType.Select,
        id,
      }
      dispatch(action)
    },
    openTab: (pane: EditPane): void => {
      const action: EditPanelActions.Open = {
        type: EditPanelActions.ActionType.Open,
        pane,
      }
      dispatch(action)
    },
    updateComponent: <T extends OSDComponent>(component: T): void => {
      const action: ComponentMessage.Update = {
        type: ComponentMessage.MessageType.Update,
        component: component,
        id: component.id
      }
      dispatch(send(action))
    },
    updateEvent: (event: OSDLiveEvent): void => {
      const action: EventMessage.Update = {
        type: EventMessage.MessageType.Update,
        name: event.name,
        id: event.id
      }
      dispatch(send(action))
    },
    removeComponent: (eventId: string, componentId: string): void => {
      const action: EventMessage.RemoveComponent = {
        type: EventMessage.MessageType.RemoveComponent,
        id: eventId,
        componentId
      }
      dispatch(send(action))
    },
    addComponent: (eventId: string, componentId: string): void => {
      const action: EventMessage.AddComponent = {
        type: EventMessage.MessageType.AddComponent,
        id: eventId,
        componentId
      }
      dispatch(send(action))
    },
    newComponent: (componentId: string, name: string, type: string): void => {
      const create: ComponentMessage.Create = {
        type: ComponentMessage.MessageType.Create,
        id: componentId,
        component: {
          id: componentId,
          name,
          type
        }
      }
      dispatch(send(create))
    },
    newEvent: (eventId: string, name: string): void => {
      const create: EventMessage.Create = {
        type: EventMessage.MessageType.Create,
        id: eventId,
        name
      }
      dispatch(send(create))
    }
  }
}

const ManageContainer = connect(mapStateToProps, mapDispatchToProps)(Manage)

ReactDOM.render(
  <Provider store={store}>
    <PageNav page="manage" />
    <ManageContainer />
  </Provider>,
  document.getElementById("root")
);