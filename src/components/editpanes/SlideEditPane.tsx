import React from 'react';
import { Form, Row, Container, Col, InputGroup } from 'react-bootstrap';
import { SlideComponent } from '../OSDComponents/SlideComponent';
import { EditableText } from '../EditableText';
import { EditableTextArea } from '../EditableTextArea';
import { ViewPanel } from '../ViewPanel';
import { SharedStatusContainer } from '../../containers/SharedStatusContainer';
import { ImagePicker } from '../ImagePicker';

function pathFromUrl(s: string): string {
  return new URL(s, "https://streamer-1").pathname
}

export function SlideEditPane(props: {
  component: SlideComponent;
  updateComponent: (component: SlideComponent) => void;
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
          <Form.Label column lg={2}>Title</Form.Label>
          <EditableText value={props.component.title} update={(v): void =>
            props.updateComponent({
              ...props.component,
              title: v
            })
          } />
        </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Subtitle</Form.Label>
        <EditableTextArea value={props.component.subtitle} update={(v): void =>
          props.updateComponent({
            ...props.component,
            subtitle: v
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Source</Form.Label>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
            <InputGroup.Text>
              {pathFromUrl(props.component.src)}
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
      <Form.Group as={Row}>
          <Form.Label column lg={2}>Class name</Form.Label>
          <EditableText value={props.component.className || ""} update={(v): void =>
            props.updateComponent({
              ...props.component,
              className: v === "" ? null : v
            })
          } />
        </Form.Group>
    </Form.Group>
    <SharedStatusContainer component={props.component} />
  </Container>
}