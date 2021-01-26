import { curry } from '../../api/FunctionalHelpers'
import { SharedState, OSDLiveEvent } from '../shared'
import * as List from '../../api/Lists'
import { reorder } from '../../libs/lists'

function updateEvent(
  eventId: string,
  update: (event: OSDLiveEvent) => OSDLiveEvent,
  state: SharedState
): SharedState {
  if (state.events[eventId]) {
    return {
      ...state,
      events: {
        ...state.events,
        [eventId]: update(state.events[eventId])
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

const reducer: List.Pattern<(s: SharedState) => SharedState> = {
  [List.MessageType.AddComponent]: curry(addComponent),
  [List.MessageType.RemoveComponent]: curry(removeComponent),
  [List.MessageType.Create]: curry(create),
  [List.MessageType.MoveComponent]: curry(moveComponent),
  [List.MessageType.ReplaceItem]: curry(replaceItem),
}

export function reduce(message: List.Message, state: SharedState): SharedState {
  return List.matcher(reducer)(message)(state)
}