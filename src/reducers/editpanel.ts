import * as EditPanel from "../actions/editpanel"
import { curry } from '../api/FunctionalHelpers'
import { EditPane } from "../types/editpane"

export interface EditPanelState {
  panes: EditPane[];
  selected: string | undefined;
}

function findNewSelectedTab(
  oldPanes: EditPane[],
  newPanes: EditPane[],
  removedId: string
): string | undefined {
  if (newPanes.length === 0) {
    return undefined
  }
  const index = oldPanes.findIndex((pane) => pane.id === removedId)
  const newIndex = index < 0 || index >= newPanes.length ? newPanes.length - 1 : index
  return newPanes[newIndex]?.id
}

function handleClose(action: EditPanel.Close, state: EditPanelState): EditPanelState {
  const panes = state.panes.filter((pane) => pane.id !== action.id)
  return {
    ...state,
    panes,
    selected: state.selected === action.id ?
      findNewSelectedTab(state.panes, panes, action.id) : state.selected
  }
}

function handleSelect(action: EditPanel.Select, state: EditPanelState): EditPanelState {
  if (state.panes.some((p) => p.id === action.id)) {
    return {
      ...state,
      selected: action.id
    }
  } else {
    return state
  }
}

function handleOpen(action: EditPanel.Open, state: EditPanelState): EditPanelState {
  const panes = state.panes.some((c) => c.id === action.pane.id) ?
    state.panes : state.panes.concat([action.pane]);
  return {
    ...state,
    panes: panes.length < 5 ? panes : panes.slice(1),
    selected: action.pane.id
  }
}

const reducerPattern: EditPanel.Pattern<(state: EditPanelState) => EditPanelState> = {
  [EditPanel.ActionType.Close]: curry(handleClose),
  [EditPanel.ActionType.Open]: curry(handleOpen),
  [EditPanel.ActionType.Select]: curry(handleSelect)
}

export function reducer(state: EditPanelState, action: EditPanel.Action): EditPanelState {
  return EditPanel.matcher(reducerPattern)(action)(state)
}