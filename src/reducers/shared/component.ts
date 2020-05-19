import { curry } from '../../api/FunctionalHelpers'
import { SharedState } from '../shared'
import * as Component from '../../api/Components'

function createLowerThird(action: Component.CreateLowerThird, state: SharedState): SharedState {
  return {
    ...state,
    components: { 
      ...state.components,
      [action.component.id]: action.component
    }
  }
}

// function omit(key, obj) {
//   const { [key]: omitted, ...rest } = obj;
//   return rest;
// }

// function deleteComponent(action: Component.Delete, state: SharedState): SharedState {
//   return {
//     ...state,
//     components: state.components.concat([action.component]),
//   }
// }

const notImplemented = (_: Component.Message) => (state: SharedState): SharedState => {
  return state
}

const reducer: Component.Pattern<(s: SharedState) => SharedState> = {
  [Component.MessageType.CreateLowerThird]: curry(createLowerThird),
  [Component.MessageType.Create]: notImplemented,
  [Component.MessageType.Delete]: notImplemented,
}

export function reduce(message: Component.Message, state: SharedState): SharedState {
  return Component.matcher(reducer)(message)(state)
}