import { SharedState } from '../shared'
import * as Theme from '../../api/Themes'
import { MessageType as M } from '../../api/Themes'
import { assertNever } from '../../api/PatternHelpers'
import { isAncestor } from '../../components/ParentSelector'

function createTheme(action: Theme.Create, state: SharedState): SharedState {
  return {
    ...state,
    themes: {
      ...state.themes,
      [action.theme.id]: {
        ...action.theme,
      }
    }
  }
}

function updateTheme(action: Theme.Update, state: SharedState): SharedState {
  const theme = state.themes[action.id]
  if (theme) {
    const updatedTheme = {
      ...theme,
      ...action.theme
    }
    if (theme.parent && isAncestor(theme.id, theme.parent, state.themes)) {
      console.warn("Attempted to create parent/child theme loop")
      return state
    } else {
      return {
        ...state,
        themes: {
          ...state.themes,
          [action.id]: updatedTheme
        }
      }
    }
  } else {
    console.warn("Attempted to update missing theme")
    return state
  }
}

function deleteTheme(action: Theme.Delete, state: SharedState): SharedState {
  const { [action.id]: ignored, ...rest } = state.themes;

  const objectMap = <T>(obj: { [key: string]: T }, fn: (pv: T, pk: string, pi: number) => T):
  { [key: string]: T } => Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

  const events = objectMap(state.events, (event) =>
    event.theme === action.id ?
      {
        ...event,
        theme: undefined
      } : event
  )

  const themes = objectMap(rest, (theme) =>
    theme.parent === action.id ?
      {
        ...theme,
        parent: null
      } : theme
  )

  return {
    ...state,
    events,
    themes: themes,
  }
}

export function reduce(message: Theme.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.Create: return createTheme(message, state)
    case M.Delete: return deleteTheme(message, state)
    case M.Update: return updateTheme(message, state)
    default: return assertNever(message)
  }
}