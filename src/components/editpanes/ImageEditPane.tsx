import React from 'react';
import { Form, Row, Container } from 'react-bootstrap';
import { ImageComponent } from '../OSDComponents/ImageComponent';
import { EditableText } from '../EditableText';

export function ImageEditPane(props: { 
  component: ImageComponent;
  updateComponent: (component: ImageComponent) => void;
}): JSX.Element {
  return <Container className="mt-3 mb-3"><Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Name</Form.Label>
        <EditableText value={props.component.name} update={(v): void => 
          props.updateComponent({
            ...props.component,
            name: v
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Source</Form.Label>
        <EditableText value={props.component.src} update={(v): void => 
          props.updateComponent({
            ...props.component,
            src: v
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Width</Form.Label>
        <EditableText value={props.component.width.toString()} update={(v): void => 
          props.updateComponent({
            ...props.component,
            width: parseInt(v)
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Height</Form.Label>
        <EditableText value={props.component.height.toString()} update={(v): void => 
          props.updateComponent({
            ...props.component,
            height: parseInt(v)
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Top</Form.Label>
        <EditableText value={props.component.top.toString()} update={(v): void => 
          props.updateComponent({
            ...props.component,
            top: parseInt(v)
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Left</Form.Label>
        <EditableText value={props.component.left.toString()} update={(v): void => 
          props.updateComponent({
            ...props.component,
            left: parseInt(v)
          })
        } />
      </Form.Group>
    </Form.Group></Container>
}