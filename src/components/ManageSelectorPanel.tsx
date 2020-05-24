import React from 'react';
import { ComponentList } from './ComponentList'
import { EventList } from './EventList'
import { OSDLiveEvent } from '../reducers/shared';
import { OSDComponent } from '../OSDComponent';
import { TabbedPanel, TabContainer } from './TabbedPanel'
import { EditPane } from '../reducers/editpanel';

interface ManageSelectorPanelProps {
  events: { [key: string]: OSDLiveEvent };
  components: { [key: string]: OSDComponent };
  deleteComponent: (id: string) => void;
  openTab: (pane: EditPane) => void;
}

export function ManageSelectorPanel(props: ManageSelectorPanelProps): JSX.Element {
  return <TabbedPanel>
    <TabContainer name="Event" eventKey="events">
      <EventList events={Object.values(props.events)} openTab={props.openTab} />
    </TabContainer>
    <TabContainer name="Components" eventKey="components">
      <ComponentList 
        components={Object.values(props.components)} 
        deleteComponent={props.deleteComponent}
        openTab={props.openTab}
      />
    </TabContainer>
  </TabbedPanel>
}