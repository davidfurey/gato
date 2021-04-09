import { SharedState } from '../shared'
import * as Style from '../../api/Styles'
import { MessageType as M } from '../../api/Styles'
import { assertNever } from '../../api/PatternHelpers'
import { isAncestor } from '../../components/ParentSelector'

function createStyle(action: Style.Create, state: SharedState): SharedState {
  return {
    ...state,
    styles: {
      ...state.styles,
      [action.style.id]: {
        ...action.style,
      }
    }
  }
}

function updateStyle(action: Style.Update, state: SharedState): SharedState {
  const style = state.styles[action.id]
  if (style) {
    const updatedStyle = {
      ...style,
      ...action.style
    }
    if (style.parent && isAncestor(style.id, style.parent, state.styles)) {
      console.warn("Attempted to create parent/child style loop")
      return state
    } else {
      return {
        ...state,
        styles: {
          ...state.styles,
          [action.id]: updatedStyle
        }
      }
    }
  } else {
    console.warn("Attempted to update missing style")
    return state
  }
}

function deleteStyle(action: Style.Delete, state: SharedState): SharedState {
  const { [action.id]: ignored, ...rest } = state.styles;

  const objectMap = <T>(obj: { [key: string]: T }, fn: (pv: T, pk: string, pi: number) => T):
  { [key: string]: T } => Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

  const components = objectMap(state.components, (component) =>
    component.style === action.id ?
      {
        ...component,
        style: undefined
      } : component
  )

  const styles = objectMap(rest, (style) =>
    style.parent === action.id ?
      {
        ...style,
        parent: null
      } : style
  )

  return {
    ...state,
    components,
    styles: styles,
  }
}

export function reduce(message: Style.Message, state: SharedState): SharedState {
  switch (message.type) {
    case M.Create: return createStyle(message, state)
    case M.Delete: return deleteStyle(message, state)
    case M.Update: return updateStyle(message, state)
    default: return assertNever(message)
  }
}