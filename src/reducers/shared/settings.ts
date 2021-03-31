import { SharedState } from '../shared'
import * as Settings from '../../api/Settings'
import { MessageType as M } from '../../api/Settings'
import { assertNever } from '../../api/PatternHelpers'

function updateSettings(action: Settings.UpdateParameter, state: SharedState): SharedState {
  return {
    ...state,
    settings: {
      ...state.settings,
      [action.name]: action.value
    }
  }
}

export function reduce(message: Settings.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.UpdateParameter: return updateSettings(message, state)
    default: return assertNever(message.type)
  }
}