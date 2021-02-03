import React from 'react';
import { Col, Dropdown, DropdownButton, Container, Form, Card } from 'react-bootstrap';
import { validParameterName } from '../../../libs/events';
import { OSDLiveEvent } from '../../../reducers/shared';
import { EditableText, TextPopup } from '../../ui';
import { EventEditPaneProps } from '../EventEditPane';
import { Group } from '../Pane';
import { SubPanel } from './SubPanel';

function TypeSelector(props: {
  id: string;
  template: boolean;
  updateEvent: (event: Partial<OSDLiveEvent>) => void;
}): JSX.Element {
  return <Col>
    <DropdownButton
      variant="secondary"
      title={props.template ? "Template" : "Event"}
    >
      <Dropdown.Item key={0} onClick={(): void => props.updateEvent({
        template: false
      })}>Event</Dropdown.Item>
      <Dropdown.Item key={1} onClick={(): void => props.updateEvent({
        template: true
      })}>Template</Dropdown.Item>
    </DropdownButton>
  </Col>
}

export function MetadataPanel(props: Pick<EventEditPaneProps, "event" |
"updateEvent" |
"upsertParameter" |
"removeParameter"
>): JSX.Element {
  const parameters = props.event.parameters
  return <SubPanel title="Metadata" icon="description">
    <Container className="mt-3 mb-3">
      <Group>
        <Form.Label column lg={4}>Name</Form.Label>
        <EditableText
          value={props.event.name}
          update={(v): void =>
            props.updateEvent({
              name: v
            })
          }
        />
      </Group>
      <Group>
        <Form.Label column lg={4}>Type</Form.Label>
        <TypeSelector
          id={props.event.id}
          template={props.event.template || false}
          updateEvent={props.updateEvent}
        />
      </Group>
      { parameters !== undefined ? Object.entries(parameters).map(([key, value]) =>
        <Group key={key}>
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
        </Group>
      ) : null }
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
  </SubPanel>
}