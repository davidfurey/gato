import { uuid } from 'uuidv4'
import * as ControlActions from '../actions/controlapp'
import * as Connectivity from '../actions/connectivity'
import { SharedState, reducer as sharedStateReducer, OSDLiveEvent } from './shared'
import * as Response from '../api/Responses'
import { GenericPattern, AnnotatedType, TypeMap } from '../api/PatternHelpers'
import { reducer as connectivityReducer, ConnectivityState } from './connectivity'
import { createReducer as createResponseReducer } from './response'
import { BaseAppState } from './base'

export enum EditPaneType {
  Component = 'Component',
  Event = 'Event'
}

export type EditPane = ComponentEditPane | EventEditPane

export type Pattern<T> = GenericPattern<TypeMap<EditPaneType, EditPane>, T>

type PaneId = string
interface BasePane<T extends EditPaneType> extends AnnotatedType<T> {
  id: PaneId;
}

export type ComponentEditPane = BasePane<EditPaneType.Component>

export type EventEditPane = BasePane<EditPaneType.Event>

interface EditPanelState {
  panes: EditPane[];
  selected: PaneId | undefined;
}

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
    components: {},
    groups: [],
    events: [ initialEvent ],
    displays: [{
      eventId: initialEvent.id,
      type: "OnAir",
      name: "live",
      id: uuid(),
      resolution: {
        width: 1920,
        height: 1080
      },
      onScreenComponents: [],
    }]
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

type ManageAppReducer = (state: ManageAppState, action: ControlActions.Action) => ManageAppState

export function createReducer(): ManageAppReducer {
  const responseReducer = createResponseReducer<ManageAppState>()

  return (state = initialManageState, action): ManageAppState => {
    if (ControlActions.isWebsocketAction(action)) {
      const message = JSON.parse(action.payload.message)
      if (Response.isResponseMessage(message)) {
        return responseReducer(message, state) //todo
      } else {
        return {...state, shared: sharedStateReducer(state.shared, message) }
      }
    }

    if (Connectivity.isConnectivityAction(action)) {
      return {
        ...state,
        connectivity: connectivityReducer(state.connectivity, action)
      }
    }


    if (!action.type.startsWith("REDUX_WEBSOCKET") && !action.type.startsWith("@@redux")) {
      console.warn("Unhandled action:")
      console.warn(action)
    }
    return state
  }
}