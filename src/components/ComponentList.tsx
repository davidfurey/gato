import React, { useState } from 'react';
import { Modal, Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';
import { EditPane, EditPaneType } from '../reducers/editpanel';
import { ComponentPicker } from './ComponentPicker';

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

export function ComponentList(props: { 
  components: (OSDComponent | null)[];
  deleteComponent?: (id: string) => void;
  openTab?: (pane: EditPane) => void;
  removeComponent?: (id: string) => void;
}): JSX.Element {
  const deleteComponent = props.deleteComponent
  const removeComponent = props.removeComponent
  const openTab = props.openTab
  return <ListGroup>
  {props.components.map((component) => 
    component !== null ?
      <ComponentListItem 
        key={component.id} 
        component={component} 
        deleteComponent={deleteComponent ? (): void => deleteComponent(component.id) : undefined }
        removeComponent={removeComponent ? (): void => removeComponent(component.id) : undefined }
        openTab={openTab}
      /> : <ListGroup.Item>Empty</ListGroup.Item>
  )}
  <ListGroup.Item>
      {/* <Button>
        <span className="material-icons material-icons-raised">add</span> Add component (todo)
      </Button> */}
      <ComponentPicker components={props.components.flatMap((c) => c !== null ? [c] : [])} />
    </ListGroup.Item>
  </ListGroup>
}