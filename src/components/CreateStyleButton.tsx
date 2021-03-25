import React, { useState, useRef } from 'react';
import { Button, Popover, Overlay, Col, Container, Card, Form } from 'react-bootstrap';
import { ComponentType } from '../reducers/shared';
import { Icon } from './ui'
import { componentTypes, componentTypeAsString, isComponentType } from './OSDComponents';
import { LowerThirdsType } from './OSDComponents/LowerThirdsComponent';

interface CreateStyleButtonProps {
  newStyle: (name: string, componentType: ComponentType) => void;
}

function CreateStylePanel(props: {
  newStyle: (name: string, componentType: ComponentType) => void;
  close: () => void;
}): JSX.Element {
  const [type, setType] = useState<ComponentType>(LowerThirdsType);
  const [name, setName] = useState("");

  return <Card>
    <Card.Header className="px-3 py-2 bg-primary text-center">Style</Card.Header>
    <Container style={{height: "15rem", width: "15rem"}} className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
    <Container className="flex-fill flex-column d-flex bg-dark p-3">
      <Form.Group>
      <Form.Row>
          <Form.Label lg={3} column="sm">Name</Form.Label>
          <Col>
          <Form.Control size="sm" type="text" onChange={(event): void => setName(event.target.value)} />
          </Col>
      </Form.Row>
      <Form.Row>
          <Form.Label lg={3} column="sm">Type</Form.Label>
          <Col>
          <Form.Control as="select" onChange={(event): void => isComponentType(event.target.value) ? setType(event.target.value) : undefined }>
            { componentTypes.map((type) =>
                <option key={type} value={type}>{componentTypeAsString(type)}</option>
              )
            }
          </Form.Control>
          </Col>
      </Form.Row>
      </Form.Group>
      </Container>
      <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
        <Button
          size="sm"
          variant="success"
          className="mr-2"
          onClick={(): void => { props.newStyle(name, type); props.close() }}
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
  newStyle: (name: string, componentType: ComponentType) => void,
): JSX.Element {
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <CreateStylePanel
      close={close}
      newStyle={newStyle}
    />
  </Popover>
}

export function CreateStyleButton(props: CreateStyleButtonProps): JSX.Element {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const close = (): void => {
    setShow(false)
  }
  return <div>
    <Button ref={target} onClick={(): void => setShow(!show)}>
      <Icon name="add" raised />
      New style
    </Button>
    <Overlay placement="right" target={target.current} show={show}>{popover(
      close,
      props.newStyle
    )}</Overlay>
  </div>
}