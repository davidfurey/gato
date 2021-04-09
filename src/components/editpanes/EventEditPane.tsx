import React from 'react';
import * as EditPane from '../../types/editpane';
import { ComponentType, OSDLiveEvent, Themes } from '../../reducers/shared';
import { OSDComponents } from '../../OSDComponent';
import { Container } from 'react-bootstrap';
import './EventEditPane.css'
import { MetadataPanel } from './event/MetadataPanel';
import { ComponentsPanel } from './event/ComponentsPanel';
import { ListPanel } from './event/ListPanel';

export interface ComponentActions {
  add: (componentId: string) => void;
  remove: (componentId: string) => void;
  new: (componentId: string, name: string, type: string, styleId: string | null) => void;
  move: (componentId: string, from: number, to: number) => void;
}

export interface ListActions {
  move: (
    listName: string,
    componentId: string | null,
    from: number,
    to: number
  ) => void;
  remove: (listName: string, index: number, componentId: string | null) => void;
  add: (listName: string, index: number, componentId: string | null) => void;
  set: (listName: string, index: number, id: string) => void;
}

export interface EventEditPaneProps {
  pane: EditPane.EventEditPane;
  event: OSDLiveEvent;
  openTab: (pane: EditPane.EditPane) => void;
  componentActions: ComponentActions;
  updateEvent: (event: Partial<OSDLiveEvent>) => void;
  listActions: ListActions;
  upsertParameter: (name: string, value: string) => void;
  removeParameter: (name: string) => void;
  components: OSDComponents;
  themes: Themes;
  defaultStyles: Record<ComponentType, string | null>;
}

export function EventEditPane(props: EventEditPaneProps): JSX.Element {
  return <Container className="mt-3 mb-3 event-edit-pane">
    <MetadataPanel
      event={props.event}
      updateEvent={props.updateEvent}
      upsertParameter={props.upsertParameter}
      removeParameter={props.removeParameter}
      themes={props.themes}
    />
    <ComponentsPanel
      event={props.event}
      {...props.componentActions}
      components={props.components}
      openTab={props.openTab}
      defaultStyles={props.defaultStyles}
    />
    {props.event.lists.map((eList, index) =>
      <ListPanel
        key={index}
        list={eList}
        eventComponents={props.event.components.flatMap((id) => props.components[id] || [])}
        components={props.components}
        event={props.event}
        {...props.listActions}
      />
    )}
  </Container>
}