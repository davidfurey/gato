import React from 'react';
import * as EditPane from '../../types/editpane';
import { Theme, Themes } from '../../reducers/shared';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Group, Label } from './Pane';
import { EditableText, Icon, IconButton } from '../ui';

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-less";
import "prismjs/themes/prism-okaidia.css";
import { SubPanel } from './event/SubPanel';
import { ParentSelector } from '../ParentSelector';

export interface ThemeEditPaneProps {
  pane: EditPane.ThemeEditPane;
  theme: Theme;
  themes: Themes;
  update: (id: string, component: Partial<Theme>) => void;
}

export function ThemeEditPane(props: ThemeEditPaneProps): JSX.Element {
  const [code, setCode] = React.useState(props.theme.less)

  function update<T extends keyof Theme>
    (field: T): (v: Theme[T]) => void {
    return (v: Theme[T]): void =>
      props.update(props.theme.id, {
        [field]: v
      })
  }

  const lessGrammar = languages.less
  return <Container className="mt-3 mb-3 event-edit-pane">
    <Form.Group>
      <Group>
        <Label>Name</Label>
        <EditableText lg={7} value={props.theme.name} update={update("name")} />
      </Group>
      <Group>
        <Label>Parent</Label>
        <ParentSelector
          selected={props.theme.parent ? props.themes[props.theme.parent] : undefined}
          items={props.themes}
          child={props.theme.id}
          update={update("parent")}
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
      }}
    /> : <Alert variant="danger">Missing grammar for less</Alert> }
    </div>
      <Card.Footer className="p-2">
        { code === props.theme.less ?
          <IconButton raised={true} icon="sync" disabled> CSS in sync</IconButton> :
          <IconButton
            variant="danger"
            raised={true}
            icon="file_upload"
            onClick={() => props.update(props.theme.id, { less: code })}> Update
          </IconButton>
        }
      </Card.Footer>
    </SubPanel>
  </Container>
}