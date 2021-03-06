import * as NavigationActions from '../actions/navigation';
import { Store } from 'redux'
import { EditPanelState } from '../reducers/editpanel';
import * as EditPane from '../types/editpane'

export function windowHashFromPanels(editPanel: EditPanelState): string {
  return editPanel.panes.map((pane) => {
    const flag = editPanel.selected === pane.id ? '*' : ''
    const type = EditPane.matcher({
      [EditPane.EditPaneType.Component]: () => "c",
      [EditPane.EditPaneType.Event]: () => "e",
      [EditPane.EditPaneType.Theme]: () => "t",
      [EditPane.EditPaneType.Style]: () => "s",
    })(pane)
    return `${type}${flag}=${pane.id}`
  }).join(",")
}

function paneType(letter: string): EditPane.EditPaneType | null {
  switch (letter) {
    case "c": return EditPane.EditPaneType.Component
    case "e": return EditPane.EditPaneType.Event
    case "t": return EditPane.EditPaneType.Theme
    case "s": return EditPane.EditPaneType.Style
    default: return null
  }
}

export function panelsFromWindowHash(hash: string): EditPanelState {
  const panes = hash.split(",").flatMap((s) => {
    const [key, value] = s.split("=")
    if (!(key && value)) {
      return []
    }
    const type = paneType(key[0] || "")
    if (type) {
      return [{
        id: value,
        type
      }]
    }
    return []
  })

  const selected: string | null = hash.split(",").filter((k) => k[1] === '*').map((s) => s.split("=")[1])[0] || null

  return {
    panes: panes.slice(0, 4),
    selected: selected || panes[0]?.id
  }
}

export function init(store: Pick<Store<{ windowHash: string | null }, NavigationActions.Action>, "dispatch" | "getState" | "subscribe">): void {
  function hashChanged(): void {
    const windowHash = window.location.hash.slice(1);
    store.dispatch({
      type: NavigationActions.ActionType.SetHash,
      windowHash
    });
  }

  hashChanged()

  store.subscribe(() => {
    const state = store.getState();
    if (window.location.hash !== state.windowHash && state.windowHash !== null) {
      window.location.hash = state.windowHash;
    }
  });

  window.addEventListener("hashchange", hashChanged, false);
}