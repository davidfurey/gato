import React from 'react';
import { ListGroup, ListGroupItem, Col, DropdownButton, Dropdown, Row, ButtonGroup, ButtonToolbar } from 'react-bootstrap'
import { ComponentType, OSDLiveEvents, Settings, Style, Styles, Theme, Themes, } from '../reducers/shared'
import { CollapsablePanel } from './ui'
import { componentTypes, componentTypeAsString } from './OSDComponents';

export interface SettingsPanelProps {
  settings: Settings;
  events: OSDLiveEvents;
  themes: Themes;
  styles: Styles;
  setEvent: (eventId: string) => void;
  setDefaultStyle: (styleId: string | null, type: ComponentType) => void;
}

function StyleSelector(props: {
  styles: Style[]
  selected: Style | undefined;
  update: (styleId: string | null, componentType: ComponentType) => void;
  componentType: ComponentType;
}): JSX.Element {
  return <Col sm="9">
    <DropdownButton
      className="btn-block"
      size="sm"
      variant="secondary"
      title={props.selected ? props.selected.name : "(none)"}
    >
      <Dropdown.Item onClick={(): void => props.update(null, props.componentType)}>
        (none)
      </Dropdown.Item>
      {props.styles.filter((style) => style.componentType === props.componentType).map((style) =>
        <Dropdown.Item key={style.id} onClick={(): void =>
          props.update(style.id, props.componentType)
        }>{style.name}</Dropdown.Item>
      )}
    </DropdownButton>
  </Col>
}

export function SettingsPanel(props: SettingsPanelProps): JSX.Element {
  return (
    <CollapsablePanel header="Settings" open={false}>
      <ListGroup>
      <ListGroup.Item className="text-light font-weight-bold border-bottom-0 pb-1 pt-3">Default styles</ListGroup.Item>
      {componentTypes.map((componentType) => {
        const selectedStyleId = props.settings.defaultStyles[componentType]
      return <ListGroupItem key={componentType} className="pl-5 border-bottom-0">
        <Row><Col sm="3">{componentTypeAsString(componentType)}</Col>
        <StyleSelector
          selected={selectedStyleId ?
            props.styles[selectedStyleId] :
            undefined}
          styles={Object.values(props.styles)}
          update={props.setDefaultStyle}
          componentType={componentType}
        /></Row>
        </ListGroupItem>})}
      </ListGroup>
    </CollapsablePanel>
  )
}