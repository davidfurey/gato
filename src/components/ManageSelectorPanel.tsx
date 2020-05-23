import React, { useState } from 'react';
import { Modal, Button, ListGroup, ButtonGroup } from 'react-bootstrap'
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

export function ComponentListItem( 
  props: { 
    component: OSDComponent; 
    deleteComponent?: () => void;
    removeComponent?: () => void;
    openTab?: (pane: EditPane) => void;
  }
): JSX.Element {
  const [show, setShow] = useState(false);

  function deleteHandler(deleteComponent: () => void): () => void {
    return (): void => {
      setShow(false)
      deleteComponent()
    }
  }

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  function settings(openTab: (pane: EditPane) => void): () => void {
    return (): void => openTab({
      type: EditPaneType.Component,
      id: props.component.id,
    })
  }

  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    {props.component.name}
    <ButtonGroup>
      { props.openTab ? <Button size="sm" onClick={settings(props.openTab)}><span className="material-icons">settings</span></Button> : null }
      { props.removeComponent ? <Button variant="warning" size="sm" onClick={props.removeComponent}><span className="material-icons">clear</span></Button> : null }
      { props.deleteComponent ? <Button variant="danger" size="sm" onClick={handleShow}><span className="material-icons">delete</span></Button> : null }
    </ButtonGroup>
    { props.deleteComponent ?
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete component</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete component &quot;{props.component.name}&quot;?
        </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={deleteHandler(props.deleteComponent)}>
          Delete
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal> : null
    }
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
      <ListGroup>
        {Object.values(props.components).map((component) => 
          <ComponentListItem 
            key={component.id} 
            component={component} 
            deleteComponent={(): void => props.deleteComponent(component.id)}
            openTab={props.openTab}
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