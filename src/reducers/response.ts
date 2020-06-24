import { curry } from '../api/FunctionalHelpers'
import * as Response from '../api/Responses'
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

function reducer<T extends BaseAppState>(): Response.Pattern<(s: T) => T> {
  return {
    [Response.MessageType.SharedState]: curry(handleNewState),
    [Response.MessageType.Pong]: curry(pong)
  }
}

export function createReducer<T extends BaseAppState>(): (
  message: Response.Message,
  state: T
) => T {
  const matcher = Response.matcher(reducer<T>())
  return (message, state): T => matcher(message)(state)
}