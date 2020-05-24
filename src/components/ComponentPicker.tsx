import React, { useState, ReactNode, CSSProperties } from 'react';
import { OSDComponent } from "../OSDComponent";
import { Dropdown, FormControl, Button } from 'react-bootstrap';

// todo: component that lets you select an existing shared component or create a new component 
// (including selecting the component type)

interface ComponentPickerProps {
  components: OSDComponent[];
}

type Props = { 
  children: ReactNode;
//  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const CustomToggle = React.forwardRef<HTMLButtonElement & Button, Props>(
  function CustomToggleRef(props: Props, ref) {
  return <Button
    ref={ref}
    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
       e.preventDefault();
      props.onClick(e);
    }}
  >
    {props.children}
    &#x25bc;
  </Button>
});

interface MenuProps { 
  children: ReactNode;
  style?: CSSProperties | undefined;
  className?: string;
  'aria-labelledby'?: string;
}

const CustomMenu = React.forwardRef<HTMLDivElement, MenuProps>(
  function CustomMenuRe(props: MenuProps, ref) {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={props.style}
        className={props.className}
        aria-labelledby={props['aria-labelledby']}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(props.children).filter(
            (child) =>
              !value || 
              (child as React.ReactElement).props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  }
);

export function ComponentPicker(props: ComponentPickerProps): JSX.Element {
  return <Dropdown>
    < .Toggle 
      as={CustomToggle} 
      id="dropdown-custom-components"
    >
      Custom toggle
    </Dropdown.Toggle>
    <Dropdown.Menu as={CustomMenu}>
  {props.components.map((component) => 
    <Dropdown.Item 
      key={component.id} 
    >{component.name}</Dropdown.Item> )}
    </Dropdown.Menu>
  </Dropdown>
}