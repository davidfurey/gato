import React, { useState } from 'react';
import { Button, ListGroup, ButtonGroup, Modal } from 'react-bootstrap'
import { OSDLiveEvent } from '../reducers/shared';
import { EditPane, EditPaneType } from '../reducers/editpanel';

function EventListItem(props: {
  event: OSDLiveEvent;
  liveEventId?: string;
  openTab: (pane: EditPane) => void;
  deleteEvent?: () => void;
 }): JSX.Element {
  const [show, setShow] = useState(false);

  function deleteHandler(deleteComponent: () => void): () => void {
    return (): void => {
      setShow(false)
      deleteComponent()
    }
  }

  function settings(): void {
    props.openTab({
      type: EditPaneType.Event,
      id: props.event.id,
    })
  }

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    {props.event.name}
    <ButtonGroup>
      <Button variant="info" size="sm" onClick={settings}><span className="material-icons">settings</span></Button>
      <Button variant="danger" disabled={props.liveEventId === props.event.id} size="sm" onClick={handleShow}><span className="material-icons">delete</span></Button> {/* todo: bigger bin*/}
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
    openTab: (pane: EditPane) => void;
    deleteEvent: (id: string) => void;
  }
): JSX.Element {
  const deleteEvent = props.deleteEvent
  return <ListGroup variant="flush" style={{maxHeight: "30em", overflowY: "auto"}}>
    {props.events.slice(0).reverse().map((event) =>
      <EventListItem
        key={event.id}
        event={event}
        liveEventId={props.liveEventId}
        openTab={props.openTab}
        deleteEvent={deleteEvent ? (): void => deleteEvent(event.id) : undefined }
      />
    )}
  </ListGroup>
}