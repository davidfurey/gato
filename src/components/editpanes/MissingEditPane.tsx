import React from 'react';
import * as EditPane from '../../types/editpane';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export interface MissingEditPaneProps {
  pane: EditPane.EditPane;
}

export function MissingEditPane(props: MissingEditPaneProps): JSX.Element {
  return <ListGroup>
    <ListGroupItem>Item with id {props.pane.id} could not be found.</ListGroupItem>
  </ListGroup>
}