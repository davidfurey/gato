import React from 'react';
import { TabbedPanel, TabContainer } from '../components/TabbedPanel';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { EditPanelState, EditPane } from '../reducers/editpanel';
import { OSDComponent } from '../OSDComponent';

interface EditPanelProps {
  editPanel: EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPane) => void;
  components: { [key: string]: OSDComponent };
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
          name={props.components[pane.id].name}
          eventKey={pane.id}
          closeTab={(): void => props.closeTab(pane.id)}
        >
          <ListGroup>
          <ListGroupItem>{pane.id} edit panel {pane.type}</ListGroupItem>
          </ListGroup>
        </TabContainer>
        )  
      }
  </TabbedPanel>
}