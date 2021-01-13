import { genericMatcher, GenericPattern, AnnotatedType, TypeMap } from '../api/PatternHelpers'

export enum EditPaneType {
  Component = 'Component',
  Event = 'Event'
}

export type EditPane = ComponentEditPane | EventEditPane

export type Pattern<T> = GenericPattern<TypeMap<EditPaneType, EditPane>, T>

interface BasePane<T extends EditPaneType> extends AnnotatedType<T> {
  id: string;
}

export type ComponentEditPane = BasePane<EditPaneType.Component>

export type EventEditPane = BasePane<EditPaneType.Event>

export const matcher: <T>(pattern: Pattern<T>) => (pane: EditPane) => T = genericMatcher