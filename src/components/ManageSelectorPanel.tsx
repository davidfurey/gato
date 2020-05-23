import React from 'react';
import { Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { ComponentList } from './ComponentList'
import { OSDLiveEvent } from '../reducers/shared';
import { OSDComponent } from '../OSDComponent';
import { TabbedPanel, TabContainer } from './TabbedPanel'
import { EditPane, EditPaneType } from '../reducers/editpanel';

interface ManageSelectorPanelProps {
  events: { [key: string]: OSDLiveEvent };
  components: { [key: string]: OSDComponent };
  deleteComponent: (id: string) => void;
  openTab: (pane: EditPane) => void;
}

function EventListItem(props: { 
  event: OSDLiveEvent;
  openTab: (pane: EditPane) => void;
 }): JSX.Element {
  function settings(): void {
    props.openTab({
      type: EditPaneType.Event,
      id: props.event.id,
    })
  }

  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    {props.event.name}
    <ButtonGroup>
      <Button size="sm" onClick={settings}><span className="material-icons">settings</span></Button>
      <Button variant="danger" size="sm"><span className="material-icons">delete</span></Button> {/* todo: bigger bin*/}
    </ButtonGroup>
  </ListGroup.Item>
}

export function ManageSelectorPanel(props: ManageSelectorPanelProps): JSX.Element {
  return <TabbedPanel>
    <TabContainer name="Event" eventKey="events">
      <ListGroup>
        {Object.values(props.events).map((event) => 
          <EventListItem key={event.id} event={event} openTab={props.openTab} />
        )}
        <ListGroup.Item><Button><span className="material-icons material-icons-raised">add</span> New event (todo)</Button></ListGroup.Item>
      </ListGroup>
    </TabContainer>
    <TabContainer name="Components" eventKey="components">
      <ComponentList 
        components={Object.values(props.components)} 
        deleteComponent={props.deleteComponent}
        openTab={props.openTab}
      />
    </TabContainer>
  </TabbedPanel>
}