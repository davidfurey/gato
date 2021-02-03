import React from 'react';
import { OSDComponent } from '../../../OSDComponent';
import { ComponentList } from '../../../reducers/shared';
import { EventEditPaneProps } from '../EventEditPane';
import { SubPanel } from './SubPanel';
import { SlotList } from '../../SlotList';
import { Button, Card } from 'react-bootstrap';
import { Icon } from '../../ui';

function capitalise(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

export function ListPanel(props: {
  list: ComponentList;
  eventComponents: OSDComponent[];
} & Pick<EventEditPaneProps, "components" |
  "event" |
  "listActions"
>): JSX.Element {
  return <SubPanel title={`${capitalise(props.list.name)} List`} icon="list">
      <SlotList
        components={
          props.list.components.map((cId) => {
            const component = cId !== null ? props.components[cId] : null
            return component || null
          })
        }  // todo: should be storing empty list items as null not as "0"
        setComponent={(index: number, id: string): void =>
          props.listActions.set(props.list.name, index, id)
        }
        availableComponents={props.eventComponents}
        moveComponent={
          (componentId: string | null, position: number, newPosition: number): void =>
          props.listActions.move(
            props.list.name,
            componentId,
            position,
            newPosition
          )
        }
        removeComponent={(id: string | null, index: number): void => {
          props.listActions.remove(props.list.name, index, id)
        }}
      />
      <Card.Footer className="p-2">
      <Button onClick={(): void =>
        props.listActions.add(props.list.name, props.list.components.length, null)}
      >
        <Icon name="add" raised /> Add slot
      </Button>
    </Card.Footer>
  </SubPanel>
}