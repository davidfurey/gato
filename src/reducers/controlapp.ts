import { v4 as uuid } from 'uuid';
import * as ControlActions from '../actions/controlapp'
import * as Connectivity from '../actions/connectivity'
import { OSDLiveEvent, SharedState, reducer as sharedStateReducer } from './shared'
import { createReducer as createResponseReducer } from './response'
import { reducer as connectivityReducer, ConnectivityState } from './connectivity'
import * as Response from '../api/Responses'
import { BaseAppState } from './base'

const initialEvent: OSDLiveEvent = {
  name: "Some event",
  id: uuid(),
  components: [],
  lists: []
}

const initialState: ControlAppState = {
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
}

export interface ControlAppState extends BaseAppState {
  shared: SharedState;
  connectivity: ConnectivityState;
}

type ControlAppReducer = (state: ControlAppState, action: ControlActions.Action) => ControlAppState

export function createReducer(): ControlAppReducer {
  const responseReducer = createResponseReducer<ControlAppState>()
  return (state = initialState, action): ControlAppState => {
    if (ControlActions.isWebsocketAction(action)) {
      const message = JSON.parse(action.payload.message)
      if (Response.isResponseMessage(message)) {
        return responseReducer(message, state)
      } else {
        const r = {...state, shared: sharedStateReducer(state.shared, message) }
        console.log(r)
        return r
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