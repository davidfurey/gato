import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { ComponentType, Style, Theme } from '../reducers/shared';
import { untitledName } from './ManageSelectorPanel';
import { ThemeList } from './ThemeList';
import { Icon, TabbedPanel, TabContainer } from './ui'
import { v4 as uuid } from 'uuid';
import { EditPane, EditPaneType } from "../types/editpane";
import { StyleList } from './StyleList';
import { CreateStyleButton } from './CreateStyleButton';

export interface ConfigureSelectorPanelProps {
  themes: { [key: string]: Theme };
  styles: { [key: string]: Style };
  newTheme: (themeId: string, name: string) => void;
  deleteTheme: (themeId: string) => void;
  newStyle: (styleId: string, name: string, componentType: ComponentType) => void;
  deleteStyle: (styleId: string) => void;
  openTab: (pane: EditPane) => void;
}

export function ConfigureSelectorPanel(props: ConfigureSelectorPanelProps): JSX.Element {
  const newTheme = (): void => {
    const themeId = uuid()
    const untitledPrefix = "Untitled theme"
    const existing = Object.values(props.themes)
      .filter((theme) => theme.name.startsWith(untitledPrefix))
      .map((theme) => theme.name)
    props.newTheme(themeId, untitledName(untitledPrefix, existing))
    props.openTab({
      type: EditPaneType.Theme,
      id: themeId,
    })
  }

  const newStyle = (name: string, componentType: ComponentType): void => {
    const styleId = uuid()
    props.newStyle(styleId, name, componentType)
    props.openTab({
      type: EditPaneType.Style,
      id: styleId,
    })
  }

  return <TabbedPanel variant="pills">
    <TabContainer name="Themes" eventKey="themes">
      <ThemeList
        themes={Object.values(props.themes)}
        openTab={props.openTab}
        deleteTheme={props.deleteTheme}
        scroll={true}
      />
      <Card.Footer className="p-2">
        <Button onClick={(): void => newTheme()}>
          <Icon name="add" raised />
          New theme
        </Button>
      </Card.Footer>
    </TabContainer>
    <TabContainer name="Styles" eventKey="styles">
      <StyleList
        styles={Object.values(props.styles)}
        openTab={props.openTab}
        deleteStyle={props.deleteStyle}
        scroll={true}
      />
      <Card.Footer className="p-2">
        <CreateStyleButton newStyle={newStyle} />
      </Card.Footer>
    </TabContainer>
  </TabbedPanel>
}