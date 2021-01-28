import * as Display from './Displays'
import { MessageType as M } from './Displays'
import { Display as OSDDisplay } from '../reducers/shared'
import { assertNever } from './PatternHelpers'

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

export function reduce(message: Display.Message, state: State): State {
  switch (message.type) {
    case M.Create: return create(message, state)
    case M.Delete: return deleteDisplay(message, state)
    case M.Update: return update(message, state)
    default: return assertNever(message)
  }
}