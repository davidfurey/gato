import React, { useState } from 'react';
import { Row, Modal, Button, Form, ListGroup, ListGroupItem, Col } from 'react-bootstrap'
import { OSDLiveEvent } from '../reducers/shared'
import { CollapsablePanel } from './ui'

export interface SettingsPanelProps {
  event: OSDLiveEvent | undefined;
  events: OSDLiveEvent[];
  setEvent: (eventId: string) => void;
}

export function SettingsPanel(props: SettingsPanelProps): JSX.Element {
  const [loadEventId, setLoadEventId] = useState(props.event?.id || ""); // todo
  const [showLoadEvent, setShowLoadEvent] = useState(false);

  const handleCloseLoadEvent = (): void => setShowLoadEvent(false)
  const handleShowLoadEvent = (): void => {
    setLoadEventId(props.event?.id || "")
    setShowLoadEvent(true)
  }

  return (
    <CollapsablePanel header="Settings" open={false}>
      <ListGroup>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <Row><Col sm="auto">Event:</Col><Col>
          {props.event?.name || "(empty)"}</Col></Row>
          <Button size="sm" variant="primary" onClick={handleShowLoadEvent}>Load</Button>
          <Modal show={showLoadEvent} onHide={handleCloseLoadEvent} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Load event</Modal.Title>
            </Modal.Header>
              <Modal.Body>
              <Form.Group>
                <Form.Control as="select" value={loadEventId}
                  onChange={(event): void => setLoadEventId(event.target.value)}>
                {props.events.map((component) =>
                  <option key={component.id} value={component.id}>{component.name}</option>
                )}
                </Form.Control>
              </Form.Group>
              </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={(): void => {
                props.setEvent(loadEventId)
                handleCloseLoadEvent()
              }}>
                Load
              </Button>
              <Button variant="primary" onClick={handleCloseLoadEvent}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
      </ListGroupItem>
      </ListGroup>
    </CollapsablePanel>
  )
}