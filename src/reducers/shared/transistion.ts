import * as Transistion from '../../api/Transitions'
import { MessageType as M } from '../../api/Transitions'
import { SharedState, OnScreenComponent, Display } from '../shared'
import { assertNever } from '../../api/PatternHelpers'

function goTransistion(action: Transistion.GoTransistion, state: SharedState): SharedState {
  const selectedDisplay = state.displays.find((display) => display.id === action.displayId)
  if (selectedDisplay && action.inComponentId) {
    const onScreenComponents: OnScreenComponent[] = selectedDisplay.onScreenComponents.map(
      (otherOnScreenComponent) => {
      if (otherOnScreenComponent.id === action.inComponentId) {
        return { ...otherOnScreenComponent, state: "entering" }
      } else if (otherOnScreenComponent.state === "visible" || otherOnScreenComponent.state === "entering") {
        return { ...otherOnScreenComponent, state: "exiting" }
      }
      return otherOnScreenComponent
    })
    const updatedLiveDisplay: Display = {
      ...selectedDisplay,
      onScreenComponents
    }
    return {
      ...state,
      displays: state.displays.map((display) =>
        display.id === selectedDisplay?.id ? updatedLiveDisplay : display
      )
    }
  }


  if (selectedDisplay && action.outComponentId) {
    const onScreenComponents: OnScreenComponent[] = selectedDisplay.onScreenComponents.map(
      (component) =>
      component.id === action.outComponentId ? { ...component, state: "exiting" } : component
    )
    const updatedLiveDisplay: Display = {
      ...selectedDisplay,
      onScreenComponents
    }
    return {
      ...state,
      displays: state.displays.map((display) =>
        display.id === selectedDisplay?.id ? updatedLiveDisplay : display
      )
    }
  }

  return state;
}

export function reduce(message: Transistion.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.Go: return goTransistion(message, state)
    default: return assertNever(message.type)
  }
}