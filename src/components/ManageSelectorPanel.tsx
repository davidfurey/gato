import React, { useState } from 'react';
import { Modal, Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDLiveEvent } from '../reducers/shared';
import { OSDComponent } from '../OSDComponent';
import { TabbedPanel, TabContainer } from './TabbedPanel'

interface ManageSelectorPanelProps {
  events: OSDLiveEvent[];
  components: { [key: string]: OSDComponent };
  deleteComponent: (id: string) => void;
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

function ComponentListItem(
  props: { component: OSDComponent; deleteComponent: (id: string) => void }
): JSX.Element {
  const [show, setShow] = useState(false);

  const doDelete = (): void => {
    setShow(false)
    props.deleteComponent(props.component.id)
  }

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    {props.component.name}
    <ButtonGroup>
      <Button size="sm"><span className="material-icons">settings</span></Button>
      <Button variant="danger" size="sm" onClick={handleShow}><span className="material-icons">clear</span></Button>
    </ButtonGroup>
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete component</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete component &quot;{props.component.name}&quot;?
        </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={doDelete}>
          Delete
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
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
        {Object.values(props.components).map((component) => 
          <ComponentListItem 
            key={component.id} 
            component={component} 
            deleteComponent={props.deleteComponent} 
          />
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