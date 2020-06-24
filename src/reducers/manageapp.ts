import { uuid } from 'uuidv4'
import * as ManageActions from '../actions/manageapp'
import * as Connectivity from '../actions/connectivity'
import * as EditPanel from '../actions/editpanel'
import { SharedState, reducer as sharedStateReducer, OSDLiveEvent } from './shared'
import * as Response from '../api/Responses'
import * as Component from '../api/Components'
import * as Event from '../api/Events'
import { reducer as connectivityReducer, ConnectivityState } from './connectivity'
import { createReducer as createResponseReducer } from './response'
import { BaseAppState } from './base'
import { reducer as editPanelReducer, EditPanelState } from './editpanel'


export interface ManageAppState extends BaseAppState {
  shared: SharedState;
  connectivity: ConnectivityState;
  editPanel: EditPanelState;
}

const initialEvent: OSDLiveEvent = {
  name: "Some event",
  id: uuid(),
  components: [],
  lists: []
}

const initialManageState: ManageAppState = {
  shared: {
    eventId: initialEvent.id,
    components: {},
    events: { [initialEvent.id]: initialEvent },
    displays: []
  },
  connectivity: {
    serverName: undefined,
    connected: false,
    clients: [],
    lastPong: 0,
  },
  editPanel: {
    panes: [],
    selected: undefined
  }
}

type ManageAppReducer = (state: ManageAppState, action: ManageActions.Action) => ManageAppState

export function createReducer(): ManageAppReducer {
  const responseReducer = createResponseReducer<ManageAppState>()

  return (state = initialManageState, action): ManageAppState => {
    if (ManageActions.isWebsocketAction(action)) {
      const message = JSON.parse(action.payload.message)
      if (Response.isResponseMessage(message)) {
        return responseReducer(message, state)
      } else {
        return {
          ...state,
          shared: sharedStateReducer(state.shared, message),
          editPanel: Component.isDelete(message) || Event.isDelete(message) ?
            editPanelReducer(state.editPanel, { 'type': EditPanel.ActionType.Close, id: message.id })
          : state.editPanel
        }
      }
    }

    if (Connectivity.isConnectivityAction(action)) {
      return {
        ...state,
        connectivity: connectivityReducer(state.connectivity, action)
      }
    }

    if (EditPanel.isEditPanelAction(action)) {
      return {
        ...state,
        editPanel: editPanelReducer(state.editPanel, action)
      }
    }


    if (!action.type.startsWith("REDUX_WEBSOCKET") && !action.type.startsWith("@@redux")) {
      console.warn("Unhandled action:")
      console.warn(action)
    }
    return state
  }
}