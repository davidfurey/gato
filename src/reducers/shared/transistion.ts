import * as Transistion from '../../api/Transitions'
import { curry } from '../../api/FunctionalHelpers'
import { SharedState, OnScreenComponent, Display } from '../shared'
import { OSDComponent } from '../../OSDComponent'

function componentFromComponents(components: OSDComponent[], id: string): OSDComponent | undefined {
  return components.find((c) => c.id === id)
}

function goTransistion(action: Transistion.GoTransistion, state: SharedState): SharedState {
  const selectedDisplay = state.displays.find((display) => display.id === action.displayId)
  if (selectedDisplay && action.inComponentId) {
    const component = componentFromComponents(state.components, action.inComponentId)
    if (component?.type === "lower-thirds") {
      const onScreenComponents: OnScreenComponent[] = selectedDisplay.onScreenComponents.map(
        (otherOnScreenComponent) => {
        const otherComponent = componentFromComponents(state.components, otherOnScreenComponent.id)
        if (otherComponent?.type === "lower-thirds") {
          if (otherOnScreenComponent.id === action.inComponentId) {
            return { ...otherOnScreenComponent, state: "entering" }
          } else if (otherOnScreenComponent.state === "visible" || otherOnScreenComponent.state === "entering") {
            return { ...otherOnScreenComponent, state: "exiting" }
          }
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

const reducer: Transistion.Pattern<(s: SharedState) => SharedState> = {
  [Transistion.MessageType.Go]: curry(goTransistion),
}

export function reduce(message: Transistion.Message, state: SharedState): SharedState {
  return Transistion.matcher(reducer)(message)(state)
}