import React, { CSSProperties, useState } from 'react';
import { Modal, Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';
import { EditPane, EditPaneType } from '../types/editpane';
import { ComponentDropdown } from './ComponentDropdown'

function ComponentListItem(
  props: {
    component: OSDComponent | null;
    deleteComponent?: () => void;
    removeComponent?: () => void;
    openTab?: (pane: EditPane) => void;
    swap?: (up: boolean) => void;
    onClick?: () => void;
    setComponent?: (id: string) => void;
    components?: OSDComponent[];
    first: boolean;
    last: boolean;
    active: boolean;
    removeOrDelete?: (component: OSDComponent | null) => boolean;
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

  const swap = props.swap
  const setComponent = props.setComponent

  function settings(openTab: (pane: EditPane) => void, id: string): () => void {
    return (): void => openTab({
      type: EditPaneType.Component,
      id: id,
    })
  }

  return <ListGroup.Item active={props.active} action={props.onClick !== undefined} className="d-flex justify-content-between align-items-center" onClick={props.onClick}>
    {setComponent ? <ComponentDropdown
      selected={props.component || undefined}
      components={props.components || []}
      disabled={false}
      setComponent={setComponent}
    /> : (props.component?.name || "Empty") }
    <ButtonGroup>
      { swap ? <Button variant="outline-secondary" disabled={props.last} size="sm" onClick={(): void => swap(false)}><span className="material-icons material-icons-raised">keyboard_arrow_down</span></Button> : null }
      { swap ? <Button variant="outline-secondary" disabled={props.first} size="sm" onClick={(): void => swap(true)}><span className="material-icons material-icons-raised">keyboard_arrow_up</span></Button> : null }
      { props.openTab && props.component ? <Button variant="info" size="sm" onClick={settings(props.openTab, props.component.id)}><span className="material-icons">settings</span></Button> : null }
      { props.removeComponent && (!props.removeOrDelete || props.removeOrDelete(props.component)) ? <Button variant="secondary" size="sm" onClick={props.removeComponent}><span className="material-icons">clear</span></Button> : null }
      { props.deleteComponent && (!props.removeOrDelete || !props.removeOrDelete(props.component)) ? <Button variant="danger" size="sm" onClick={handleShow}><span className="material-icons">delete</span></Button> : null }
    </ButtonGroup>
    { props.deleteComponent && props.component ?
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
  availableComponents?: OSDComponent[];
  setComponent?: (index: number, id: string) => void;
  deleteComponent?: (id: string) => void;
  openTab?: (pane: EditPane) => void;
  removeComponent?: (id: string | null, index: number) => void;
  removeOrDelete?: (component: OSDComponent | null) => boolean;
  swap?: (componentId: string, position: number, newPosition: number) => void;
  onClick?: (id: string, active: boolean) => void;
  activeId?: string;
  scroll?: boolean;
}): JSX.Element {
  const deleteComponent = props.deleteComponent
  const removeComponent = props.removeComponent
  const onClick = props.onClick
  const openTab = props.openTab
  const swap = props.swap
  const setComponent = props.setComponent
  const seenIds: { [id: string]: number} = {} // list can contain duplicates
  const style: CSSProperties = props.scroll ? {height: "30em", overflowY: "scroll"} : {}
  return <ListGroup variant="flush" style={style}>
  {props.components.map((component, index) => {
    seenIds[component?.id || "empty"] = (seenIds[component?.id || "empty"] || 0) + 1
    return <ComponentListItem
      key={(component?.id || "empty") + seenIds[component?.id || "empty"]}
      setComponent={setComponent ? (id: string): void => setComponent(index, id) : undefined}
      components={props.availableComponents}
      first={index === 0}
      last={index === (props.components.length - 1)}
      component={component}
      deleteComponent={
        deleteComponent && component ? (): void => deleteComponent(component.id) : undefined
      }
      removeComponent={
        removeComponent ? (): void => removeComponent(component?.id || null, index) : undefined
      }
      swap={swap && component ? (up: boolean): void =>
        swap(component.id, index, index + (up ? -1 : 1)) : undefined
      }
      onClick={onClick && component ? (): void =>
        onClick(component.id, component.id === props.activeId) : undefined
      }
      openTab={component ? openTab : undefined}
      active={component !== null && (component.id === props.activeId)}
      removeOrDelete={props.removeOrDelete}
    />
  })}
  </ListGroup>
}