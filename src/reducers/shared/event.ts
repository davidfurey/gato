import { curry } from '../../api/FunctionalHelpers'
import { OSDLiveEvent, SharedState, OnScreenComponent } from '../shared'
import * as Event from '../../api/Events'
import { removeComponentFromList } from './component'

function updateDisplays(state: SharedState, event: OSDLiveEvent): SharedState {
  if (state.eventId === event.id) {
    const displays = state.displays.map((display) => {
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

function CreateEvent(action: Event.Create, state: SharedState): SharedState {
  const newEvent = {
    name: action.name,
    id: action.id,
    components: [],
    lists: [],
  }
  return {
    ...state,
    events: {
      ...state.events,
      [newEvent.id]: newEvent
    }
  }
}

function DeleteEvent(action: Event.Delete, state: SharedState): SharedState {
  // todo: if event has private components, deleting the events should delete the components
  if (state.eventId !== action.id) {
    const { [action.id]: ignored, ...rest } = state.events;
    return {
      ...state,
      events: rest,
    }
  }
  console.warn("Refusing to delete current event")
  return state
}

function RemoveComponent(action: Event.RemoveComponent, state: SharedState): SharedState {
  // todo: if component is private, removing it should delete it
  const event = state.events[action.id]
  if (event) {
    const newEvent = {
      ...event,
      components: event.components.filter((c) => c !== action.componentId),
      lists: event.lists.map((ls) => removeComponentFromList(ls, action.componentId)),
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

function Load(action: Event.Load, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    if (!event.lists.some((ls) => ls.listType === "picked")) {
      const lists = event.lists.concat({
        name: "quick",
        listType: "picked",
        components: [null, null, null, null, null]
      })
      return updateDisplays({
        ...state,
        events: {
          ...state.events,
          [event.id]: {
            ...event,
            lists
          }
        },
        eventId: action.id,
      }, state.events[action.id])
    }
    return updateDisplays({
      ...state,
      eventId: action.id,
    }, state.events[action.id])
  }
  console.warn(`Attempted to load mising event ${action.id}`)
  return state
}

function Update(action: Event.Update, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    const newEvent = {
      ...event,
      name: action.name,
    }

    return {
      ...state,
      events: {
        ...state.events,
        [action.id]: newEvent
      }
    }
  }
  return state
}

const reducer: Event.Pattern<(s: SharedState) => SharedState> = {
  [Event.MessageType.AddComponent]: curry(AddComponent),
  [Event.MessageType.Create]: curry(CreateEvent),
  [Event.MessageType.Delete]: curry(DeleteEvent),
  [Event.MessageType.RemoveComponent]: curry(RemoveComponent),
  [Event.MessageType.Update]: curry(Update),
  [Event.MessageType.Load]: curry(Load)
}

export function reduce(message: Event.Message, state: SharedState): SharedState {
  return Event.matcher(reducer)(message)(state)
}