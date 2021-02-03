import React from 'react';
import * as EditPane from '../../types/editpane';
import { OSDLiveEvent } from '../../reducers/shared';
import { OSDComponent } from '../../OSDComponent';
import { Container } from 'react-bootstrap';
import './EventEditPane.css'
import { MetadataPanel } from './event/MetadataPanel';
import { ComponentsPanel } from './event/ComponentsPanel';
import { ListPanel } from './event/ListPanel';

export interface EventEditPaneProps {
  pane: EditPane.EventEditPane;
  event: OSDLiveEvent;
  openTab: (pane: EditPane.EditPane) => void;
  removeComponent: (componentId: string) => void;
  addComponent: (componentId: string) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
  updateEvent: (event: Partial<OSDLiveEvent>) => void;
  setComponent: (listName: string, index: number, id: string) => void;
  moveComponent: (componentId: string, from: number, to: number) => void;
  moveListComponent: (
    listName: string,
    componentId: string | null,
    from: number,
    to: number
  ) => void;
  removeListComponent: (listName: string, index: number, componentId: string | null) => void;
  addListComponent: (listName: string, index: number, componentId: string | null) => void;
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
      removeComponent={props.removeComponent}
      moveComponent={props.moveComponent}
      components={props.components}
      openTab={props.openTab}
      newComponent={props.newComponent}
      addComponent={props.addComponent}
    />
    {props.event.lists.map((eList, index) =>
      <ListPanel
        key={index}
        list={eList}
        eventComponents={eventComponents}
        setComponent={props.setComponent}
        components={props.components}
        event={props.event}
        moveListComponent={props.moveListComponent}
        removeListComponent={props.removeListComponent}
        addListComponent={props.addListComponent}
      />
    )}
  </Container>
}