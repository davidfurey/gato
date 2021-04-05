import { SharedState } from '../shared'
import * as Settings from '../../api/Settings'
import { MessageType as M } from '../../api/Settings'
import { assertNever } from '../../api/PatternHelpers'

function updateDefaultStyle(action: Settings.UpdateDefaultStyle, state: SharedState): SharedState {
  return {
    ...state,
    settings: {
      ...state.settings,
      defaultStyles: {
        ...state.settings.defaultStyles,
        [action.componentType]: action.styleId
      }
    }
  }
}

export function reduce(message: Settings.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.UpdateDefaultStyle: return updateDefaultStyle(message, state)
    default: return assertNever(message.type)
  }
}