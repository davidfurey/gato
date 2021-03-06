import React, { CSSProperties, useState } from 'react';
import { Modal, Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';
import { EditPane, EditPaneType } from '../types/editpane';
import { IconButton } from './ui';

function DeleteDialog(props: {
  show: boolean;
  cancel: () => void;
  deleteComponent: () => void;
  component: OSDComponent;
}) {
  return <Modal show={props.show} onHide={props.cancel} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title>Delete component</Modal.Title>
  </Modal.Header>
    <Modal.Body>
      Are you sure you want to delete &quot;{props.component.name}&quot;?
    </Modal.Body>
  <Modal.Footer>
    <Button variant="danger" onClick={props.deleteComponent}>
      Delete
    </Button>
    <Button variant="primary" onClick={props.cancel}>
      Cancel
    </Button>
  </Modal.Footer>
  </Modal>
}

function InfoButton(props: { onClick: () => void }) {
  return <IconButton variant="info" onClick={props.onClick} icon="settings" />
}

function DiscardButton(props: {
  deleteComponent: () => void;
  removeComponent?: () => void;
  shared: boolean;
}) {
  if (props.shared && props.removeComponent) {
    return <IconButton variant="secondary" onClick={props.removeComponent} icon="clear" />
  }
  return <IconButton variant="danger" onClick={props.deleteComponent} icon="delete" />
}

function ComponentListItem(
  props: {
    component: OSDComponent;
    deleteComponent: () => void;
    removeComponent?: () => void;
    openTab: (pane: EditPane) => void;
  }
): JSX.Element {
  const [show, setShow] = useState(false);

  function deleteHandler(deleteComponent: () => void): () => void {
    return (): void => {
      setShow(false)
      deleteComponent()
    }
  }

  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    { props.component.name }
    <ButtonGroup size="sm">
      <InfoButton onClick={() => props.openTab({
        type: EditPaneType.Component,
        id: props.component.id,
      })} />
      <DiscardButton
        removeComponent={props.removeComponent}
        deleteComponent={(): void => setShow(true)}
        shared={props.component.shared}
      />
    </ButtonGroup>
    { props.deleteComponent && props.component ?
    <DeleteDialog
      component={props.component}
      show={show}
      cancel={(): void => setShow(false)}
      deleteComponent={deleteHandler(props.deleteComponent)}

    /> : null
    }
  </ListGroup.Item>
}


export function ComponentList(props: {
  components: OSDComponent[];
  deleteComponent: (id: string) => void;
  openTab: (pane: EditPane) => void;
  removeComponent?: (id: string | null, index: number) => void;
  scroll?: boolean;
}): JSX.Element {
  const deleteComponent = props.deleteComponent
  const removeComponent = props.removeComponent
  const style: CSSProperties = props.scroll ? {height: "30em", overflowY: "scroll"} : {}
  return <ListGroup variant="flush" style={style}>
  {props.components.map((component, index) => {
    return <ComponentListItem
      key={component.id}
      component={component}
      deleteComponent={
        (): void => deleteComponent(component.id)
      }
      removeComponent={
        removeComponent ? (): void => removeComponent(component?.id || null, index) : undefined
      }
      openTab={props.openTab}
    />
  })}
  </ListGroup>
}