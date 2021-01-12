import React from 'react';
import { TabbedPanel, TabContainer } from '../components/TabbedPanel';
import * as EditPanelReducer from '../reducers/editpanel';
import { OSDComponent } from '../OSDComponent';
import { OSDLiveEvent } from '../reducers/shared';
import { ComponentEditPaneContainer } from '../containers/ComponentEditPaneContainer';
import { EventEditPaneContainer } from '../containers/EventEditPaneContainer';

export interface EditPanelProps {
  editPanel: EditPanelReducer.EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPanelReducer.EditPane) => void;
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
}

export function createPane(
  pane: EditPanelReducer.EditPane,
  components: { [key: string]: OSDComponent },
  events: { [key: string]: OSDLiveEvent },
  openTab: (pane: EditPanelReducer.EditPane) => void
): JSX.Element {
  const missingComponent: OSDComponent = {
    id: "",
    name: "Missing component",
    type: "missing",
    shared: false
  }
  const pattern: EditPanelReducer.Pattern<JSX.Element> = {
// eslint-disable-next-line react/display-name
    [EditPanelReducer.EditPaneType.Component]: (pane) =>
      <ComponentEditPaneContainer
        pane={pane}
        component={components[pane.id] || { ...missingComponent, id: pane.id }}
      />,
// eslint-disable-next-line react/display-name
    [EditPanelReducer.EditPaneType.Event]: (pane) =>
      <EventEditPaneContainer
        pane={pane}
        event={events[pane.id]}
        components={components}
        openTab={openTab}
      />
  }

  return EditPanelReducer.matcher(pattern)(pane)
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