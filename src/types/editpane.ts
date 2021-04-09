import { genericMatcher, GenericPattern, AnnotatedType, TypeMap } from '../api/PatternHelpers'

export enum EditPaneType {
  Component = 'Component',
  Event = 'Event',
  Theme = 'Theme',
  Style = 'Style'
}

export type EditPane = ComponentEditPane | EventEditPane | ThemeEditPane | StyleEditPane

export type Pattern<T> = GenericPattern<TypeMap<EditPaneType, EditPane>, T>

interface BasePane<T extends EditPaneType> extends AnnotatedType<T> {
  id: string;
}

export type ComponentEditPane = BasePane<EditPaneType.Component>

export type EventEditPane = BasePane<EditPaneType.Event>

export type ThemeEditPane = BasePane<EditPaneType.Theme>

export type StyleEditPane = BasePane<EditPaneType.Style>

export const matcher: <T>(pattern: Pattern<T>) => (pane: EditPane) => T = genericMatcher