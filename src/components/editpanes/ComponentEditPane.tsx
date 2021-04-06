import React from 'react';
import * as EditPane from '../../types/editpane';
import { OSDComponent } from '../../OSDComponent';
import { isLowerThirdsComponent } from '../OSDComponents/LowerThirdsComponent';
import { LowerThirdsEditPane } from './component/LowerThirdsEditPane';
import { isImageComponent } from '../OSDComponents/ImageComponent';
import { ImageEditPane } from './component/ImageEditPane';
import { Col, Dropdown, DropdownButton, ListGroup, ListGroupItem } from 'react-bootstrap';
import { isSlideComponent } from '../OSDComponents/SlideComponent';
import { SlideEditPane } from './component/SlideEditPane';
import { ComponentType, Style, Styles, Theme, Themes } from '../../reducers/shared';

export interface ComponentEditPaneProps {
  pane: EditPane.ComponentEditPane;
  styles: Styles;
  themes: Themes;
  theme: Theme | undefined;
  component: OSDComponent;
  update: <T extends OSDComponent>(id: string, component: Partial<T>) => void;
}

export function StyleSelector(props: {
  styles: Style[]
  selected: Style | undefined;
  update: (s: string | null) => void;
  componentType: ComponentType;
}): JSX.Element {
  return <Col>
    <DropdownButton
      variant="secondary"
      title={props.selected ? props.selected.name : "(none)"}
    >
      <Dropdown.Item onClick={(): void => props.update(null)}>
        (none)
      </Dropdown.Item>
      {props.styles.filter((style) => style.componentType === props.componentType).map((style) =>
        <Dropdown.Item key={style.id} onClick={(): void => props.update(style.id)}>
          {style.name}
        </Dropdown.Item>
      )}
    </DropdownButton>
  </Col>
}

export function ComponentEditPane(props: ComponentEditPaneProps): JSX.Element {
  if (isLowerThirdsComponent(props.component)) {
    return <LowerThirdsEditPane
      component={props.component}
      styles={props.styles}
      update={props.update}
      themes={props.themes}
      theme={props.theme}
    />
  } else if (isImageComponent(props.component)) {
    return <ImageEditPane
      component={props.component}
      update={props.update}
      themes={props.themes}
      styles={props.styles}
      theme={props.theme}
    />
  } else if (isSlideComponent(props.component)) {
    return <SlideEditPane
      component={props.component}
      update={props.update}
      themes={props.themes}
      styles={props.styles}
      theme={props.theme}
    />
  } else {
    return <ListGroup>
      <ListGroupItem>Name: {props.component.name}</ListGroupItem>
      <ListGroupItem>Type: {props.component.type}</ListGroupItem>
      <ListGroupItem>Id: {props.component.id}</ListGroupItem>
    </ListGroup>
  }
}