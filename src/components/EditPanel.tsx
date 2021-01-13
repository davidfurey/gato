import React from 'react';
import { TabbedPanel, TabContainer } from '../components/TabbedPanel';
import * as EditPane from '../types/editpane';
import { EditPanelState } from '../reducers/editpanel';
import { OSDComponent } from '../OSDComponent';
import { OSDLiveEvent } from '../reducers/shared';
import { ComponentEditPaneContainer } from '../containers/ComponentEditPaneContainer';
import { EventEditPaneContainer } from '../containers/EventEditPaneContainer';

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
  const missingComponent: OSDComponent = {
    id: "",
    name: "Missing component",
    type: "missing",
    shared: false
  }
  const pattern: EditPane.Pattern<JSX.Element> = {
// eslint-disable-next-line react/display-name
    [EditPanelReducer.EditPaneType.Component]: (pane) =>
      <ComponentEditPaneContainer
        pane={pane}
        component={components[pane.id] || { ...missingComponent, id: pane.id }}
      />,
// eslint-disable-next-line react/display-name
      <EventEditPaneContainer
    [EditPane.EditPaneType.Event]: (pane) =>
        pane={pane}
        event={events[pane.id]}
        components={components}
        openTab={openTab}
      />
  }

  return EditPane.matcher(pattern)(pane)
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