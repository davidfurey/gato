import React from 'react';
import * as EditPane from '../../types/editpane';
import { OSDLiveEvent } from '../../reducers/shared';
import { OSDComponent } from '../../OSDComponent';
import { Container, Card, Form, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { DraggableComponentList } from '../DraggableComponentList'
import { SlotList } from '../SlotList';
import { ComponentPicker } from '../ComponentPicker';
import { v4 as uuid } from 'uuid';
import { EditableText, TextPopup, Icon, IconBadge } from '../ui';
import { validParameterName } from '../../libs/events';
import './EventEditPane.css'

export interface EventEditPaneProps {
  pane: EditPane.EventEditPane;
  event: OSDLiveEvent;
  openTab: (pane: EditPane.EditPane) => void;
  removeComponent: (eventId: string, componentId: string) => void;
  addComponent: (eventId: string, componentId: string) => void;
  newComponent: (componentId: string, name: string, type: string) => void;
  updateEvent: (id: string, event: Partial<OSDLiveEvent>) => void;
  setComponent: (eventId: string, listName: string, index: number, id: string) => void;
  moveComponent: (
    eventId: string,
    componentId: string,
    sourcePosition: number,
    destinationPosition: number
  ) => void;
  moveListComponent: (
    eventId: string,
    listName: string,
    componentId: string | null,
    sourcePosition: number,
    destinationPosition: number
  ) => void;
  removeListComponent: (
    eventId: string,
    listName: string,
    index: number,
    componentId: string | null,
  ) => void;
  addListComponent: (
    eventId: string,
    listName: string,
    index: number,
    componentId: string | null
  ) => void;
  upsertParameter: (id: string, name: string, value: string) => void;
  removeParameter: (id: string, name: string) => void;
  components: { [key: string]: OSDComponent };
}

function PaneIcon(props: { type: string }): JSX.Element {
  return <IconBadge
    variant="dark"
    className="py-2 mr-2 ml-n2"
    style={{ width: "1.7rem", height: "1.7rem" }}
    icon={props.type}
    raised
  />
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
  const parameters = props.event.parameters
  return <Container className="mt-3 mb-3 event-edit-pane">
    <Card style={{ width: "30rem" }} className="mb-3">
      <Card.Header><PaneIcon type="description" /> Metadata</Card.Header>
      <Container className="mt-3 mb-3">
      <Form.Group>
        <Form.Group as={Row}>
          <Form.Label column lg={4}>Name</Form.Label>
          <EditableText value={props.event.name} update={(v): void =>
            props.updateEvent(props.event.id, {
              name: v
            })
          } />
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column lg={4}>Type</Form.Label>
          <Col>
          <DropdownButton
            variant="secondary"
            title={props.event.template ? "Template" : "Event"}
          >
            <Dropdown.Item key={0} onClick={(): void => props.updateEvent(props.event.id, {
              template: false
            })}>Event</Dropdown.Item>
            <Dropdown.Item key={1} onClick={(): void => props.updateEvent(props.event.id, {
              template: true
            })}>Template</Dropdown.Item>
          </DropdownButton>
          </Col>
        </Form.Group>
        { parameters !== undefined ? Object.entries(parameters).map(([key, value]) =>
          <Form.Group as={Row} key={key}>
            <Form.Label column lg={4}>{key}</Form.Label>
            <EditableText
              value={value}
              update={(v): void =>
                props.upsertParameter(props.event.id, key, v)
              }
              delete={(): void =>
                props.removeParameter(props.event.id, key)
              }
            />
          </Form.Group>
        ) : null }
      </Form.Group>
      </Container>
      <Card.Footer className="p-2">
        <TextPopup
          buttonText="Add parameter"
          buttonIcon="add"
          title="New parameter"
          label="Name"
          actionLabel="Add"
          success={(name: string) => props.upsertParameter(props.event.id, name, "")}
          validation={validParameterName}
          tip="May only contain letters, numbers and underscore"
        />
      </Card.Footer>
    </Card>
    <Card style={{ width: "30rem" }} className="mb-3">
      <Card.Header><PaneIcon type="widgets" /> Components</Card.Header>
      <DraggableComponentList
        components={props.event.components.map((cId) =>
          props.components[cId] || { ...missingComponent, id: cId })
        }
        removeComponent={(componentId: string): void =>
          props.removeComponent(props.event.id, componentId)
        }
        deleteComponent={(componentId: string): void =>
          // if the component is not shared, this will delete it
          props.removeComponent(props.event.id, componentId)
        }
        openTab={props.openTab}
        moveComponent={(componentId, sourcePosition, destinationPosition) => {
          props.moveComponent(props.event.id, componentId, sourcePosition, destinationPosition)
        }}
      />
      <Card.Footer className="p-2">
        <ComponentPicker
          components={
            Object.values(props.components).filter((c) =>
              c.shared && !props.event.components.includes(c.id)
            )
          }
          existingComponents={(componentIds): void =>
            componentIds.forEach((componentId => props.addComponent(props.event.id, componentId)))
          }
          newComponent={(name: string, type: string): void => {
            const componentId = uuid()
            props.newComponent(componentId, name, type)
            props.addComponent(props.event.id, componentId)
            props.openTab({
              type: EditPane.EditPaneType.Component,
              id: componentId,
            })
          }
          }
        />
      </Card.Footer>
    </Card>

    {props.event.lists.map((eList) =>
      <Card style={{ width: "30rem" }} className="bg-secondary" key={eList.name}>
        <Card.Header><PaneIcon type="list" /> {capitalise(eList.name)} List</Card.Header>
        <SlotList
          components={
            eList.components.map((cId) => {
              const component = cId !== null ? props.components[cId] : null
              return component || null
            })
          }  // todo: should be storing empty list items as null not as "0"
          setComponent={(index: number, id: string): void =>
            props.setComponent(props.event.id, eList.name, index, id)
          }
          availableComponents={eventComponents}
          moveComponent={
            (componentId: string | null, position: number, newPosition: number): void =>
            props.moveListComponent(props.event.id, eList.name, componentId, position, newPosition)
          }
          removeComponent={(id: string | null, index: number): void => {
            props.removeListComponent(props.event.id, eList.name, index, id)
          }}
        />
        <Card.Footer className="p-2">
        <Button onClick={(): void =>
          props.addListComponent(props.event.id, eList.name, eList.components.length, null)}
        >
          <Icon name="add" raised /> Add slot
        </Button>
      </Card.Footer>
      </Card>
    )}
  </Container>
}