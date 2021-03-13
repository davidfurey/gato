import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Style, Theme } from '../reducers/shared';
import { untitledName } from './ManageSelectorPanel';
import { ThemeList } from './ThemeList';
import { Icon, TabbedPanel, TabContainer } from './ui'
import { v4 as uuid } from 'uuid';

export interface ConfigureSelectorPanelProps {
  themes: { [key: string]: Theme };
  styles: { [key: string]: Style };
  newTheme: (themeId: string, name: string) => void;
  deleteTheme: (themeId: string) => void;
}

export function ConfigureSelectorPanel(props: ConfigureSelectorPanelProps): JSX.Element {
  const newTheme = (): void => {
    const themeId = uuid()
    const untitledPrefix = "Untitled theme"
    const existing = Object.values(props.themes)
      .filter((theme) => theme.name.startsWith(untitledPrefix))
      .map((theme) => theme.name)
    props.newTheme(themeId, untitledName(untitledPrefix, existing))
    // props.openTab({
    //   type: EditPaneType.Event,
    //   id: eventId,
    // })
  }

  return <TabbedPanel variant="pills">
    <TabContainer name="Themes" eventKey="themes">
      <ThemeList
        themes={Object.values(props.themes)}
        openTab={undefined}
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
    </TabContainer>
  </TabbedPanel>
}