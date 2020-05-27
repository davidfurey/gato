import React from 'react';
import { Button, ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDLiveEvent } from '../reducers/shared';
import { EditPane, EditPaneType } from '../reducers/editpanel';

function EventListItem(props: { 
  event: OSDLiveEvent;
  openTab: (pane: EditPane) => void;
 }): JSX.Element {
  function settings(): void {
    props.openTab({
      type: EditPaneType.Event,
      id: props.event.id,
    })
  }

  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    {props.event.name}
    <ButtonGroup>
      <Button variant="info" size="sm" onClick={settings}><span className="material-icons">settings</span></Button>
      <Button variant="danger" size="sm"><span className="material-icons">delete</span></Button> {/* todo: bigger bin*/}
    </ButtonGroup>
  </ListGroup.Item>
}

export function EventList(
  props: { events: OSDLiveEvent[]; openTab: (pane: EditPane) => void }
): JSX.Element {
  return <ListGroup variant="flush">
    {props.events.map((event) => 
      <EventListItem key={event.id} event={event} openTab={props.openTab} />
    )}
  </ListGroup>
}