import React from 'react';
import { Form, Container } from 'react-bootstrap';
import { ImageComponent } from '../OSDComponents/ImageComponent';
import { EditableText } from '../ui';
import { ViewPanel } from '../ViewPanel';
import { SharedStatusContainer } from '../../containers/SharedStatusContainer';
import { EditableImageUrl } from '../ui/EditableImageUrl';
import { Group, Label, TypePropertyNames } from './Pane';

export function ImageEditPane(props: {
  component: ImageComponent;
  updateComponent: (component: ImageComponent) => void;
}): JSX.Element {

  function update<T extends keyof ImageComponent>
    (field: T, convert: (v: string) => ImageComponent[T]): (v: string) => void {
    return (v: string): void =>
      props.updateComponent({
        ...props.component,
        [field]: convert(v)
      })
  }

  function updateNumber<T extends TypePropertyNames<ImageComponent, number>>
    (field: T): (v: string) => void {
    return update(field, parseInt)
  }

  function updateString(field: "name" | "src"): (v: string) => void {
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
    </Form.Group>
    <SharedStatusContainer component={props.component} />
  </Container>
}