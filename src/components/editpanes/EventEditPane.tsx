import React from 'react';
import * as EditPane from '../../types/editpane';
import { OSDLiveEvent } from '../../reducers/shared';
import { OSDComponent } from '../../OSDComponent';
import { Container, Card, Badge, Form, Row, Button } from 'react-bootstrap';
import { ComponentList } from '../ComponentList';
import { ComponentPicker } from '../ComponentPicker';
import { uuid } from 'uuidv4';
import { EditableText } from '../EditableText';

export interface EventEditPaneProps {
  pane: EditPane.EventEditPane;
  event: OSDLiveEvent;
  openTab: (pane: EditPane.EditPane) => void;
  removeComponent: (eventId: string, componentId: string) => void;
  addComponent: (eventId: string, componentId: string) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
  updateEvent: (id: string, event: Partial<OSDLiveEvent>) => void;
  setComponent: (eventId: string, listName: string, index: number, id: string) => void;
  swapComponent: (
    eventId: string,
    listName: string,
    componentId: string,
    sourcePosition: number,
    destinationPosition: number
    ) => void;
  removeListComponent: (
    eventId: string,
    listName: string,
    index: number,
    componentId: string
  ) => void;
  addListComponent: (
    eventId: string,
    listName: string,
    index: number,
    componentId: string | null
  ) => void;
  components: { [key: string]: OSDComponent };
}

function PaneIcon(props: { type: string }): JSX.Element {
  return <Badge variant="dark" className="py-2 mr-2 ml-n2" style={{ width: "1.7rem", height: "1.7rem" }}>
    <span className="material-icons material-icons-raised">{props.type}</span>
  </Badge>
}

function capitalise(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

export function EventEditPane(props: EventEditPaneProps): JSX.Element {
  const eventComponents = props.event.components.flatMap((id) => props.components[id] || [])
  const missingComponent: OSDComponent = {
    id: "",
    name: "Missing component",
    type: "missing",
    shared: false
  }
  return <Container className="mt-3 mb-3">
    <Card style={{ width: "30rem" }} className="mb-3">
      <Card.Header><PaneIcon type="description" /> Metadata</Card.Header>
      <Container className="mt-3 mb-3">
      <Form.Group>
        <Form.Group as={Row}>
          <Form.Label column lg={2}>Name</Form.Label>
          <EditableText value={props.event.name} update={(v): void =>
            props.updateEvent({
              ...props.event,
              name: v
            })
          } />
        </Form.Group>
      </Form.Group>
      </Container>
    </Card>
    <Card style={{ width: "30rem" }} className="mb-3">
      <Card.Header><PaneIcon type="widgets" /> Components</Card.Header>
      <ComponentList
        components={props.event.components.map((cId) => props.components[cId] || { ...missingComponent, id: cId })}
        removeComponent={(componentId: string): void =>
          props.removeComponent(props.event.id, componentId)
        }
        deleteComponent={(componentId: string): void =>
          // if the component is not shared, this will delete it
          props.removeComponent(props.event.id, componentId)
        }
        openTab={props.openTab}
        removeOrDelete={(component): boolean => component ? component.shared : true}
      />
      <Card.Footer className="p-2">
        <ComponentPicker
          components={
            Object.values(props.components).filter((c) =>
              c.shared && !props.event.components.includes(c.id)
            )
          }
          existingComponent={(componentId): void => props.addComponent(props.event.id, componentId)}
          newComponent={(name: string, type: string): void => {
            const componentId = uuid()
            props.newComponent(componentId, name, type)
            props.addComponent(props.event.id, componentId)
// todo: opening tab doesn't work because it is fairly sync whereas create goes via server
// props.openTab({
//   type: EditPanelReducer.EditPaneType.Component,
//   id: componentId,
// })
          }
          }
        />
      </Card.Footer>
    </Card>

    {props.event.lists.map((eList) =>
      <Card style={{ width: "30rem" }} className="bg-secondary" key={eList.name}>
        <Card.Header><PaneIcon type="list" /> {capitalise(eList.name)} List</Card.Header>
        <ComponentList
          components={
            eList.components.map(
              (cId) => cId !== null && props.components[cId] ? props.components[cId] : null
            )
          }  // todo: should be storing empty list items as null not as "0"
          setComponent={(index: number, id: string): void =>
            props.setComponent(props.event.id, eList.name, index, id)
          }
          availableComponents={eventComponents}
          swap={(componentId: string, position: number, newPosition: number): void =>
            props.swapComponent(props.event.id, eList.name, componentId, position, newPosition)
          }
          removeComponent={(id: string, index: number): void => {
            props.removeListComponent(props.event.id, eList.name, index, id)
          }}
        />
        <Card.Footer className="p-2">
        <Button onClick={(): void =>
          props.addListComponent(props.event.id, eList.name, eList.components.length, null)}
        >
          <span className="material-icons material-icons-raised">add</span> Add slot
        </Button>
      </Card.Footer>
      </Card>
    )}
  </Container>
}