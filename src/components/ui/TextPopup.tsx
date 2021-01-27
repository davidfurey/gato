import React, { useState, useRef } from 'react';
import { Button, Popover, Overlay, Form, Col, Container, Card } from 'react-bootstrap';
import { Icon } from './Icon'

interface TextPopupProps {
  buttonText: string;
  buttonIcon?: string;
  className?: string;
  title: string;
  label: string;
  actionLabel: string;
  success: (name: string) => void;
  validation?: (name: string) => boolean;
  tip?: string;
}

interface TextInputPanelProps {
  title: string;
  label: string;
  actionLabel: string;
  success: (name: string) => void;
  validation: (name: string) => boolean;
  close: () => void;
  tip?: string;
}

function TextInputPanel(props: TextInputPanelProps): JSX.Element {
  const [value, setValue] = useState("");

  return <Card>
    <Card.Header className="px-3 py-2 bg-primary text-center">{props.title}</Card.Header>
    <Container style={{width: "15rem"}} className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
    <Container className="flex-fill flex-column d-flex bg-dark pt-3">
      <Form.Group>
      <Form.Row>
          <Form.Label lg={3} column="sm">{props.label}</Form.Label>
          <Col>
          <Form.Control size="sm" type="text" onChange={(event): void => setValue(event.target.value)} />
          </Col>
      </Form.Row>
      { props.tip ? <Form.Row>
        <Form.Text muted className="text-center pt-1">{props.tip}</Form.Text>
      </Form.Row> : null }
      </Form.Group>
    </Container>
    <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
      <Button
        size="sm"
        variant="success"
        className="mr-2"
        disabled={value === "" || !props.validation(value)}
        onClick={(): void => { props.success(value); props.close() }}
      >
        {props.actionLabel}
      </Button>
      <Button size="sm" variant="secondary" onClick={props.close}>
        Cancel
      </Button>
    </Card.Footer>
  </Container>
  </Card>
}

function popover(props: TextInputPanelProps): JSX.Element {
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <TextInputPanel {...props} />
  </Popover>
}

export function TextPopup(props: TextPopupProps): JSX.Element {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const close = (): void => {
    setShow(false)
  }
  return <div>
    <Button ref={target} onClick={(): void => setShow(!show)} className={props.className}>
      { props.buttonIcon ? <Icon name={props.buttonIcon} raised /> : null }
      {props.buttonText}
    </Button>
    <Overlay placement="right" target={target.current} show={show}>{popover({
      close,
      title: props.title,
      label: props.label,
      actionLabel: props.actionLabel,
      success: props.success,
      validation: props.validation || (() => true),
      tip: props.tip
    })}</Overlay>
  </div>
}
