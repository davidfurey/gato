import React, { CSSProperties, useState } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Modal, Button, ListGroup, ButtonGroup, Badge } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';
import { EditPane, EditPaneType } from '../types/editpane';
import { ComponentDropdown } from './ComponentDropdown'
import { DraggableList } from './DraggableList';

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

function Icon(props: { name: string, raised?: boolean }) {
  const className = "material-icons" + (props.raised ? " material-icons-raised" : "")
  return <span className={className}>{ props.name}</span>
}

function InfoButton(props: { onClick: () => void }) {
  return <Button variant="info" onClick={props.onClick}><Icon name="settings" /></Button>
}

function DiscardButton(props: {
  deleteComponent: () => void;
  removeComponent?: () => void;
  shared: boolean;
}) {
  if (props.shared && props.removeComponent) {
    return <Button variant="secondary" onClick={props.removeComponent}><Icon name="clear" /></Button>
  }
  return <Button variant="danger" onClick={props.deleteComponent}><Icon name="delete" /></Button>
}

export function ComponentSlot(
  props: {
    component: OSDComponent | null;
    removeComponent?: () => void;
    setComponent: (id: string) => void;
    components?: OSDComponent[];
    first: boolean;
    last: boolean;
    dragHandleProps?: DraggableProvidedDragHandleProps;
  }
): JSX.Element {
  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    <div className="d-flex w-100">
      <Badge {...props.dragHandleProps} variant="dark" className="py-2 ml-n2 mr-1" style={{ width: "1.7rem", height: "1.7rem" }}>
        <Icon name="drag_handle" raised />
      </Badge>
      <ComponentDropdown
        selected={props.component || undefined}
        components={props.components || []}
        disabled={false}
        setComponent={props.setComponent}
      />
    </div>
    <ButtonGroup size="sm">
      <Button variant="secondary" onClick={props.removeComponent}><Icon name="clear" /></Button>
    </ButtonGroup>
  </ListGroup.Item>
}

export function ComponentListItem(
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

export function SlotList(props: {
  components: (OSDComponent | null)[];
  availableComponents?: OSDComponent[];
  setComponent: (index: number, id: string) => void;
  removeComponent: (id: string | null, index: number) => void;
  moveComponent: (
    componentId: string | null,
    sourcePosition: number,
    destinationPosition: number
  ) => void;
}): JSX.Element {
  return <DraggableList
    items={props.components.map((item, index) => ({ component: item, id: index.toString() }))}
    move={(s, i, j) => props.moveComponent(s.component?.id || null, i, j)}
  >{(item, index, dragHandleProps) => {
    return <ComponentSlot
      key={item.id}
      setComponent={(id: string): void => props.setComponent(index, id)}
      components={props.availableComponents}
      first={index === 0}
      last={index === (props.components.length - 1)}
      component={item.component}
      removeComponent={
        (): void => props.removeComponent(item.component?.id || null, index)
      }
      dragHandleProps={dragHandleProps}
    />
  }}
  </DraggableList>
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

export function DraggableComponentListItem(
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
      <Badge {...props.dragHandleProps} variant="dark" className="ml-n2 mr-1">
        <Icon name="drag_handle" raised />
      </Badge>
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
  removeComponent?: (id: string | null, index: number) => void;
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
function ComponentSelectorListItem(props: {
  active: boolean;
  onClick: () => void;
  name: string;
}) {
  return <ListGroup.Item active={props.active} action={true} className="d-flex justify-content-between align-items-center" onClick={props.onClick}>
    {props.name}
  </ListGroup.Item>
}

export function ComponentSelectorList(props: {
  components: OSDComponent[];
  onClick: (id: string) => void;
  activeIds: string[];
}): JSX.Element {
  return <ListGroup variant="flush">
  {props.components.map((component) => {
    return <ComponentSelectorListItem
      key={component.id}
      name={component.name}
      onClick={(): void =>
        props.onClick(component.id)
      }
      active={props.activeIds.includes(component.id)}
    />
  })}
  </ListGroup>
}