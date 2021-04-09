import { v4 as uuid } from 'uuid';
import * as ViewActions from '../actions/viewapp'
import * as Connectivity from '../actions/connectivity'
import { OSDLiveEvent, SharedState, reducer as sharedStateReducer } from './shared'
import { createReducer as createResponseReducer } from './response'
import { reducer as connectivityReducer, ConnectivityState } from './connectivity'
import * as Response from '../api/Responses'
import { BaseAppState } from './base'
import { Message } from '../api/Messages';

const initialEvent: OSDLiveEvent = {
  name: "Some event",
  id: uuid(),
  components: [],
  lists: []
}

const initialState: ViewerAppState = {
  shared: {
    components: {},
    events: { [initialEvent.id]: initialEvent },
    displays: [],
    themes: {},
    styles: {},
    settings: {
      eventId: initialEvent.id,
      defaultStyles: {
        'image': null,
        'lower-thirds': null,
        'slide': null
      }
    },
  },
  connectivity: {
    serverName: undefined,
    connected: false,
    clients: [],
    lastPong: 0,
  },
}

export interface ViewerAppState extends BaseAppState {
  shared: SharedState;
  connectivity: ConnectivityState;
}

type ViewerAppReducer = (
  state: ViewerAppState | undefined,
  action: ViewActions.Action
) => ViewerAppState

export function createReducer(): ViewerAppReducer {
  const responseReducer = createResponseReducer<ViewerAppState>()

  return (state = initialState, action): ViewerAppState => {
    if (ViewActions.isWebsocketAction(action)) {
      const message = JSON.parse(action.payload.message) as Message
      if (Response.isResponseMessage(message)) {
        return responseReducer(message, state)
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