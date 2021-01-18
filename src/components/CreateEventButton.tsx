import React, { useState, useRef } from 'react';
import { Button, Popover, Overlay, Form, Col, Container, Card, Row } from 'react-bootstrap';
import { OSDLiveEvent } from '../reducers/shared';
import { EventList } from './EventList';
import { TabbedPanel, TabContainer } from './TabbedPanel'

interface CreateEventButtonProps {
  newEvent: (name: string) => void;
  className?: string;
  copy: (sourceId: string, name: string) => void;
  events: OSDLiveEvent[];
}

function CopySettingsPanel(props: {
  back: () => void;
  close: () => void;
  selectedEvent: OSDLiveEvent;
  copy: (sourceId: string, name: string) => void;
}): JSX.Element {
  const [name, setName] = useState("");
  return <Card>
    <Card.Header className="px-3 py-2 bg-primary d-flex">
      <Button style={{border: 'none', verticalAlign: "top"}} size="sm" onClick={props.back} className="p-0 my-0 mr-2">
        <span className="material-icons material-icons-raised m-0">arrow_back</span>
      </Button>
      <span style={{padding: "0.25rem"}}>{ props.selectedEvent.name }</span>
    </Card.Header>
    <div id="page-content-wrapper" style={{height: "15rem", width: "15rem"}} className="p-0 d-flex flex-column overflow-hidden">
    <Container className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
    <Container className="flex-fill flex-column d-flex bg-dark p-3">
    <Form.Group>
      <Form.Row>
          <Form.Label lg={3} column="sm">Name</Form.Label>
          <Col>
          <Form.Control size="sm" type="text" onChange={(event): void => setName(event.target.value)} />
          </Col>
      </Form.Row>
    </Form.Group>
    </Container>
    </Container>
    <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
        <Button
          size="sm"
          variant="success"
          className="mr-2"
          disabled={name === ""}
          onClick={(): void => { props.copy(props.selectedEvent.id, name); props.close() }}
        >
          Create
        </Button>
        <Button size="sm" variant="secondary" onClick={props.close}>
          Cancel
        </Button>
    </Card.Footer>
    </div>
  </Card>
}
function CreateOrCopyEventPanel(props: {
  newEvent: (name: string) => void;
  copy: (sourceId: string, name: string) => void;
  events: OSDLiveEvent[];
  close: () => void;
}): JSX.Element {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('empty');

  const selectedOSDEvent = props.events.find((evt) => evt.id === selectedEvent) // todo: tidy
  return selectedOSDEvent ?
    <CopySettingsPanel
      back={(): void => setSelectedEvent(null)}
      close={props.close}
      selectedEvent={selectedOSDEvent}
      copy={props.copy}
    />:
    <TabbedPanel
      className=""
      variant="pills"
      size="sm"
      onSelect={(key): void => setSelectedTab(key)}
      activeKey={selectedTab}
    >
      <TabContainer name="Empty" eventKey="empty">
        <CreateEventTab
          newEvent={props.newEvent}
          close={props.close}
        />
      </TabContainer>
      <TabContainer name="Template" eventKey="template">
        <CopyEventTab
          events={props.events.filter((t) => t.template)}
          selectEvent={setSelectedEvent}
          selectedEvent={selectedEvent}
          close={props.close}
        />
      </TabContainer>
    </TabbedPanel>
}

function CopyEventTab(props: {
  events: OSDLiveEvent[];
  selectEvent: (id: string) => void;
  selectedEvent: string | null;
  close: () => void;
}): JSX.Element {

  return <div id="page-content-wrapper" style={{height: "15rem", width: "15rem"}} className="p-0 d-flex flex-column overflow-hidden">
    <Container className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
      <Container className="bg-dark flex-fill flex-column d-flex">
        <div className="section-div flex-grow-1 flex-column d-flex">
          <Row className="flex-fill d-flex">
            <Col className="overflow-auto flex-shrink-1 position-relative p-0">
              <div className="position-absolute w-100">
                <EventList
                  events={props.events}
                  onClick={
                    (id: string): void =>
                      props.selectEvent(id)
                  }
                  scroll={false}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
        <Button
          size="sm"
          variant="success"
          className="mr-2"
          disabled={true}
        >
          Create
        </Button>
        <Button size="sm" variant="secondary" onClick={props.close}>
          Cancel
        </Button>
      </Card.Footer>
    </Container>
  </div>
}

function CreateEventTab(props: {
  newEvent: (name: string) => void;
  close: () => void;
}): JSX.Element {
  const [name, setName] = useState("");

  return <Container style={{height: "15rem", width: "15rem"}} className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
    <Container className="flex-fill flex-column d-flex bg-dark p-3">
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
}

function popover(
  close: () => void,
  newEvent: (name: string) => void,
  copy: (sourceId: string, name: string) => void,
  events: OSDLiveEvent[]
): JSX.Element {
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <CreateOrCopyEventPanel
      close={close}
      newEvent={newEvent}
      copy={copy}
      events={events}
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
      props.newEvent,
      props.copy,
      props.events
    )}</Overlay>
  </div>
}
