import React from 'react';
import { Form, Container } from 'react-bootstrap';
import { ImageComponent, ImageType } from '../../OSDComponents/ImageComponent';
import { EditableText } from '../../ui';
import { ViewPanel } from '../../ViewPanel';
import { SharedStatusContainer } from '../../../containers/SharedStatusContainer';
import { EditableImageUrl } from '../../ui/EditableImageUrl';
import { Group, Label, TypePropertyNames } from '../Pane';
import { Themes, Styles, Theme } from '../../../reducers/shared';
import { StyleSelector } from '../ComponentEditPane';

export function ImageEditPane(props: {
  component: ImageComponent;
  update: (id: string, component: Partial<ImageComponent>) => void;
  themes: Themes,
  styles: Styles
  theme: Theme | undefined;
}): JSX.Element {

  function update<T extends keyof ImageComponent>
  (field: T): (v: ImageComponent[T]) => void {
    return (v: ImageComponent[T]): void =>
      props.update(props.component.id, {
        [field]: v
      })
  }

  function updateNumber<T extends TypePropertyNames<ImageComponent, number>>
  (field: T): (v: string) => void {
    const fn = update(field)
    return (v: string) => {
      fn(parseInt(v))
    }
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
      themes={props.themes}
      styles={props.styles}
      themeId={props.theme ? props.theme.id : null}
    />
    <Form.Group>
      <Group>
        <Label>Name</Label>
        <EditableText lg={7} value={props.component.name} update={update("name")} />
      </Group>
      <Group>
        <Label>Source</Label>
        <EditableImageUrl value={props.component.src} update={update("src")} />
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
          <Label>Style</Label>
          <StyleSelector
            update={update("style")}
            selected={props.component.style ? props.styles[props.component.style] : undefined}
            styles={Object.values(props.styles)}
            componentType={ImageType}
          />
        </Group>
    </Form.Group>
    <SharedStatusContainer component={props.component} />
  </Container>
}