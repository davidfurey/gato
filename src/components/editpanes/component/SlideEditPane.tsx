import React from 'react';
import { Form, Container } from 'react-bootstrap';
import { SlideComponent, SlideType } from '../../OSDComponents/SlideComponent';
import { EditableText } from '../../ui';
import { ViewPanel } from '../../ViewPanel';
import { SharedStatusContainer } from '../../../containers/SharedStatusContainer';
import { Group, Label, TypePropertyNames } from '../Pane';
import { EditableImageUrl } from '../../ui/EditableImageUrl';
import { Themes, Styles, Theme, EventParameters } from '../../../reducers/shared';
import { StyleSelector } from '../ComponentEditPane';
import { ComponentDownloadButton } from '../../ComponentDownloadButton';

export function SlideEditPane(props: {
  component: SlideComponent;
  themes: Themes,
  styles: Styles,
  theme: Theme | undefined;
  update: (id: string, component: Partial<SlideComponent>) => void;
  parameters: EventParameters;
}): JSX.Element {

  function update<T extends keyof SlideComponent>
  (field: T): (v: SlideComponent[T]) => void {
    return (v: SlideComponent[T]): void =>
      props.update(props.component.id, {
        [field]: v
      })
  }

  function updateNumber<T extends TypePropertyNames<SlideComponent, number>>
    (field: T): (v: string) => void {
    const fn = update(field)
    return (v: string) => {
      fn(parseInt(v))
    }
  }

  const c = props.component

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
      parameters={props.parameters}
      iframe={true}
    />
    { props.theme ?
      <ComponentDownloadButton
        id={props.component.id}
        parameters={props.parameters}
        theme={props.theme}
      /> : null }
    <Form.Group>
      <Group>
        <Label>Name</Label>
        <EditableText lg={7} value={c.name} update={update("name")} />
      </Group>
      <Group>
        <Label>Title</Label>
        <EditableText lg={7} value={c.title} update={update("title")} />
      </Group>
      <Group>
        <Label>Subtitle</Label>
        <EditableText lg={7} value={c.subtitle} update={update("subtitle")} />
      </Group>
      <Group>
        <Label>Body</Label>
        <EditableText lg={7} value={c.body || ""} update={update("body")} />
      </Group>
      <Group>
        <Label>Source</Label>
        <EditableImageUrl value={c.src} update={update("src")} />
      </Group>
      <Group>
        <Label>Width</Label>
        <EditableText lg={3}  value={c.width.toString()} update={updateNumber("width")} />
      </Group>
      <Group>
        <Label>Height</Label>
        <EditableText lg={3}  value={c.height.toString()} update={updateNumber("height")} />
      </Group>
      <Group>
        <Label>Top</Label>
        <EditableText lg={3}  value={c.top.toString()} update={updateNumber("top")} />
      </Group>
      <Group>
        <Label>Left</Label>
        <EditableText lg={3}  value={c.left.toString()} update={updateNumber("left")} />
      </Group>
      <Group>
          <Label>Style</Label>
          <StyleSelector
            update={update("style")}
            selected={props.component.style ? props.styles[props.component.style] : undefined}
            styles={Object.values(props.styles)}
            componentType={SlideType}
          />
        </Group>
    </Form.Group>
    <SharedStatusContainer component={props.component} />
  </Container>
}
