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
import * as EditPanelActions from './actions/editpanel'
import { EditPanel } from './components/EditPanel'
import * as RequestMessage from './api/Requests'
import * as ComponentMessage from './api/Components'
import * as EventMessage from './api/Events'
import { EditPanelState, EditPane } from './reducers/editpanel';

interface ManageProps {
  displays: Display[];
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
  connectivity: {
    serverName: string | undefined;
    connected: boolean;
    clients: ClientStatus[];
  };
  deleteComponent: (id: string) => void;
  editPanel: EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPane) => void;
  updateComponent: <T extends OSDComponent>(component: T) => void;
  removeComponent: (eventId: string, componentId: string) => void;
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
// todo: this causes quite a lot of components to be re-rendered - how can we avoid this?
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
    console.log(`Selected panel is ${this.props.editPanel.selected}`)
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col col-sm-auto" style={{ width: '25rem' }}>
            <ManageSelectorPanel 
              events={this.props.events} 
              components={this.props.components} 
              deleteComponent={this.props.deleteComponent}
              openTab={this.props.openTab}
            /> 
            {/* todo: should only be shared components */}
            <ConnectivityPanel 
              serverName={this.props.connectivity.serverName || "streamer-1.yellowbill.co.uk"} 
              connected={this.props.connectivity.connected} 
              clients={this.props.connectivity.clients} />
          </div>
          <div className="col-xl">
            <ViewPanel 
              key={this.privateDisplay.id} 
              name={this.privateDisplay.name} 
              showCaption={true} 
              preview={true}
              components={[]}
            />
            <EditPanel 
              editPanel={this.props.editPanel}
              closeTab={this.props.closeTab}
              selectTab={this.props.selectTab}
              openTab={this.props.openTab}
              components={this.props.components}
              events={this.props.events}
              updateComponent={this.props.updateComponent}
              removeComponent={this.props.removeComponent}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: ManageAppState) => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    connectivity: state.connectivity,
    editPanel: state.editPanel
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
    removeComponent: (eventId: string, componentId: string): void => {
      const action: EventMessage.RemoveComponent = {
        type: EventMessage.MessageType.RemoveComponent,
        id: eventId,
        componentId
      }
      dispatch(send(action))
    }
  }
}

const ManageContainer = connect(mapStateToProps, mapDispatchToProps)(Manage)

ReactDOM.render(
  <Provider store={store}>
    <ManageContainer />
  </Provider>,
  document.getElementById("root")
);
