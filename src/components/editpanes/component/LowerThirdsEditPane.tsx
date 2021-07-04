import React from "react";
import { LowerThirdsComponent, LowerThirdsType } from "../../OSDComponents/LowerThirdsComponent";
import { Container, Form } from "react-bootstrap";
import { EditableText, EditableTextArea } from '../../ui';
import { SharedStatusContainer } from "../../../containers/SharedStatusContainer";
import { ViewPanel } from "../../ViewPanel";
import { Group, Label } from "../Pane";
import { StyleSelector } from "../ComponentEditPane";
import { Styles, Theme, Themes } from "../../../reducers/shared";

export function LowerThirdsEditPane(props: {
    component: LowerThirdsComponent;
    styles: Styles;
    themes: Themes;
    theme: Theme | undefined;
    update: (id: string, component: Partial<LowerThirdsComponent>) => void;
  }): JSX.Element {

    function update<T extends keyof LowerThirdsComponent>
    (field: T): (v: LowerThirdsComponent[T]) => void {
      return (v: LowerThirdsComponent[T]): void =>
        props.update(props.component.id, {
          [field]: v
        })
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
          iframe={true}
        />
        <Form.Group>
        <Group>
          <Label>Name</Label>
          <EditableText lg={7} value={props.component.name} update={update("name")} />
        </Group>
        <Group>
          <Label>Title</Label>
          <EditableText lg={7} value={props.component.title} update={update("title")} />
        </Group>
        <Group>
          <Label>Subtitle</Label>
          <EditableTextArea lg={7} value={props.component.subtitle} update={update("subtitle")} />
        </Group>
        <Group>
          <Label>Style</Label>
          <StyleSelector
            update={update("style")}
            selected={props.component.style ? props.styles[props.component.style] : undefined}
            styles={Object.values(props.styles)}
            componentType={LowerThirdsType}
          />
        </Group>
        </Form.Group>
        <SharedStatusContainer component={props.component} />
      </Container>
  }
