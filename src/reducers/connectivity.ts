import { ClientStatus } from "../api/Responses"
import * as Connectivity from "../actions/connectivity"

export interface ConnectivityState {
  serverName: string | undefined;
  connected: boolean;
  clients: ClientStatus[];
  lastPong: number;
}

export function reducer(state: ConnectivityState, action: Connectivity.Action): ConnectivityState {
  if (action.type === Connectivity.ActionType.Disconnected) {
    return {
      ...state,
      connected: false,
    }
  }
  return state
}