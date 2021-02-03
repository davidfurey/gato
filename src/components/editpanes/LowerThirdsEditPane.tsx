import React from "react";
import { LowerThirdsComponent } from "../OSDComponents/LowerThirdsComponent";
import { Container, Form } from "react-bootstrap";
import { EditableText } from '../ui';
import { SharedStatusContainer } from "../../containers/SharedStatusContainer";
import { ViewPanel } from "../ViewPanel";
import { Group, Label } from "./Pane";

export function LowerThirdsEditPane(props: {
    component: LowerThirdsComponent;
    updateComponent: (component: LowerThirdsComponent) => void;
  }): JSX.Element {

    function update<T extends keyof LowerThirdsComponent>
    (field: T, convert: (v: string) => LowerThirdsComponent[T]): (v: string) => void {
      return (v: string): void =>
        props.updateComponent({
          ...props.component,
          [field]: convert(v)
        })
    }

    function updateString(field: "name" | "title" | "subtitle"): (v: string) => void {
      return update(field, (s) => s)
    }

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
        <Group>
          <Label>Name</Label>
          <EditableText lg={7} value={props.component.name} update={updateString("name")} />
        </Group>
        <Group>
          <Label>Title</Label>
          <EditableText lg={7} value={props.component.title} update={updateString("title")} />
        </Group>
        <Group>
          <Label>Subtitle</Label>
          <EditableText lg={7} value={props.component.subtitle} update={updateString("subtitle")} />
        </Group>
        <Group>
          <Label>Class name</Label>
          <EditableText lg={7} value={props.component.className || ""} update={update("className", (v) => v === "" ? null : v)} />
        </Group>
        </Form.Group>
        <SharedStatusContainer component={props.component} />
      </Container>
  }
