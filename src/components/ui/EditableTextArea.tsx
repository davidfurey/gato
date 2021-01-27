import React, { useState } from 'react';
import { Button, Form, Col, InputGroup, ColProps } from 'react-bootstrap';

export function EditableTextArea(props: {
  value: string;
  update: (v: string) => void;
  lg?: ColProps["lg"];
}): JSX.Element {
    const [edit, setEdit] = useState(false);
    const [newValue, setNewValue] = useState(props.value);

    return edit ?
      <Col lg={props.lg}>
        <InputGroup>
        <Form.Control
          as="textarea"
          rows={3}
          defaultValue={newValue}
          onChange={(event): void => setNewValue(event.target.value)}
        />
        <InputGroup.Append>
          <Button variant="success" onClick={(): void => { props.update(newValue); setEdit(false)}}>
            <span className="material-icons">done</span>
          </Button>
          <Button variant="primary" onClick={(): void => setEdit(false)}>
            <span className="material-icons">clear</span>
          </Button>
          </InputGroup.Append>
        </InputGroup>
      </Col> :
      <Col>
        <InputGroup>
        <Form.Control
          className="bg-secondary text-light"
          as="textarea"
          rows={3}
          defaultValue={props.value}
          disabled={true}
        />
          <InputGroup.Append>
          <Button style={{border: "1px solid var(--gray-dark)" }} variant="info" onClick={(): void => { setNewValue(props.value); setEdit(true)}}>
            <span className="material-icons">create</span>
          </Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
  }