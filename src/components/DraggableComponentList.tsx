import React, { useState } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Modal, Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';
import { EditPane, EditPaneType } from '../types/editpane';
import { DraggableList, IconButton, IconBadge } from './ui';

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

function DraggableComponentListItem(
  props: {
    component: OSDComponent;
    deleteComponent: () => void;
    removeComponent?: () => void;
    openTab: (pane: EditPane) => void;
    dragHandleProps?: DraggableProvidedDragHandleProps;
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
    <div className="d-flex w-100">
      <IconBadge
        {...props.dragHandleProps}
        variant="dark"
        className="ml-n2 mr-1"
        icon="drag_handle"
        raised
      />
      { props.component.name }
    </div>
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

export function DraggableComponentList(props: {
  components: OSDComponent[];
  deleteComponent: (id: string) => void;
  openTab: (pane: EditPane) => void;
  removeComponent?: (id: string, index: number) => void;
  moveComponent: (componentId: string, sourcePosition: number, destinationPosition: number) => void;
}): JSX.Element {
  const deleteComponent = props.deleteComponent
  const removeComponent = props.removeComponent
  return <DraggableList
    items={props.components.map((item, index) =>
      ({ component: item, id: item.id + index.toString() }))
    }
    move={(s, i, j) => props.moveComponent(s.component.id, i, j)}
  >{(item, index, dragHandleProps) => {
    return <DraggableComponentListItem
      key={item.id}
      component={item.component}
      deleteComponent={
        (): void => deleteComponent(item.component.id)
      }
      removeComponent={
        removeComponent ? (): void => removeComponent(item.component.id, index) : undefined
      }
      openTab={props.openTab}
      dragHandleProps={dragHandleProps}
    />
  }}</DraggableList>
}