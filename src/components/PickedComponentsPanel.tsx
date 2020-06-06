import { OSDComponent } from '../OSDComponent'
import React from 'react';
import { Display, OnScreenComponentState, ScreenType } from '../reducers/shared'
import { ButtonToolbar, DropdownButton,Dropdown, ButtonGroup, ListGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { CollapsablePanel } from './CollapsablePanel';

export interface PickedComponentsPanelProps {
  components: OSDComponent[];
  show: (id: string, displayId: string) => void;
  hide: (id: string, displayId: string) => void;
  setComponent?: (index: number, id: string) => void;
  displays: Display[];
  pickedComponents: (string | null)[];
  slots?: number;
  title: string;
}

interface PickedComponentProps {
  availableComponents: OSDComponent[];
  show: (id: string, displayId: string) => void;
  hide: (id: string, displayId: string) => void;
  setComponent?: (id: string) => void;
  displays: { 
    id: string; 
    name: string; 
    componentState: OnScreenComponentState | undefined; 
    type: ScreenType;
  }[];
  component: OSDComponent | undefined;
}

function buttonVariant(screenType: ScreenType, componentState?: OnScreenComponentState): "danger" | "primary" | "outline-danger" | "outline-primary" {
  if (screenType === "OnAir") {
    return (componentState === "visible" || componentState === "entering") ? "danger" : "outline-danger"
  } else {
    return (componentState === "visible" || componentState === "entering") ? "primary" : "outline-primary"
  }
}

function ShowHideButton(
  props: { 
    disabled: boolean;
    displayName: string; 
    displayType: ScreenType; 
    componentState?: OnScreenComponentState; 
    show: () => void; 
    hide: () => void;
  }
): JSX.Element {
  return <Button
    size="sm"
    type="button"
    className={(props.componentState === "visible" || props.componentState === "entering") ? "" : "no-hover"}
    disabled={props.disabled}
    variant={buttonVariant(props.displayType, props.componentState)}  
    onClick={(props.componentState === "visible" || props.componentState === "entering") ? props.hide : props.show}>{props.displayName}</Button>
}

function ComponentPicker(
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
function PickedComponent(props: PickedComponentProps): JSX.Element {
  return <ButtonToolbar className="justify-content-between">
    <ButtonGroup>
      { props.setComponent !== undefined ?
        <ComponentPicker 
          selected={props.component} 
          components={props.availableComponents} 
          disabled={props.displays.some((d) => d.componentState === "entering" || d.componentState === "visible")} 
          setComponent={props.setComponent} />
          : props.component?.name }
    </ButtonGroup>
    <ButtonGroup>
      { props.displays.map((display) =>
        props.component?.id ?
        <ShowHideButton
          show={(): void => { 
            props.component?.id ? props.show(props.component?.id, display.id) : null 
          }}
          hide={(): void => { 
            props.component?.id ? props.hide(props.component?.id, display.id) : null 
          }}
          componentState={display.componentState}
          disabled={!props.component?.id}
          key={display.id} displayName={display.name} displayType={display.type} /> : null
      )}
    </ButtonGroup></ButtonToolbar>
}

//export class SettingsPanel extends Component<SettingsPanelProps, SettingsPanelState> {
export function PickedComponentsPanel(props: PickedComponentsPanelProps): JSX.Element {
  const slots = props.slots !== undefined ? props.slots : 10
  const setComponent = props.setComponent
  return <CollapsablePanel header={props.title}>
    <ListGroup variant="flush">
      { props.pickedComponents.concat(
          Array(Math.max(0, slots - props.pickedComponents.length)).fill(null)
        ).map((c, i) => 
        <ListGroup.Item key={i}>
          <PickedComponent 
            component={props.components.find((a) => a.id === c)} 
            availableComponents={props.components} 
            show={props.show} 
            hide={props.hide}
            setComponent={setComponent !== undefined ? 
              (componentId: string): void => setComponent(i, componentId) : undefined}
            displays={props.displays.map((display) => {
              return { 
                id: display.id, 
                name: display.name, 
                componentState: display.onScreenComponents.find((a) => a.id === c)?.state, 
                type: display.type 
              }            
            })} />
          </ListGroup.Item>
      )}
    </ListGroup>
  </CollapsablePanel>
}