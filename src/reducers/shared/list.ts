import { SharedState, OSDLiveEvent } from '../shared'
import * as List from '../../api/Lists'
import { MessageType as M } from '../../api/Lists'
import { reorder } from '../../libs/lists'
import { assertNever } from '../../api/PatternHelpers'

function updateEvent(
  eventId: string,
  update: (event: OSDLiveEvent) => OSDLiveEvent,
  state: SharedState
): SharedState {
  const event = state.events[eventId]
  if (event) {
    return {
      ...state,
      events: {
        ...state.events,
        [eventId]: update(event)
      }
    }
  } else {
    return state
  }
}

function create(action: List.Create, state: SharedState): SharedState {
  return updateEvent(action.eventId, (event) => {
    return {
      ...event,
      lists: event.lists.concat([
        {
          name: action.name,
          listType: action.listType,
          components: []
        }
      ])
    }
  }, state)
}

function addComponent(action: List.AddComponent, state: SharedState): SharedState {
  return updateEvent(action.eventId, (event) => {
    return {
      ...event,
      lists: event.lists.map((l) => {
        if (l.name === action.name) {
          return {
            ...l,
            components: l.components.slice(
              0, action.position
            ).concat(
              action.componentId
            ).concat(l.components.slice(action.position))
          }
        } else {
          return l
        }
      })
    }
  }, state)
}

function removeComponent(action: List.RemoveComponent, state: SharedState): SharedState {
  return updateEvent(action.eventId, (event) => {
    return {
      ...event,
      lists: event.lists.map((l) => {
        if (l.name === action.name) {
          return {
            ...l,
            components: l.components.filter((c, index) =>
              index !== action.position || c !== action.componentId
            )
          }
        } else {
          return l
        }
      })
    }
  }, state)
}

function moveComponent(action: List.MoveComponent, state: SharedState): SharedState {
  return updateEvent(action.eventId, (event) => {
    return {
      ...event,
      lists: event.lists.map((l) => {
        if (l.name === action.name && l.components[action.sourcePosition] === action.componentId) {
          return {
            ...l,
            components: reorder(l.components, action.sourcePosition, action.destinationPosition)
          }
        } else {
          return l
        }
      })
    }
  }, state)
}

function replaceItem(action: List.ReplaceItem, state: SharedState): SharedState {
  return updateEvent(action.eventId, (event) => {
    return {
      ...event,
      lists: event.lists.map((l) => {
        if (l.name === action.name) {
          return {
            ...l,
            components:
              l.components.slice(
                0, action.position
              ).concat(
                action.componentId
              ).concat(l.components.slice(action.position + 1))
          }
        } else {
          return l
        }
      })
    }
  }, state)
}

export function reduce(message: List.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.AddComponent: return addComponent(message, state)
    case M.RemoveComponent: return removeComponent(message, state)
    case M.Create: return create(message, state)
    case M.MoveComponent: return moveComponent(message, state)
    case M.ReplaceItem: return replaceItem(message, state)
    default: return assertNever(message)
  }
}