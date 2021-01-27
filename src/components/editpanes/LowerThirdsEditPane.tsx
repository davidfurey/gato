import React from "react";
import { LowerThirdsComponent } from "../OSDComponents/LowerThirdsComponent";
import { Container, Form, Row } from "react-bootstrap";
import { EditableText } from '../ui';
import { EditableTextArea } from "../ui";
import { SharedStatusContainer } from "../../containers/SharedStatusContainer";
import { ViewPanel } from "../ViewPanel";

export function LowerThirdsEditPane(props: {
    component: LowerThirdsComponent;
    updateComponent: (component: LowerThirdsComponent) => void;
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
          <EditableText value={props.component.name} update={(v): void =>
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
