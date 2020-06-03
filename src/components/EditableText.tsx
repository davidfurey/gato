import React, { useState } from 'react';
import { ButtonGroup, Button, Form, Col } from 'react-bootstrap';

export function EditableText(props: { value: string; update: (v: string) => void }): JSX.Element {
    const [edit, setEdit] = useState(false);
    const [newValue, setNewValue] = useState(props.value);
    
    return edit ? 
      <Col>
        <Form.Control 
          type="text" 
          defaultValue={newValue} 
          onChange={(event): void => setNewValue(event.target.value)} 
        />
        <ButtonGroup size="sm">
          <Button variant="success" onClick={(): void => { props.update(newValue); setEdit(false)}}>
            <span className="material-icons">done</span>
          </Button>
          <Button variant="primary" onClick={(): void => setEdit(false)}>
            <span className="material-icons">clear</span>
          </Button>
        </ButtonGroup>
      </Col> : 
      <Col>
        {props.value} 
        <Button size="sm" variant="info" onClick={(): void => { setNewValue(props.value); setEdit(true)}}>
          <span className="material-icons">create</span>
        </Button>
      </Col>
  }