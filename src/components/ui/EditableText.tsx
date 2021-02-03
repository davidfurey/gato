import React, { useState } from 'react';
import { Button, Form, Col, InputGroup, ColProps } from 'react-bootstrap';
import './EditableText.css'
import { Icon } from './Icon'

interface EditableTextProps {
  value: string;
  update: (v: string) => void;
  delete?: () => void;
  lg?: ColProps["lg"];
}

export function EditableText(props: EditableTextProps): JSX.Element {
    const [edit, setEdit] = useState(false);
    const [newValue, setNewValue] = useState(props.value);

    const deleteFn = props.delete
    return <Col lg={edit ? props.lg : undefined} className="editable-text">{ edit ?
        <InputGroup>
        <Form.Control
          type="text"
          defaultValue={newValue}
          onChange={(event): void => setNewValue(event.target.value)}
        />
        <InputGroup.Append>
          <Button key="update" variant="success" onClick={(): void => { props.update(newValue); setEdit(false)}}>
            <Icon name="done" />
          </Button>
          <Button key="cancel" variant="primary" onClick={(): void => setEdit(false)}>
          <Icon name="clear" />
          </Button>
          </InputGroup.Append>
        </InputGroup> :
        <InputGroup>
          <InputGroup.Prepend>
          <InputGroup.Text>
            {props.value === "" ? "(empty)" : props.value}
          </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Append>
          <Button key="edit" variant="info" onClick={(): void => { setNewValue(props.value); setEdit(true)}}>
            <Icon name="create" />
          </Button>
          { deleteFn ?
            <Button key="remove" variant="danger" onClick={deleteFn}>
              <Icon name="delete" />
            </Button> : null
          }
          </InputGroup.Append>
        </InputGroup> }
      </Col>
  }