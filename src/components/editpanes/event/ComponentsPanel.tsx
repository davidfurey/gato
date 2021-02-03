import React from 'react';
import { Card } from 'react-bootstrap';
import { OSDComponent } from '../../../OSDComponent';
import { ComponentPicker } from '../../ComponentPicker';
import { DraggableComponentList } from '../../DraggableComponentList';
import { EventEditPaneProps } from '../EventEditPane';
import { SubPanel } from './SubPanel';
import { v4 as uuid } from 'uuid';
import { EditPaneType } from '../../../types/editpane';

export function ComponentsPanel(props: Pick<EventEditPaneProps, "event" |
  "removeComponent" |
  "moveComponent" |
  "components" |
  "openTab" |
  "newComponent" |
  "addComponent"
>): JSX.Element {
  const missingComponent: OSDComponent = {
    id: "",
    name: "Missing component",
    type: "missing",
    shared: false
  }
  return <SubPanel title="Components" icon="widgets">
    <DraggableComponentList
      components={props.event.components.map((cId) =>
        props.components[cId] || { ...missingComponent, id: cId })
      }
      removeComponent={props.removeComponent}
      deleteComponent={props.removeComponent} // if the component is not shared, this will delete it
      openTab={props.openTab}
      moveComponent={props.moveComponent}
    />
    <Card.Footer className="p-2">
      <ComponentPicker
        components={
          Object.values(props.components).filter((c) =>
            c.shared && !props.event.components.includes(c.id)
          )
        }
        existingComponents={(componentIds): void =>
          componentIds.forEach((componentId => props.addComponent(componentId)))
        }
        newComponent={(name: string, type: string): void => {
          const componentId = uuid()
          props.newComponent(componentId, name, type)
          props.addComponent(componentId)
          props.openTab({
            type: EditPaneType.Component,
            id: componentId,
          })
        }
        }
      />
    </Card.Footer>
  </SubPanel>
}