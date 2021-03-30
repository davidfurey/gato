import React from 'react';
import { ComponentList } from './ComponentList'
import { EventList } from './EventList'
import { OSDLiveEvents } from '../reducers/shared';
import { OSDComponents } from '../OSDComponent';
import { TabbedPanel, TabContainer } from './ui'
import { EditPane, EditPaneType } from '../types/editpane';
import { Card } from 'react-bootstrap';
import { ComponentPicker } from './ComponentPicker'
import { v4 as uuid } from 'uuid';
import { CreateEventButton, CreateTemplateButton } from './CreateEventButton';
import { copyEvent } from '../libs/events';
import * as EventActions from '../api/Events'
import * as ComponentActions from '../api/Components'

export interface ManageSelectorPanelProps {
  events: OSDLiveEvents;
  components: OSDComponents;
  liveEventId?: string;
  deleteComponent: (id: string) => void;
  deleteEvent: (id: string) => void;
  openTab: (pane: EditPane) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
  newEvent: (eventId: string, name: string) => void;
  newTemplate: (eventId: string, name: string) => void;
  copyEvent: (actions: (EventActions.Create | ComponentActions.Create)[]) => void;
}

export function untitledName(prefix: string, existing: string[]): string {
  const untitled = (i: number): string => `${prefix} ${i}`
  for (let i = 1; i < 100; i++) {
    if (!existing.includes(untitled(i))) {
      return untitled(i)
    }
  }
  return `${prefix} ${uuid()}`
}

export function ManageSelectorPanel(props: ManageSelectorPanelProps): JSX.Element {
  const newEvent = (sourceId: string): void => {
    const eventId = uuid()
    const untitledPrefix = "Untitled event"
    const existing = Object.values(props.events)
      .filter((evt) => evt.name.startsWith(untitledPrefix))
      .map((evt) => evt.name)
    if (sourceId === "empty") {
      props.newEvent(eventId, untitledName(untitledPrefix, existing))
    } else {
      props.copyEvent(
        copyEvent(
          untitledName(untitledPrefix, existing),
          sourceId,
          eventId,
          props.events,
          props.components
        )
      )
    }
    props.openTab({
      type: EditPaneType.Event,
      id: eventId,
    })
  }

  const newTemplate = (sourceId: string): void => {
    const eventId = uuid()
    const untitledPrefix = "Untitled template"
    const existing = Object.values(props.events)
      .filter((evt) => evt.name.startsWith(untitledPrefix))
      .map((evt) => evt.name)
    if (sourceId === "empty") {
      props.newTemplate(eventId, untitledName(untitledPrefix, existing))
    } else {
      props.copyEvent(
        copyEvent(
          untitledName(untitledPrefix, existing),
          sourceId,
          eventId,
          props.events,
          props.components,
          true
        )
      )
    }
    props.openTab({
      type: EditPaneType.Event,
      id: eventId,
    })
  }

  const newComponent = (name: string, type: string): void => {
    const componentId = uuid()
    props.newComponent(componentId, name, type)
    props.openTab({
      type: EditPaneType.Component,
      id: componentId,
    })
  }

  return <TabbedPanel variant="pills">
    <TabContainer name="Event" eventKey="events">
      <EventList
        events={Object.values(props.events).filter((evt) => !evt.template)}
        liveEventId={props.liveEventId}
        openTab={props.openTab}
        deleteEvent={props.deleteEvent}
        scroll={true}
      />
      <Card.Footer className="p-2">
        <CreateEventButton newEvent={newEvent} events={Object.values(props.events)} />
      </Card.Footer>
    </TabContainer>
    <TabContainer name="Templates" eventKey="templates">
      <EventList
        events={Object.values(props.events).filter((evt) => evt.template)}
        liveEventId={props.liveEventId}
        openTab={props.openTab}
        deleteEvent={props.deleteEvent}
        scroll={true}
      />
      <Card.Footer className="p-2">
        <CreateTemplateButton newEvent={newTemplate} events={Object.values(props.events)} />
      </Card.Footer>
    </TabContainer>
    <TabContainer name="Components" eventKey="components">
      <ComponentList
        components={Object.values(props.components).filter((c) => c.shared)}
        deleteComponent={props.deleteComponent}
        openTab={props.openTab}
        scroll={true}
      />
      <Card.Footer className="p-2">
        <ComponentPicker newComponent={newComponent} />
      </Card.Footer>
    </TabContainer>
  </TabbedPanel>
}