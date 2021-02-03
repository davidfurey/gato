import React from 'react';
import { Form, Container } from 'react-bootstrap';
import { SlideComponent } from '../../OSDComponents/SlideComponent';
import { EditableText } from '../../ui';
import { ViewPanel } from '../../ViewPanel';
import { SharedStatusContainer } from '../../../containers/SharedStatusContainer';
import { Group, Label, TypePropertyNames } from '../Pane';
import { EditableImageUrl } from '../../ui/EditableImageUrl';

export function SlideEditPane(props: {
  component: SlideComponent;
  updateComponent: (component: SlideComponent) => void;
}): JSX.Element {

  function update<T extends keyof SlideComponent>
    (field: T, convert: (v: string) => SlideComponent[T]): (v: string) => void {
    return (v: string): void =>
      props.updateComponent({
        ...props.component,
        [field]: convert(v)
      })
  }

  function updateNumber<T extends TypePropertyNames<SlideComponent, number>>
    (field: T): (v: string) => void {
    return update(field, parseInt)
  }

  function updateString(field: "name" | "src" | "title" | "subtitle"): (v: string) => void {
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
        <Label>Source</Label>
        <EditableImageUrl value={props.component.src} update={updateString("src")} />
      </Group>
      <Group>
        <Label>Width</Label>
        <EditableText lg={3}  value={props.component.width.toString()} update={updateNumber("width")} />
      </Group>
      <Group>
        <Label>Height</Label>
        <EditableText lg={3}  value={props.component.height.toString()} update={updateNumber("height")} />
      </Group>
      <Group>
        <Label>Top</Label>
        <EditableText lg={3}  value={props.component.top.toString()} update={updateNumber("top")} />
      </Group>
      <Group>
        <Label>Left</Label>
        <EditableText lg={3}  value={props.component.left.toString()} update={updateNumber("left")} />
      </Group>
      <Group>
        <Label>Class name</Label>
        <EditableText lg={7} value={props.component.className || ""} update={update("className", (v) => v === "" ? null : v)} />
      </Group>
    </Form.Group>
    <SharedStatusContainer component={props.component} />
  </Container>
}