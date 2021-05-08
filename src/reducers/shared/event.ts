import { OSDLiveEvent, SharedState, OnScreenComponent } from '../shared'
import * as Event from '../../api/Events'
import { MessageType as M } from '../../api/Events'
import { removeComponentFromList } from './component'
import { OSDComponents } from '../../OSDComponent'
import { validParameterName } from '../../libs/events'
import { reorder } from '../../libs/lists'
import { assertNever } from '../../api/PatternHelpers'

function clearDisplays(state: SharedState, event: OSDLiveEvent): SharedState {
  const displays = state.displays.map((display) => {
    const onScreenComponents = event.components.map((c): OnScreenComponent => {
      return {
        id: c,
        state: "hidden",
        transitionInTimeMs: 1000,
        transitionOutTimeMs: 1000,
        stateStartTimeMs: Date.now()
      }
    })
    return {
      ...display,
      onScreenComponents
    }
  })
  return {
    ...state,
    displays
  }
}

function updateDisplays(state: SharedState, event: OSDLiveEvent): SharedState {
  if (state.settings.eventId === event.id) {
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
  if (event && !event.components.includes(action.componentId)) {
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

function MoveComponent(action: Event.MoveComponent, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    const newEvent: OSDLiveEvent = {
      ...event,
      components: reorder(event.components, action.sourcePosition, action.destinationPosition)
    }
    return updateDisplays({ // todo: should moving a component really trigger a display update?
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
  const newEvent: OSDLiveEvent = {
    name: action.name,
    id: action.id,
    components: [],
    lists: [{
      name: "quick",
      listType: "picked",
      components: [null, null, null, null, null]
    }],
    ...action.event
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
  if (state.settings.eventId !== action.id) {
    const { [action.id]: ignored, ...rest } = state.events;
    return {
      ...state,
      events: rest,
    }
  }
  console.warn("Refusing to delete current event")
  return state
}

function removeComponent(
  components: OSDComponents,
  id: string
): OSDComponents {
  const { [id]: ignored, ...rest } = components;
  return rest
}

function RemoveComponent(action: Event.RemoveComponent, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    const component = state.components[action.componentId]
    const sharedComponent = component ? component.shared : true

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
      },
      components: sharedComponent ?
        state.components :
        removeComponent(state.components, action.componentId)
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
      return clearDisplays({
        ...state,
        events: {
          ...state.events,
          [event.id]: {
            ...event,
            lists
          }
        },
        settings: {
          ...state.settings,
          eventId: action.id,
        }
      }, event)
    }
    return clearDisplays({
      ...state,
      settings: {
        ...state.settings,
        eventId: action.id,
      }
    }, event)
  }
  console.warn(`Attempted to load mising event ${action.id}`)
  return state
}

function Update(action: Event.Update, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    const newEvent = {
      ...event,
      ...action.event,
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

function UpsertParameter(action: Event.UpsertParameter, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event && validParameterName(action.name)) {
    const newEvent = {
      ...event,
      parameters: {
        ...(event.parameters || {}),
        [action.name]: action.value,
      }
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

function RemoveParameter(action: Event.RemoveParameter, state: SharedState): SharedState {
  const event = state.events[action.id]
  if (event) {
    const { [action.name]: ignored, ...parameters } = event.parameters || {};
    const newEvent: OSDLiveEvent = {
      ...event,
      parameters,
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

export function reduce(message: Event.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.AddComponent: return AddComponent(message, state)
    case M.MoveComponent: return MoveComponent(message, state)
    case M.Create: return CreateEvent(message, state)
    case M.Delete: return DeleteEvent(message, state)
    case M.RemoveComponent: return RemoveComponent(message, state)
    case M.Update: return Update(message, state)
    case M.Load: return Load(message, state)
    case M.UpsertParameter: return UpsertParameter(message, state)
    case M.RemoveParameter: return RemoveParameter(message, state)
    default: return assertNever(message)
  }
}