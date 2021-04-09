import { assertNever } from '../api/PatternHelpers'
import * as Response from '../api/Responses'
import { MessageType as M } from '../api/Responses'
import { BaseAppState } from '../reducers/base'

function handleNewState<T extends BaseAppState>(
  action: Response.State,
  state: T
): T {
    return { ...state, shared: action.state }
}

function compareClientStatus(a: Response.ClientStatus, b: Response.ClientStatus): boolean {
  return a.name === b.name &&
    a.interface === b.interface &&
    a.screenName === b.screenName &&
    a.connected === b.connected &&
    a.id === b.id
}

function compareClientsStatus(a: Response.ClientStatus[], b: Response.ClientStatus[]): boolean {
  return a.every((item, index) => {
    const bItem = b[index]
    return bItem && compareClientStatus(item, bItem)
  })
}

function pong<T extends BaseAppState>(
  action: Response.Pong,
  state: T
): T {
  return {
    ...state,
    connectivity: {
      ...state.connectivity,
      clients: compareClientsStatus(action.clients, state.connectivity.clients) ?
        state.connectivity.clients : action.clients,
      lastPong: Date.now(),
      connected: true
    }
  }
}

export function createReducer<T extends BaseAppState>
  (): (message: Response.Message, state: T) => T {
  return (message: Response.Message, state: T) => {
    switch (message.type) {
      case M.SharedState: return handleNewState(message, state)
      case M.Pong: return pong(message, state)
      default: return assertNever(message)
    }
  }
}