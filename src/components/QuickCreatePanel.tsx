import React, { useState } from 'react';
import { Display } from '../reducers/shared';
import { Card, Form, Button, Col } from 'react-bootstrap'
import { CollapsablePanel } from './ui'

export interface QuickCreatePanelProps {
  show: (title: string, subtitle: string, display: Display, eventId: string) => void;
  display: Display;
  eventId: string;
}

export function QuickCreatePanel(props: QuickCreatePanelProps): JSX.Element {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  const create = (): void => {
    props.show(title, subtitle, props.display, props.eventId)
  }

  const titleChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value)
  }

  const subtitleChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSubtitle(event.target.value)
  }

  return (
    <CollapsablePanel header="Quick create">
      <Card.Body>
      <Form.Row>
        <Form.Label lg={3} column="sm">Title</Form.Label>
        <Col>
        <Form.Control size="sm" type="text" onChange={titleChanged} />
        </Col>
      </Form.Row>
      <Form.Row>
        <Form.Label lg={3} column="sm">Subtitle</Form.Label>
        <Col>
        <Form.Control size="sm" type="text" onChange={subtitleChanged} />
        </Col>
      </Form.Row>
      <Button variant="danger" size="sm" type="submit" onClick={create}>Go live</Button>
      </Card.Body>
    </CollapsablePanel>
  )
}