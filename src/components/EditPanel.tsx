import React from 'react';
import { TabbedPanel, TabContainer } from '../components/ui';
import * as EditPane from '../types/editpane';
import { EditPanelState } from '../reducers/editpanel';
import { OSDComponents } from '../OSDComponent';
import { OSDLiveEvent, Style, Themes } from '../reducers/shared';
import { ComponentEditPaneContainer } from '../containers/ComponentEditPaneContainer';
import { EventEditPaneContainer } from '../containers/EventEditPaneContainer';
import { ThemeEditPaneContainer } from '../containers/ThemeEditPaneContainer';
import { StyleEditPaneContainer } from '../containers/StyleEditPaneContainer';
import { MissingEditPane } from './editpanes/MissingEditPane';
import { assertNever } from '../api/PatternHelpers';

export interface EditPanelProps {
  editPanel: EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPane.EditPane) => void;
  components: OSDComponents;
  events: { [key: string]: OSDLiveEvent };
  themes: Themes;
  styles: { [key: string]: Style };
}

export function Pane(props: {
  pane: EditPane.EditPane;
  components: OSDComponents;
  events: { [key: string]: OSDLiveEvent };
  themes: Themes;
  styles: { [key: string]: Style };
  openTab: (pane: EditPane.EditPane) => void;
}): JSX.Element {
  switch (props.pane.type) {
    case EditPane.EditPaneType.Component: {
      const component = props.components[props.pane.id]
      return component ? <ComponentEditPaneContainer
        styles={props.styles}
        themes={props.themes}
        pane={props.pane}
        component={component}
      /> : <MissingEditPane pane={props.pane} />
    }
    case EditPane.EditPaneType.Event: {
      const event = props.events[props.pane.id]
      return event ? <EventEditPaneContainer
        pane={props.pane}
        event={event}
        components={props.components}
        themes={props.themes}
        openTab={props.openTab}
      /> : <MissingEditPane pane={props.pane} />
    }
    case EditPane.EditPaneType.Theme: {
      const theme = props.themes[props.pane.id]
      return theme ? <ThemeEditPaneContainer
        pane={props.pane}
        theme={theme}
        themes={props.themes}
      /> : <MissingEditPane pane={props.pane} />
    }
    case EditPane.EditPaneType.Style: {
      const style = props.styles[props.pane.id]
      return style ? <StyleEditPaneContainer
        pane={props.pane}
        style={style}
        styles={props.styles}
      /> : <MissingEditPane pane={props.pane} />
    }
    default: return assertNever(props.pane)
  }
}

function paneName(pane: EditPane.EditPane, props: EditPanelProps): string | undefined {
  switch (pane.type) {
    case EditPane.EditPaneType.Event: return props.events[pane.id]?.name
    case EditPane.EditPaneType.Component: return props.components[pane.id]?.name
    case EditPane.EditPaneType.Theme: return props.themes[pane.id]?.name
    case EditPane.EditPaneType.Style: return props.styles[pane.id]?.name
    default: return assertNever(pane)
  }
}

export function EditPanel(props: EditPanelProps): JSX.Element {
  return <TabbedPanel
      defaultActiveKey={props.editPanel.selected}
      onSelect={props.selectTab}
      activeKey={props.editPanel.selected}
    >
      {
        props.editPanel.panes.map((pane) => <TabContainer
          key={pane.id}
          name={paneName(pane, props) || "Missing"}
          eventKey={pane.id}
          closeTab={(): void => props.closeTab(pane.id)}
        >
          <Pane
            pane={pane}
            components={props.components}
            events={props.events}
            openTab={props.openTab}
            styles={props.styles}
            themes={props.themes}
          />
        </TabContainer>
        )
      }
  </TabbedPanel>
}