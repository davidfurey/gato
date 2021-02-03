import React from 'react';
import * as EditPane from '../../types/editpane';
import { OSDLiveEvent } from '../../reducers/shared';
import { OSDComponent } from '../../OSDComponent';
import { Container } from 'react-bootstrap';
import './EventEditPane.css'
import { MetadataPanel } from './event/MetadataPanel';
import { ComponentsPanel } from './event/ComponentsPanel';
import { ListPanel } from './event/ListPanel';

export interface ComponentActions {
  add: (componentId: string) => void;
  remove: (componentId: string) => void;
  new: (componentId: string, name: string, type: string) => void;
  move: (componentId: string, from: number, to: number) => void;
}

interface ListActions {
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
  upsertParameter: (id: string, name: string, value: string) => void;
  removeParameter: (id: string, name: string) => void;
  components: { [key: string]: OSDComponent };
}

export function EventEditPane(props: EventEditPaneProps): JSX.Element {
  const eventComponents = props.event.components.flatMap((id) => props.components[id] || [])
  return <Container className="mt-3 mb-3 event-edit-pane">
    <MetadataPanel
      event={props.event}
      updateEvent={props.updateEvent}
      upsertParameter={props.upsertParameter}
      removeParameter={props.removeParameter}
    />
    <ComponentsPanel
      event={props.event}
      componentActions={props.componentActions}
      components={props.components}
      openTab={props.openTab}
    />
    {props.event.lists.map((eList, index) =>
      <ListPanel
        key={index}
        list={eList}
        eventComponents={eventComponents}
        components={props.components}
        event={props.event}
        listActions={props.listActions}
      />
    )}
  </Container>
}