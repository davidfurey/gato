import React, { useState } from 'react';
import { Display, Style } from '../reducers/shared';
import { Card, Form, Button, Col } from 'react-bootstrap'
import { CollapsablePanel } from './ui'

export interface QuickCreatePanelProps {
  show: (title: string,
    subtitle: string,
    display: Display,
    eventId: string,
    style: string | null) => void;
  display: Display;
  previewDisplay: Display;
  eventId: string;
  styles: Style[];
  defaultStyle: string | null;
}

function StyleSelector(props: {
  styles: Style[]
  default: Style | undefined;
  update: (styleId: string | null) => void;
}): JSX.Element {
  return <Form.Control defaultValue={props.default?.id} size="sm"  as="select" onChange={(event): void => { props.update(event.target.value === "empty" ? null : event.target.value) }}>
    <option key="empty">(none)</option>
    { props.styles.map((style) =>
        <option key={style.id} value={style.id}>{style.name}</option>
      )
    }
  </Form.Control>
}

export function QuickCreatePanel(props: QuickCreatePanelProps): JSX.Element {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [styleId, setStyleId] = useState<string | null>(props.defaultStyle)

  const create = (): void => {
    props.show(title, subtitle, props.display, props.eventId, styleId ? styleId : null)
  }

  const createPreview = (): void => {
    props.show(title, subtitle, props.previewDisplay, props.eventId, styleId ? styleId : null)
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
      <Form.Row>
        <Form.Label lg={3} column="sm">Style</Form.Label>
        <Col>
        <StyleSelector
          styles={props.styles}
          default={props.defaultStyle ?
            props.styles.find((s) => s.id === props.defaultStyle) :
            undefined}
          update={setStyleId}
        />
        </Col>
      </Form.Row>
      <Form.Row className="pt-2">
      <Button variant="danger" size="sm" type="submit" onClick={create}>Go live</Button>
      <Button className="ml-2" variant="primary" size="sm" type="submit" onClick={createPreview}>Go Preview</Button>
      </Form.Row>
      </Card.Body>
    </CollapsablePanel>
  )
}