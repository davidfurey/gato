import { AnnotatedType, TypeMap, isTypeGroup, GenericPattern, genericMatcher } from "../api/PatternHelpers";
import { EditPane, EditPaneType } from "../types/editpane";

export enum ActionType {
  Close = 'EditPanel/Close',
  Select = 'EditPanel/Select',
  Open = 'EditPanel/Open'
}

export type Action = Close | Select | Open

export interface Close extends AnnotatedType<ActionType.Close> {
  id: string;
}

export interface Select extends AnnotatedType<ActionType.Select> {
  id: string;
}

export interface Open extends AnnotatedType<ActionType.Open> {
  pane: EditPane;
}

export const isEditPanelAction = isTypeGroup<string, Action>("EditPanel/")

export type Pattern<T> = GenericPattern<TypeMap<ActionType, Action>, T>
export const matcher: <T>(pattern: Pattern<T>) => (message: Action) => T = genericMatcher
