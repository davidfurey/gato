import React from 'react';
import { ComponentList } from './ComponentList'
import { EventList } from './EventList'
import { OSDLiveEvent } from '../reducers/shared';
import { OSDComponent } from '../OSDComponent';
import { TabbedPanel, TabContainer } from './TabbedPanel'
import { EditPane } from '../reducers/editpanel';
import { Button, Card } from 'react-bootstrap';
import { ComponentPicker } from './ComponentPicker'
import { uuid } from 'uuidv4';

interface ManageSelectorPanelProps {
  events: { [key: string]: OSDLiveEvent };
  components: { [key: string]: OSDComponent };
  deleteComponent: (id: string) => void;
  openTab: (pane: EditPane) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
}

export function ManageSelectorPanel(props: ManageSelectorPanelProps): JSX.Element {
  return <TabbedPanel variant="pills">
    <TabContainer name="Event" eventKey="events">
      <EventList events={Object.values(props.events)} openTab={props.openTab} />
      <Card.Footer className="p-2"><Button>
        <span className="material-icons material-icons-raised">add</span> New event
      </Button></Card.Footer>
    </TabContainer>
    <TabContainer name="Components" eventKey="components">
      <ComponentList 
        components={Object.values(props.components)} 
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