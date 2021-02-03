import React from 'react';
import { Card } from 'react-bootstrap';
import { OSDComponent, OSDComponents } from '../../../OSDComponent';
import { ComponentPicker } from '../../ComponentPicker';
import { DraggableComponentList } from '../../DraggableComponentList';
import { ComponentActions } from '../EventEditPane';
import { SubPanel } from './SubPanel';
import { v4 as uuid } from 'uuid';
import { EditPane, EditPaneType } from '../../../types/editpane';
import { OSDLiveEvent } from '../../../reducers/shared';

export function ComponentsPanel(props: ComponentActions & {
  event: OSDLiveEvent;
  components: OSDComponents;
  openTab: (pane: EditPane) => void;
}): JSX.Element {
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
      removeComponent={props.remove}
      // if the component is not shared, this will delete it (todo: check this)
      deleteComponent={props.remove}
      openTab={props.openTab}
      moveComponent={props.move}
    />
    <Card.Footer className="p-2">
      <ComponentPicker
        components={
          Object.values(props.components).filter((c) =>
            c.shared && !props.event.components.includes(c.id)
          )
        }
        existingComponents={(componentIds): void =>
          componentIds.forEach((componentId => props.add(componentId)))
        }
        newComponent={(name: string, type: string): void => {
          const componentId = uuid()
          props.new(componentId, name, type)
          props.add(componentId)
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