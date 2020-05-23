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

function updateComponent(action: Component.Update, state: SharedState): SharedState {
  return {
    ...state,
    components: { 
      ...state.components,
      [action.component.id]: action.component
    }
  }
}

export function removeComponentFromList(l: ComponentList, componentId: string): ComponentList {
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
  const { [action.id]: ignored, ...rest } = state.components;

  const objectMap = <T>(obj: { [key: string]: T }, fn: (pv: T, pk: string, pi: number) => T): 
  { [key: string]: T } => Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
  
  const events = objectMap(state.events, (event) => {
    if (event.components.includes(action.id)) {
      return {
        ...event,
        components: event.components.filter((c) => c !== action.id),
        lists: event.lists.map((ls) => removeComponentFromList(ls, action.id)),
      }
    }
    return event
  })

  return {
    ...state,
    events,
    components: rest,
    groups: state.groups.map((group) => deleteComponentFromGroup(group, action.id)),
    displays: state.displays.map((display) => deleteFromDisplay(display, action.id))
  }
}

const notImplemented = (_: Component.Message) => (state: SharedState): SharedState => {
  return state
}

const reducer: Component.Pattern<(s: SharedState) => SharedState> = {
  [Component.MessageType.CreateLowerThird]: curry(createLowerThird),
  [Component.MessageType.Create]: notImplemented,
  [Component.MessageType.Delete]: curry(deleteComponent),
  [Component.MessageType.Update]: curry(updateComponent),
}

export function reduce(message: Component.Message, state: SharedState): SharedState {
  return Component.matcher(reducer)(message)(state)
}