import React from 'react';
import { SplitButton, Button, Form, ListGroup, ListGroupItem } from 'react-bootstrap'
import { OSDLiveEvent } from '../reducers/shared'
import { CollapsablePanel } from './CollapsablePanel';

interface SettingsPanelProps {
  event: OSDLiveEvent | undefined;
  events: OSDLiveEvent[];
  setEvent: (eventId: string) => void;
}

export function SettingsPanel(props: SettingsPanelProps): JSX.Element {
  return (
    <CollapsablePanel header="Settings" open={false}>
      <ListGroup>
        <ListGroupItem>
          {/* should probably be a regular select with a load button */}
          <SplitButton
            size="sm"
            variant="dark"
            id="dropdown-basic-button" 
            title={props.event?.name || "(empty)"} 
          >
            <Form>{/* horizontal? */}
              <Form.Group>
                <Form.Label>Events</Form.Label>
                <Form.Control as="select">
{/* {props.events.map((component, i) => <Dropdown.Item 
key={component.id} onClick={() => props.setEvent(component.id)}>{component.name}</Dropdown.Item> 
)} */}
                {props.events.map((component) => 
                  <option key={component.id} value={component.id}>{component.name}</option> 
                )}
                </Form.Control>
              </Form.Group>
              <Button variant="warning" type="submit">Load</Button>
              <Button variant="info" type="submit" onClick={(): void => {
                // do nothing
              }}>Cancel</Button>
            </Form>
          </SplitButton>
        </ListGroupItem>
      </ListGroup>
    </CollapsablePanel>
  )
}