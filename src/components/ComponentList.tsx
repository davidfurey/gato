import React, { useState } from 'react';
import { Modal, Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';
import { EditPane, EditPaneType } from '../reducers/editpanel';

export function ComponentListItem( 
  props: { 
    component: OSDComponent; 
    deleteComponent?: () => void;
    removeComponent?: () => void;
    openTab?: (pane: EditPane) => void;
    onClick?: () => void;
    active: boolean;
    deleteSharedComponents: boolean;
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

  return <ListGroup.Item active={props.active} action={props.onClick !== undefined} className="d-flex justify-content-between align-items-center" onClick={props.onClick}>
    {props.component.name}
    <ButtonGroup>
      { props.openTab ? <Button variant="info" size="sm" onClick={settings(props.openTab)}><span className="material-icons">settings</span></Button> : null }
      { props.removeComponent && (props.component.shared && !props.deleteSharedComponents) ? <Button variant="secondary" size="sm" onClick={props.removeComponent}><span className="material-icons">clear</span></Button> : null }
      { props.deleteComponent && (!props.component.shared || props.deleteSharedComponents) ? <Button variant="danger" size="sm" onClick={handleShow}><span className="material-icons">delete</span></Button> : null }
    </ButtonGroup>
    { props.deleteComponent ?
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete component</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete &quot;{props.component.name}&quot;?
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
  onClick?: (id: string, active: boolean) => void;
  activeId?: string;
  deleteSharedComponents?: boolean;
}): JSX.Element {
  const deleteSharedComponents = 
    props.deleteSharedComponents === undefined ? true : props.deleteSharedComponents
  const deleteComponent = props.deleteComponent
  const removeComponent = props.removeComponent
  const onClick = props.onClick
  const openTab = props.openTab
  const seenIds: { [id: string]: number} = {} // list can contain duplicates
  return <ListGroup variant="flush">
  {props.components.map((component) => {
    if (component === null) {
      return <ListGroup.Item>Empty</ListGroup.Item>
    } else {
      seenIds[component.id] = (seenIds[component.id] || 0) + 1
      return component !== null ?
        <ComponentListItem 
          key={component.id + seenIds[component.id]} 
          component={component} 
          deleteComponent={deleteComponent ? (): void => deleteComponent(component.id) : undefined }
          removeComponent={removeComponent ? (): void => removeComponent(component.id) : undefined }
          onClick={onClick ? (): void => 
            onClick(component.id, component.id === props.activeId) : undefined 
          }
          openTab={openTab}
          active={component.id === props.activeId}
          deleteSharedComponents={deleteSharedComponents}
        /> : <ListGroup.Item>Empty</ListGroup.Item>
    }
  })}
  </ListGroup>
}