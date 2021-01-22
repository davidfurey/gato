import React, { useState, useRef } from 'react';
import { Button, Popover, Overlay, Col, Container, Card, Row, ListGroup } from 'react-bootstrap';
import { OSDLiveEvent } from '../reducers/shared';

interface CreateEventButtonProps {
  newEvent: (sourceId: string) => void;
  className?: string;
  events: OSDLiveEvent[];
}

function CreateEventPanel(props: {
  newEvent: (sourceId: string) => void;
  events: OSDLiveEvent[];
  close: () => void;
  emptyName: string;
}): JSX.Element {
  const [selectedEvent, setSelectedEvent] = useState<string>("empty");

  return <Card>
    <Card.Header className="px-3 py-2 bg-secondary text-center">Template</Card.Header>
    <Container style={{height: "15rem", width: "15rem"}} className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
    <Container className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
      <Container className="bg-dark flex-fill flex-column d-flex">
        <div className="section-div flex-grow-1 flex-column d-flex">
          <Row className="flex-fill d-flex">
            <Col className="overflow-auto flex-shrink-1 position-relative p-0">
              <div className="position-absolute w-100">
                <ListGroup variant="flush">
                  <ListGroup.Item
                    key="empty"
                    active={selectedEvent === "empty"}
                    action={true}
                    className="d-flex justify-content-between align-items-center"
                    onClick={(): void => setSelectedEvent("empty")}>{props.emptyName}</ListGroup.Item>
                { props.events.filter((evt) => evt.template).map((event) =>
                  <ListGroup.Item
                    key={event.id}
                    active={event.id === selectedEvent}
                    action={true}
                    className="d-flex ju{event.name}stify-content-between align-items-center"
                    onClick={(): void => setSelectedEvent(event.id)}>{event.name}</ListGroup.Item>
                )}
                </ListGroup>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      </Container>
      <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
        <Button
          size="sm"
          variant="success"
          className="mr-2"
          onClick={(): void => { props.newEvent(selectedEvent); props.close() }}
        >
          Create
        </Button>
        <Button size="sm" variant="secondary" onClick={props.close}>
          Cancel
        </Button>
      </Card.Footer>
    </Container>
  </Card>
}

function popover(
  close: () => void,
  newEvent: (sourceId: string) => void,
  events: OSDLiveEvent[],
  emptyName: string
): JSX.Element {
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <CreateEventPanel
      close={close}
      newEvent={newEvent}
      events={events}
      emptyName={emptyName}
    />
  </Popover>
}

export function CreateEventButton(props: CreateEventButtonProps): JSX.Element {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const close = (): void => {
    setShow(false)
  }
  return <div>
    <Button ref={target} onClick={(): void => setShow(!show)} className={props.className}>
      <span className="material-icons material-icons-raised">add</span> {/* todo: alignment is not consistent */}
      New event
    </Button>
    <Overlay placement="right" target={target.current} show={show}>{popover(
      close,
      props.newEvent,
      props.events,
      "Empty event"
    )}</Overlay>
  </div>
}

export function CreateTemplateButton(props: CreateEventButtonProps): JSX.Element {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const close = (): void => {
    setShow(false)
  }
  return <div>
    <Button ref={target} onClick={(): void => setShow(!show)} className={props.className}>
      <span className="material-icons material-icons-raised">add</span> {/* todo: alignment is not consistent */}
      New template
    </Button>
    <Overlay placement="right" target={target.current} show={show}>{popover(
      close,
      props.newEvent,
      props.events,
      "Empty template"
    )}</Overlay>
  </div>
}
