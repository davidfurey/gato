import React from 'react';
import { TabbedPanel, TabContainer } from '../components/TabbedPanel';
import * as EditPanelReducer from '../reducers/editpanel';
import { OSDComponent } from '../OSDComponent';
import { OSDLiveEvent } from '../reducers/shared';
import { ComponentEditPane } from './editpanes/ComponentEditPane';
import { EventEditPaneContainer } from '../containers/EventEditPaneContainer';

interface EditPanelProps {
  editPanel: EditPanelReducer.EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPanelReducer.EditPane) => void;
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
  updateComponent: <T extends OSDComponent>(component: T) => void;
  removeComponent: (eventId: string, componentId: string) => void;
  addComponent: (eventId: string, componentId: string) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
  updateEvent: (event: OSDLiveEvent) => void;
}

export function createPane(
  pane: EditPanelReducer.EditPane, 
  components: { [key: string]: OSDComponent },
  events: { [key: string]: OSDLiveEvent },
  updateComponent: <T extends OSDComponent>(component: T) => void,
  openTab: (pane: EditPanelReducer.EditPane) => void
): JSX.Element {
  const pattern: EditPanelReducer.Pattern<JSX.Element> = {
// eslint-disable-next-line react/display-name
    [EditPanelReducer.EditPaneType.Component]: (pane) =>
      <ComponentEditPane 
        pane={pane} 
        component={components[pane.id]} 
        updateComponent={updateComponent} 
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
          name={pane.type === "Event" ? props.events[pane.id].name : props.components[pane.id].name}
          eventKey={pane.id}
          closeTab={(): void => props.closeTab(pane.id)}
        >
          { createPane(
              pane, 
              props.components, 
              props.events, 
              props.updateComponent, 
              props.openTab
          ) }
        </TabContainer>
        )  
      }
  </TabbedPanel>
}