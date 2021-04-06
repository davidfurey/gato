import React from 'react';
import * as EditPane from '../../types/editpane';
import { Style, Styles } from '../../reducers/shared';
import { Button, Card, Col, Container, Form } from 'react-bootstrap';
import { Group, Label } from './Pane';
import { EditableText, Icon } from '../ui';
import { componentTypeAsString } from '../OSDComponents';

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-less";
import "prismjs/themes/prism-okaidia.css";
import { SubPanel } from './event/SubPanel';
import { ParentSelector } from '../ParentSelector';

export interface StyleEditPaneProps {
  pane: EditPane.StyleEditPane;
  style: Style;
  update: (id: string, component: Partial<Style>) => void;
  styles: Styles
}

export function StyleEditPane(props: StyleEditPaneProps): JSX.Element {
  const [code, setCode] = React.useState(props.style.less)

  function update<T extends keyof Style>
    (field: T): (v: Style[T]) => void {
    return (v: Style[T]): void =>
      props.update(props.style.id, {
        [field]: v
      })
  }

  const lessGrammar = languages.less
  return <Container className="mt-3 mb-3 event-edit-pane">
    <Form.Group>
      <Group>
        <Label>Name</Label>
        <EditableText lg={7} value={props.style.name} update={update("name")} />
      </Group>
      <Group>
        <Label>Type</Label>
        <Col lg={7}><div className="form-control-plaintext">{ componentTypeAsString(props.style.componentType) }</div></Col>
      </Group>
      <Group>
        <Label>Parent</Label>
        <ParentSelector
          selected={props.style.parent ? props.styles[props.style.parent] : undefined}
          items={props.styles}
          child={props.style.id}
          update={update("parent")}
          filter={(s) => s.componentType === props.style.componentType}
        />
      </Group>
    </Form.Group>
    <SubPanel title="CSS" icon="code">
    <div style={{
      maxHeight: "400px",
      overflowY: "auto",
    }}>
    { lessGrammar ?
    <Editor
      value={code}
      onValueChange={(code) => setCode(code)}
      highlight={(code) => highlight(code, lessGrammar, 'less')}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        // background: "var(--secondary)",
      }}
    /> : <p>Missing grammar for less</p> }
    </div>
      <Card.Footer className="p-2">
        <Button onClick={() => props.update(props.style.id, { less: code })}>
          <Icon name="file_upload" raised />
          Update
        </Button>
      </Card.Footer>
    </SubPanel>
  </Container>
}