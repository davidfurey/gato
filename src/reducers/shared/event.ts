import { curry } from '../../api/FunctionalHelpers'
import { OSDLiveEvent, SharedState, OnScreenComponent } from '../shared'
import * as Event from '../../api/Events'
import { removeComponentFromList } from './component'

function updateDisplays(state: SharedState, event: OSDLiveEvent): SharedState {
  if (state.displays.some((d) => d.eventId === event.id)) {
    const displays = state.displays.map((display) => {
      if (display.eventId === event.id) {
        const filteredComponets = display.onScreenComponents.filter(
          (c) => event.components.includes(c.id)
        )
        const missingIds = event.components.filter(
          (c) => !display.onScreenComponents.some((oc) => oc.id === c)
        )
        const missingComponents = missingIds.map((c): OnScreenComponent => {
          return {
            id: c,
            state: "hidden",
            transitionInTimeMs: 1000,
            transitionOutTimeMs: 1000,
            stateStartTimeMs: Date.now()
          }
        })
        const onScreenComponents = filteredComponets.concat(missingComponents)
        return {
          ...display,
          onScreenComponents
        }
      } else {
        return display
      }
    })
    return {
      ...state,
      displays
    }
  } else {
    return state;
  }
}

function AddComponent(action: Event.AddComponent, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    const newEvent = {
      ...event,
      components: event.components.concat(action.componentId)
    }
    return updateDisplays({
      ...state,
      events: {
        ...state.events,
        [newEvent.id]: newEvent
      }
    }, newEvent)
  }
  return state
}

function RemoveComponent(action: Event.RemoveComponent, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    const newEvent = {
      ...event,
      components: event.components.filter((c) => c !== action.componentId),
      lists: event.lists.map((ls) => removeComponentFromList(ls, action.id)),
    }

    return updateDisplays({
      ...state,
      events: {
        ...state.events,
        [action.id]: newEvent
      }
    }, newEvent)
  }
  return state
}

const notImplemented = (_: Event.Message) => (state: SharedState): SharedState => {
  return state
}

const reducer: Event.Pattern<(s: SharedState) => SharedState> = {
  [Event.MessageType.AddComponent]: curry(AddComponent),
  [Event.MessageType.Create]: notImplemented,
  [Event.MessageType.Delete]: notImplemented,
  [Event.MessageType.RemoveComponent]: curry(RemoveComponent),
  [Event.MessageType.Update]: notImplemented,
}

export function reduce(message: Event.Message, state: SharedState): SharedState {
  return Event.matcher(reducer)(message)(state)
}