import React from 'react';
import { ListGroup } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';

function ComponentSelectorListItem(props: {
  active: boolean;
  onClick: () => void;
  name: string;
}) {
  return <ListGroup.Item active={props.active} action={true} className="d-flex justify-content-between align-items-center" onClick={props.onClick}>
    {props.name}
  </ListGroup.Item>
}


export function ComponentSelectorList(props: {
  components: OSDComponent[];
  onClick: (id: string) => void;
  activeIds: string[];
}): JSX.Element {
  return <ListGroup variant="flush">
  {props.components.map((component) => {
    return <ComponentSelectorListItem
      key={component.id}
      name={component.name}
      onClick={(): void =>
        props.onClick(component.id)
      }
      active={props.activeIds.includes(component.id)}
    />
  })}
  </ListGroup>
}