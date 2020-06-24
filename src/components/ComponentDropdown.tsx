import { OSDComponent } from '../OSDComponent'
import React from 'react';
import { DropdownButton,Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap'

export function ComponentDropdown(
  props: { 
    selected: OSDComponent | undefined; 
    components: OSDComponent[]; 
    disabled: boolean; 
    setComponent: (id: string) => void;
  }
): JSX.Element {
  if (props.disabled) {
    return <OverlayTrigger overlay={<Tooltip id="button-tooltip">On screen components cannot be changed</Tooltip>}>
      <span className="d-inline-block">
      <DropdownButton
        size="sm"
        variant="dark"
        id="dropdown-basic-button" 
        title={props.selected?.name || "(empty)"} 
        disabled={props.disabled}
        style={{ pointerEvents: 'none' }}
      >
      {props.components.map((component) => 
        <Dropdown.Item 
          key={component.id} 
          onClick={(): void => props.setComponent(component.id)}
        >{component.name}</Dropdown.Item> )}
      </DropdownButton>
      </span>
    </OverlayTrigger>
  } else {
    return <DropdownButton
      size="sm"
      variant="dark"
      id="dropdown-basic-button" 
      title={props.selected?.name || "(empty)"} 
      disabled={props.disabled}
    >
      <Dropdown.Item key={0} onClick={(): void => props.setComponent("0")}>(empty)</Dropdown.Item>
    {props.components.map((component) => 
      <Dropdown.Item key={component.id} onClick={(): void => props.setComponent(component.id)}>
        {component.name}
      </Dropdown.Item> 
    )}
    </DropdownButton>
  }
}