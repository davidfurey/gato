import React from 'react';
import { TabbedPanel, TabContainer } from '../components/ui';
import * as EditPane from '../types/editpane';
import { EditPanelState } from '../reducers/editpanel';
import { OSDComponent } from '../OSDComponent';
import { OSDLiveEvent } from '../reducers/shared';
import { ComponentEditPaneContainer } from '../containers/ComponentEditPaneContainer';
import { EventEditPaneContainer } from '../containers/EventEditPaneContainer';
import { MissingEditPane } from './editpanes/MissingEditPane';
import { assertNever } from '../api/PatternHelpers';

export interface EditPanelProps {
  editPanel: EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPane.EditPane) => void;
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
}

export function Pane(props: {
  pane: EditPane.EditPane;
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
  openTab: (pane: EditPane.EditPane) => void;
}): JSX.Element {
  switch (props.pane.type) {
    case EditPane.EditPaneType.Component: {
      const component = props.components[props.pane.id]
      return component ? <ComponentEditPaneContainer
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
        openTab={props.openTab}
      /> : <MissingEditPane pane={props.pane} />
    }
    default: return assertNever(props.pane)
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
          name={(pane.type === "Event" ? props.events[pane.id]?.name : props.components[pane.id]?.name) || "Missing"}
          eventKey={pane.id}
          closeTab={(): void => props.closeTab(pane.id)}
        >
          <Pane
            pane={pane}
            components={props.components}
            events={props.events}
            openTab={props.openTab}
          />
        </TabContainer>
        )
      }
  </TabbedPanel>
}