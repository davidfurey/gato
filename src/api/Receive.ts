import * as Display from './Displays'
import { Display as OSDDisplay } from '../reducers/shared'
import { curry } from './FunctionalHelpers'

interface State {
  displays: OSDDisplay[];
}

function create(msg: Display.Create, state: State): State {
  return {
    ...state,
    displays: state.displays.concat({
      name: msg.name,
      id: msg.id,
      resolution: msg.resolution,
      onScreenComponents:  [],
      type: "OnAir"
    })
  }
}

function deleteDisplay(msg: Display.Delete, state: State): State { 
  return {
    ...state,
    displays: state.displays.filter((display) => display.id !== msg.id)
  }
}

function update(msg: Display.Update, state: State): State {
  return {
    ...state,
    displays: state.displays.map((display) => {
      if (display.id === msg.id) {
        return {
          eventId: msg.eventId,
          name: msg.name,
          id: msg.id,
          resolution: msg.resolution,
          onScreenComponents:  [],
          type: "OnAir"
        }
      } else {
        return display
      }
    })
  }
} 

export const reducer: Display.Pattern<(s: State) => State> = {
  [Display.MessageType.Create]: curry(create),
  [Display.MessageType.Delete]: curry(deleteDisplay),
  [Display.MessageType.Update]: curry(update)
}

export function reduce(message: Display.Message, state: State): State {
  return Display.matcher(reducer)(message)(state)
}