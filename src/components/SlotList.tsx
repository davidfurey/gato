import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { ListGroup, ButtonGroup } from 'react-bootstrap'
import { OSDComponent } from '../OSDComponent';
import { ComponentDropdown } from './ComponentDropdown'
import { DraggableList, IconButton, IconBadge } from './ui';

function ComponentSlot(
  props: {
    component: OSDComponent | null;
    removeComponent?: () => void;
    setComponent: (id: string) => void;
    components?: OSDComponent[];
    first: boolean;
    last: boolean;
    dragHandleProps?: DraggableProvidedDragHandleProps;
  }
): JSX.Element {
  return <ListGroup.Item className="d-flex justify-content-between align-items-center">
    <div className="d-flex w-100">
      <IconBadge
        {...props.dragHandleProps}
        variant="dark"
        className="py-2 ml-n2 mr-1"
        style={{ width: "1.7rem", height: "1.7rem" }}
        icon="drag_handle"
        raised
      />
      <ComponentDropdown
        selected={props.component || undefined}
        components={props.components || []}
        disabled={false}
        setComponent={props.setComponent}
      />
    </div>
    <ButtonGroup size="sm">
      <IconButton variant="secondary" onClick={props.removeComponent} icon="clear" />
    </ButtonGroup>
  </ListGroup.Item>
}

export function SlotList(props: {
  components: (OSDComponent | null)[];
  availableComponents?: OSDComponent[];
  setComponent: (index: number, id: string) => void;
  removeComponent: (id: string | null, index: number) => void;
  moveComponent: (
    componentId: string | null,
    sourcePosition: number,
    destinationPosition: number
  ) => void;
}): JSX.Element {
  return <DraggableList
    items={props.components.map((item, index) => ({ component: item, id: index.toString() }))}
    move={(s, i, j) => props.moveComponent(s.component?.id || null, i, j)}
  >{(item, index, dragHandleProps) => {
    return <ComponentSlot
      key={item.id}
      setComponent={(id: string): void => props.setComponent(index, id)}
      components={props.availableComponents}
      first={index === 0}
      last={index === (props.components.length - 1)}
      component={item.component}
      removeComponent={
        (): void => props.removeComponent(item.component?.id || null, index)
      }
      dragHandleProps={dragHandleProps}
    />
  }}
  </DraggableList>
}