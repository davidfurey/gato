import React from 'react';
import { ComponentList } from './ComponentList'
import { EventList } from './EventList'
import { OSDLiveEvent } from '../reducers/shared';
import { OSDComponent } from '../OSDComponent';
import { TabbedPanel, TabContainer } from './TabbedPanel'
import { EditPane } from '../types/editpane';
import { Card } from 'react-bootstrap';
import { ComponentPicker } from './ComponentPicker'
import { uuid } from 'uuidv4';
import { CreateEventButton } from './CreateEventButton';
import { copyEvent } from '../libs/events';
import * as EventActions from '../api/Events'
import * as ComponentActions from '../api/Components'

export interface ManageSelectorPanelProps {
  events: { [key: string]: OSDLiveEvent };
  components: { [key: string]: OSDComponent };
  liveEventId?: string;
  deleteComponent: (id: string) => void;
  deleteEvent: (id: string) => void;
  openTab: (pane: EditPane) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
  newEvent: (eventId: string, name: string) => void;
  copyEvent: (actions: (EventActions.Create | ComponentActions.Create)[]) => void;
}

export function ManageSelectorPanel(props: ManageSelectorPanelProps): JSX.Element {
  return <TabbedPanel variant="pills">
    <TabContainer name="Event" eventKey="events">
      <EventList
        events={Object.values(props.events)}
        liveEventId={props.liveEventId}
        openTab={props.openTab}
        deleteEvent={props.deleteEvent}
      />
      <Card.Footer className="p-2">
        <CreateEventButton newEvent={(name): void =>
            props.newEvent(uuid(), name)
          }
          selectEvent={(id): void => {
            const eventName = `${(props.events[id]?.name || "<unknown>")} (copy)`
            props.copyEvent(copyEvent(eventName, id, props.events, props.components))
          }}
          events={Object.values(props.events)}
        />
      </Card.Footer>
    </TabContainer>
    <TabContainer name="Components" eventKey="components">
      <ComponentList
        components={Object.values(props.components).filter((c) => c.shared)}
        deleteComponent={props.deleteComponent}
        openTab={props.openTab}
      />
      <Card.Footer className="p-2">
        <ComponentPicker
          newComponent={(name: string, type: string): void => {
            props.newComponent(uuid(), name, type)
          }
          }
        />
      </Card.Footer>
    </TabContainer>
  </TabbedPanel>
}