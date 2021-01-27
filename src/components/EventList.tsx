import React, { CSSProperties, useState } from 'react';
import { Button, ListGroup, ButtonGroup, Modal } from 'react-bootstrap'
import { OSDLiveEvent } from '../reducers/shared';
import { EditPane, EditPaneType } from '../types/editpane';
import { IconButton } from './ui'

function EventListItem(props: {
  event: OSDLiveEvent;
  liveEventId?: string;
  openTab?: (pane: EditPane) => void;
  deleteEvent?: () => void;
  active: boolean;
  onClick?: () => void;
 }): JSX.Element {
  const [show, setShow] = useState(false);

  function deleteHandler(deleteComponent: () => void): () => void {
    return (): void => {
      setShow(false)
      deleteComponent()
    }
  }

  const openTab = props.openTab
  const settings: (() => void) | undefined = openTab ? (): void => {
    openTab({
      type: EditPaneType.Event,
      id: props.event.id,
    })
  } : undefined

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  return <ListGroup.Item active={props.active} action={props.onClick !== undefined} className="d-flex justify-content-between align-items-center" onClick={props.onClick}>
    {props.event.name}
    <ButtonGroup size="sm">
      {settings ? <IconButton variant="info" onClick={settings} icon="settings" /> : null }
      {props.deleteEvent ? <IconButton variant="danger" disabled={props.liveEventId === props.event.id} onClick={handleShow} icon="delete" /> : null }
    </ButtonGroup>
    { props.deleteEvent ?
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete event</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete event &quot;{props.event.name}&quot;?
        </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={deleteHandler(props.deleteEvent)}>
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

export function EventList(
  props: {
    events: OSDLiveEvent[];
    liveEventId?: string;
    openTab?: (pane: EditPane) => void;
    deleteEvent?: (id: string) => void;
    onClick?: (id: string, active: boolean) => void;
    activeId?: string;
    scroll?: boolean;
  }
): JSX.Element {
  const deleteEvent = props.deleteEvent
  const onClick = props.onClick
  const style: CSSProperties = props.scroll ? {height: "30em", overflowY: "scroll"} : {}
  return <ListGroup variant="flush" style={style}>
    {props.events.slice(0).reverse().map((event) =>
      <EventListItem
        key={event.id}
        event={event}
        liveEventId={props.liveEventId}
        openTab={props.openTab}
        deleteEvent={deleteEvent ? (): void => deleteEvent(event.id) : undefined }
        onClick={onClick ? (): void =>
          onClick(event.id, event.id === props.activeId) : undefined
        }
        active={event.id === props.activeId}
      />
    )}
  </ListGroup>
}