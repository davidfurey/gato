import React from 'react';
import * as EditPanelReducer from '../../reducers/editpanel';
import { OSDComponent } from '../../OSDComponent';
import { isLowerThirdsComponent } from '../OSDComponents/LowerThirdsComponent';
import { LowerThirdsEditPane } from './LowerThirdsEditPane';
import { isImageComponent } from '../OSDComponents/ImageComponent';
import { ImageEditPane } from './ImageEditPane';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export interface ComponentEditPaneProps {
  pane: EditPanelReducer.ComponentEditPane;
  component: OSDComponent;
  updateComponent: <T extends OSDComponent>(component: T) => void;
}

export function ComponentEditPane(props: ComponentEditPaneProps): JSX.Element {
  // todo: this should pattern match style
  if (isLowerThirdsComponent(props.component)) {
    return <LowerThirdsEditPane
      component={props.component}
      updateComponent={props.updateComponent}
    />
  } else if (isImageComponent(props.component)) {
    return <ImageEditPane
      component={props.component}
      updateComponent={props.updateComponent}
    />
  } else {
    return <ListGroup>
      <ListGroupItem>Name: {props.component.name}</ListGroupItem>
      <ListGroupItem>Type: {props.component.type}</ListGroupItem>
      <ListGroupItem>Id: {props.component.id}</ListGroupItem>
    </ListGroup>
  }
}