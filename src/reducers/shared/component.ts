import { curry } from '../../api/FunctionalHelpers'
import { SharedState } from '../shared'
import * as Component from '../../api/Components'

function createLowerThird(action: Component.CreateLowerThird, state: SharedState): SharedState {
  const component = action.component
  // const live = state.displays.find((display) => display.name == "live")
  // const event = state.events.find((event) => event.id == live?.eventId)
  // if (event) {
  //   const currentEvent: OSDLiveEvent = {
  //     ...event,
  //     components: event.components.concat([component.id])
  //   }
  //   const displays = state.displays.map((display) => {
  //     if (display.name == "live") {
  //       const onScreenComponent: OnScreenComponent = {
  //         id: component.id,
  //         state: "hidden",
  //         transitionInTimeMs: 1000,
  //         transitionOutTimeMs: 1000,
  //         stateStartTimeMs: Date.now()
  //       }
  //       const onScreenComponents = display.onScreenComponents.concat([onScreenComponent])
  //       return {
  //         ...display,
  //         onScreenComponents
  //       }
  //     }
  //     return display
  //   })
    
    return {
      ...state,
//      displays,
      components: state.components.concat([component]),
//      events: state.events.map((event) => event.id == currentEvent.id ? currentEvent : event)
    }
  // }
  // return state
}

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