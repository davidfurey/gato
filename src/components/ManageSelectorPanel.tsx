import React from 'react';
import { Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDLiveEvent } from '../reducers/shared';
import { OSDComponent } from '../OSDComponent';
import { TabbedPanel, TabContainer } from './TabbedPanel'

interface ManageSelectorPanelProps {
  events: OSDLiveEvent[];
  components: OSDComponent[];
}

function EventListItem(props: { event: OSDLiveEvent }): JSX.Element {
  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    {props.event.name}
    <ButtonGroup>
      <Button size="sm"><span className="material-icons">settings</span></Button>
      <Button variant="danger" size="sm"><span className="material-icons">clear</span></Button>
    </ButtonGroup>
  </ListGroup.Item>
}

function ComponentListItem(props: { component: OSDComponent }): JSX.Element {
  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    {props.component.name}
    <ButtonGroup>
      <Button size="sm"><span className="material-icons">settings</span></Button>
      <Button variant="danger" size="sm"><span className="material-icons">clear</span></Button>
    </ButtonGroup>
  </ListGroup.Item>
}

export function ManageSelectorPanel(props: ManageSelectorPanelProps): JSX.Element {
  return <TabbedPanel>
    <TabContainer name="Event" eventKey="events">
      <ListGroup>
        {props.events.map((event) => <EventListItem key={event.id} event={event} />)}
      </ListGroup>
    </TabContainer>
    <TabContainer name="Components" eventKey="components">
      <ListGroup>
        {props.components.map((component) => 
          <ComponentListItem key={component.id} component={component} />
        )}
      </ListGroup>
    </TabContainer>
  </TabbedPanel>
}


{/* <div class="card text-center">
  <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs">
      <li class="nav-item">
        <a class="nav-link active" href="#">Active</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div> */}