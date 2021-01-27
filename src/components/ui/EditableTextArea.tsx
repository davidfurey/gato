import React, { useState } from 'react';
import { Button, Form, Col, InputGroup, ColProps } from 'react-bootstrap';
import { IconButton } from './IconButton';
import { Icon } from './Icon';

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
          <IconButton
            variant="success"
            onClick={(): void => { props.update(newValue); setEdit(false)}}
            icon="done" />
          <IconButton
            variant="primary"
            onClick={(): void => setEdit(false)}
            icon="clear" />
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
            <Icon name="create" />
          </Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
  }