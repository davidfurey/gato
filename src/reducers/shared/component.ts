import { SharedState, ComponentList, Display } from '../shared'
import * as Component from '../../api/Components'
import { MessageType as M } from '../../api/Components'
import * as LowerThirds from '../../components/OSDComponents/LowerThirdsComponent'
import * as Image from '../../components/OSDComponents/ImageComponent'
import * as Slide from '../../components/OSDComponents/SlideComponent'
import { assertNever } from '../../api/PatternHelpers'

if (!Object.fromEntries) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  Object.fromEntries = function fromEntries(iterable: any): any {
    return [...iterable].reduce((obj, [key, val]) => {
      obj[key] = val
      return obj
    }, {})
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  /* eslint-enable @typescript-eslint/no-unsafe-return */
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */
}

function createLowerThird(action: Component.CreateLowerThird, state: SharedState): SharedState {
  return {
    ...state,
    components: {
      ...state.components,
      [action.component.id]: action.component
    }
  }
}

function create(action: Component.Create, state: SharedState): SharedState {
  if (action.component.type === LowerThirds.LowerThirdsType) {
    return {
      ...state,
      components: {
        ...state.components,
        [action.component.id]: {
          ...LowerThirds.template,
          ...action.component,
        }
      }
    }
  } else if (action.component.type === Image.ImageType) {
    return {
      ...state,
      components: {
        ...state.components,
        [action.component.id]: {
          ...Image.template,
          ...action.component,
        }
      }
    }
  } else if (action.component.type === Slide.SlideType) {
    return {
      ...state,
      components: {
        ...state.components,
        [action.component.id]: {
          ...Slide.template,
          ...action.component,
        }
      }
    }
  } else {
    console.warn("Unsupported component type")
    return state
  }
}

function updateComponent(action: Component.Update, state: SharedState): SharedState {
  const component = state.components[action.id]
  if (component) {
    return {
      ...state,
      components: {
        ...state.components,
        [action.id]: {
          ...component,
          ...action.component
        }
      }
    }
  } else {
    console.warn("Attempted to update missing component")
    return state
  }
}

function share(action: Component.Share, state: SharedState): SharedState {
  const component = state.components[action.id]
  if (component) {
    return {
      ...state,
      components: {
        ...state.components,
        [action.id]: {
          ...component,
          shared: true,
        }
      }
    }
  } else {
    console.warn("Attempted to share missing component")
    return state
  }
}

function unshare(action: Component.Unshare, state: SharedState): SharedState {
  const component = state.components[action.id]

  if (component) {
    const eventsUsingComponent = Object.values(
        state.events
    ).reduce((acc, curr) => acc + (curr.components.includes(action.id) ? 1 : 0), 0)

    if (eventsUsingComponent === 1) {
      return {
        ...state,
        components: {
          ...state.components,
          [action.id]: {
            ...component,
            shared: false,
          }
        }
      }
    } else {
      console.warn(`Refusing to unshare component in use by ${eventsUsingComponent} events`)
      return state;
    }
  } else {
    console.warn("Attempted to unshare missing component")
    return state
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
    displays: state.displays.map((display) => deleteFromDisplay(display, action.id))
  }
}

export function reduce(message: Component.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.CreateLowerThird: return createLowerThird(message, state)
    case M.Create: return create(message, state)
    case M.Delete: return deleteComponent(message, state)
    case M.Update: return updateComponent(message, state)
    case M.Share: return share(message, state)
    case M.Unshare: return unshare(message, state)
    default: return assertNever(message)
  }
}