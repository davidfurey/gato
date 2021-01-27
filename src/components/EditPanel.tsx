import React from 'react';
import { TabbedPanel, TabContainer } from '../components/ui';
import * as EditPane from '../types/editpane';
import { EditPanelState } from '../reducers/editpanel';
import { OSDComponent } from '../OSDComponent';
import { OSDLiveEvent } from '../reducers/shared';
import { ComponentEditPaneContainer } from '../containers/ComponentEditPaneContainer';
import { EventEditPaneContainer } from '../containers/EventEditPaneContainer';
import { MissingEditPane } from './editpanes/MissingEditPane';

export interface EditPanelProps {
  editPanel: EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPane.EditPane) => void;
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
}

export function createPane(
  pane: EditPane.EditPane,
  components: { [key: string]: OSDComponent },
  events: { [key: string]: OSDLiveEvent },
  openTab: (pane: EditPane.EditPane) => void
): JSX.Element {
  const pattern: EditPane.Pattern<JSX.Element | null> = {
// eslint-disable-next-line react/display-name
    [EditPane.EditPaneType.Component]: (pane) => {
      const component = components[pane.id]
      return component ? <ComponentEditPaneContainer
        pane={pane}
        component={component}
      /> : null
    },
// eslint-disable-next-line react/display-name
    [EditPane.EditPaneType.Event]: (pane) => {
      const event = events[pane.id]
      return event ? <EventEditPaneContainer
        pane={pane}
        event={event}
        components={components}
        openTab={openTab}
      /> : null
    }
  }

  return EditPane.matcher(pattern)(pane) || <MissingEditPane pane={pane} />
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
          name={(pane.type === "Event" ? props.events[pane.id]?.name : props.components[pane.id]?.name) || "Missing"}
          eventKey={pane.id}
          closeTab={(): void => props.closeTab(pane.id)}
        >
          { createPane(
              pane,
              props.components,
              props.events,
              props.openTab
          ) }
        </TabContainer>
        )
      }
  </TabbedPanel>
}