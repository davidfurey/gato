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

function pong<T extends BaseAppState>(
  action: Response.Pong,
  state: T
): T {
  return {
    ...state,
    connectivity: {
      ...state.connectivity,
      clients: action.clients,
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