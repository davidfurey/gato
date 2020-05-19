import { curry } from '../../api/FunctionalHelpers'
import { SharedState, ComponentList, OSDComponentsGroup, Display } from '../shared'
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

function deleteComponentFromList(l: ComponentList, componentId: string): ComponentList {
  if (l.components.includes(componentId)) {
    return {
      ...l,
      components: l.listType === "slideshow" ? 
        l.components.filter((c) => c !== componentId) : 
        l.components.map((c) => c === componentId ? null : c)
    }
  }
  return l
}

function deleteComponentFromGroup(
  group: OSDComponentsGroup, 
  componentId: string
): OSDComponentsGroup {
  return {
    ...group,
    components: group.components.filter((c) => c.id !== componentId)
  }
}

function deleteFromDisplay(
  display: Display, 
  componentId: string
): Display {
  return {
    ...display,
    onScreenComponents: display.onScreenComponents.filter((osc) => osc.id !== componentId),
  }
}

function deleteComponent(action: Component.Delete, state: SharedState): SharedState {
  const { [action.componentId]: ignored, ...rest } = state.components;

  const events = state.events.map((event) => {
    if (event.components.includes(action.componentId)) {
      return {
        ...event,
        components: event.components.filter((c) => c !== action.componentId),
        lists: event.lists.map((ls) => deleteComponentFromList(ls, action.componentId)),
      }
    }
    return event
  })

  return {
    ...state,
    events,
    components: rest,
    groups: state.groups.map((group) => deleteComponentFromGroup(group, action.componentId)),
    displays: state.displays.map((display) => deleteFromDisplay(display, action.componentId))
  }
}

const notImplemented = (_: Component.Message) => (state: SharedState): SharedState => {
  return state
}

const reducer: Component.Pattern<(s: SharedState) => SharedState> = {
  [Component.MessageType.CreateLowerThird]: curry(createLowerThird),
  [Component.MessageType.Create]: notImplemented,
  [Component.MessageType.Delete]: curry(deleteComponent),
}

export function reduce(message: Component.Message, state: SharedState): SharedState {
  return Component.matcher(reducer)(message)(state)
}