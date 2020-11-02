import React from 'react';
import { Form, Row, Container, Col, InputGroup } from 'react-bootstrap';
import { ImageComponent } from '../OSDComponents/ImageComponent';
import { EditableText } from '../EditableText';
import { ViewPanel } from '../ViewPanel';
import { SharedStatusContainer } from '../../containers/SharedStatusContainer';
import { ImagePicker } from '../ImagePicker';

export function ImageEditPane(props: {
  component: ImageComponent;
  updateComponent: (component: ImageComponent) => void;
}): JSX.Element {
  return <Container className="mt-3 mb-3">
    <ViewPanel
      name={"manage"}
      showCaption={false}
      preview={true}
      components={[{
        component: props.component,
        state: "visible"
      }]}
    />
    <Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Name</Form.Label>
        <EditableText lg={7} value={props.component.name} update={(v): void =>
          props.updateComponent({
            ...props.component,
            name: v
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Source</Form.Label>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
            <InputGroup.Text>
              {props.component.src}
            </InputGroup.Text>
            </InputGroup.Prepend>
            <InputGroup.Append>
            <ImagePicker
              initialPath={new URL(props.component.src).pathname.replace(/^\/[^/]*/, '')}
              style={{border: "1px solid var(--gray-dark)" }}
              image={(img: string): void => props.updateComponent({
                ...props.component,
                src: img
              })
            } />
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Width</Form.Label>
        <EditableText lg={3}  value={props.component.width.toString()} update={(v): void =>
          props.updateComponent({
            ...props.component,
            width: parseInt(v)
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Height</Form.Label>
        <EditableText lg={3}  value={props.component.height.toString()} update={(v): void =>
          props.updateComponent({
            ...props.component,
            height: parseInt(v)
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Top</Form.Label>
        <EditableText lg={3}  value={props.component.top.toString()} update={(v): void =>
          props.updateComponent({
            ...props.component,
            top: parseInt(v)
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Left</Form.Label>
        <EditableText lg={3}  value={props.component.left.toString()} update={(v): void =>
          props.updateComponent({
            ...props.component,
            left: parseInt(v)
          })
        } />
      </Form.Group>
    </Form.Group>
    <SharedStatusContainer component={props.component} />
  </Container>
}