import React, { useState, useRef } from 'react';
import { Button, Popover, Overlay, Form, Col, Container, Card } from 'react-bootstrap';

interface CreateEventButtonProps {
  newEvent: (name: string) => void;
  className?: string;
}

function CreateEventPanel(props: { 
  newEvent: (name: string) => void;
  close: () => void;
}): JSX.Element {
  const [name, setName] = useState("");

  return <Card>
      <Card.Header className="px-3 py-2 bg-primary text-center">Event</Card.Header>
  <Container style={{width: "15rem"}} className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
    <Container className="flex-fill flex-column d-flex bg-dark pt-3">
      <Form.Group>
      <Form.Row>
          <Form.Label lg={3} column="sm">Name</Form.Label>
          <Col>
          <Form.Control size="sm" type="text" onChange={(event): void => setName(event.target.value)} />
          </Col>
      </Form.Row>
      </Form.Group>
    </Container>
    <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
      <Button 
        size="sm" 
        variant="success" 
        className="mr-2"
        disabled={name === ""}
        onClick={(): void => { props.newEvent(name); props.close() }}
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
  newEvent: (name: string) => void,
): JSX.Element {
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <CreateEventPanel 
      close={close} 
      newEvent={newEvent}
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
      New Event
    </Button>
    <Overlay placement="right" target={target.current} show={show}>{popover(
      close,
      props.newEvent
    )}</Overlay>
  </div>
}
