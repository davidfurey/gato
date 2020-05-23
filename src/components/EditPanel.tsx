import React, { useState } from 'react';
import { TabbedPanel, TabContainer } from '../components/TabbedPanel';
import { ListGroup, ButtonGroup, Button, ListGroupItem, Form, Row, Col, Container } from 'react-bootstrap';
import * as EditPanelReducer from '../reducers/editpanel';
import { OSDComponent } from '../OSDComponent';
import { isLowerThirdsComponent } from './OSDComponents/LowerThirds';
import { OSDLiveEvent } from '../reducers/shared';
import { ComponentListItem } from './ManageSelectorPanel';

interface EditPanelProps {
  editPanel: EditPanelReducer.EditPanelState;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  openTab: (pane: EditPanelReducer.EditPane) => void;
  components: { [key: string]: OSDComponent };
  events: { [key: string]: OSDLiveEvent };
  updateComponent: <T extends OSDComponent>(component: T) => void;
  removeComponent: (eventId: string, componentId: string) => void;
}

interface ComponentEditPaneProps {
  pane: EditPanelReducer.ComponentEditPane;
  component: OSDComponent;
  updateComponent: <T extends OSDComponent>(component: T) => void;
}

interface EventEditPaneProps {
  pane: EditPanelReducer.EventEditPane;
  event: OSDLiveEvent;
  openTab: (pane: EditPanelReducer.EditPane) => void;
  removeComponent: (eventId: string, componentId: string) => void;
  components: { [key: string]: OSDComponent };
}

export function EditableText(props: { value: string; update: (v: string) => void }): JSX.Element {
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState(props.value);
  
  return edit ? 
    <Col>
      <Form.Control 
        type="text" 
        defaultValue={newValue} 
        onChange={(event): void => setNewValue(event.target.value)} 
      />
      <ButtonGroup size="sm">
        <Button variant="success" onClick={(): void => { props.update(newValue); setEdit(false)}}>
          <span className="material-icons">done</span>
        </Button>
        <Button variant="primary" onClick={(): void => setEdit(false)}>
          <span className="material-icons">clear</span>
        </Button>
      </ButtonGroup>
    </Col> : 
    <Col>
      {props.value} 
      <Button size="sm" variant="info" onClick={(): void => { setNewValue(props.value); setEdit(true)}}>
        <span className="material-icons">create</span>
      </Button>
    </Col>
}

function ComponentEditPane(props: ComponentEditPaneProps): JSX.Element {
  if (isLowerThirdsComponent(props.component)) {
    return <Container className="mt-3 mb-3"><Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Name</Form.Label>
        <EditableText value={props.component.name} update={(v): void => 
          props.updateComponent({
            ...props.component,
            name: v
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Title</Form.Label>
        <EditableText value={props.component.title} update={(v): void => 
          props.updateComponent({
            ...props.component,
            title: v
          })
        } />
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column lg={2}>Subtitle</Form.Label>
        <EditableText value={props.component.subtitle} update={(v): void => 
          props.updateComponent({
            ...props.component,
            subtitle: v
          })
        } />
      </Form.Group>
    </Form.Group></Container>
  } else {
    return <ListGroup>
    <ListGroupItem>Name: { props.component.name }</ListGroupItem>
    <ListGroupItem>Type: { props.component.type }</ListGroupItem>
    <ListGroupItem>Id: { props.component.id }</ListGroupItem>
    { isLowerThirdsComponent(props.component) ? 
      <ListGroupItem>Title: { props.component.title }</ListGroupItem> : null 
    }
    { isLowerThirdsComponent(props.component) ? 
      <ListGroupItem>Subtitle: { props.component.subtitle }</ListGroupItem> : null 
    }
    </ListGroup>
  }
}

function EventEditPane(props: EventEditPaneProps): JSX.Element {
  return <Container className="mt-3 mb-3">
    <h1>{ props.event.name }</h1>
    {/* <h2>{props.event.components}</h2>
    <h2>{props.event.lists}</h2> */}
    <h2>Components</h2>
    <ListGroup>
        {props.event.components.map((componentId) => 
          <ComponentListItem 
            key={componentId} 
            component={props.components[componentId]} 
            removeComponent={(): void => props.removeComponent(props.event.id, componentId)}
            openTab={props.openTab}
          />
        )}
      </ListGroup>
  </Container>
}

export function createPane(
  pane: EditPanelReducer.EditPane, 
  components: { [key: string]: OSDComponent },
  events: { [key: string]: OSDLiveEvent },
  updateComponent: <T extends OSDComponent>(component: T) => void,
  openTab: (pane: EditPanelReducer.EditPane) => void,
  removeComponent: (eventId: string, componentId: string) => void
): JSX.Element {
  const pattern: EditPanelReducer.Pattern<JSX.Element> = {
// eslint-disable-next-line react/display-name
    [EditPanelReducer.EditPaneType.Component]: (pane) =>
      <ComponentEditPane 
        pane={pane} 
        component={components[pane.id]} 
        updateComponent={updateComponent} 
      />,
// eslint-disable-next-line react/display-name
    [EditPanelReducer.EditPaneType.Event]: (pane) =>
      <EventEditPane 
        pane={pane} 
        event={events[pane.id]} 
        components={components} 
        openTab={openTab} 
        removeComponent={removeComponent}
      />
  }
  
  return EditPanelReducer.matcher(pattern)(pane)
}

export function EditPanel(props: EditPanelProps): JSX.Element {
  console.log(props)
  return <TabbedPanel 
      defaultActiveKey={props.editPanel.selected} 
      onSelect={props.selectTab}
      activeKey={props.editPanel.selected}
    >
      {
        props.editPanel.panes.map((pane) => <TabContainer 
          key={pane.id} 
          name={pane.type === "Event" ? props.events[pane.id].name : props.components[pane.id].name}
          eventKey={pane.id}
          closeTab={(): void => props.closeTab(pane.id)}
        >
          { createPane(
              pane, 
              props.components, 
              props.events, 
              props.updateComponent, 
              props.openTab, 
              props.removeComponent
          ) }
        </TabContainer>
        )  
      }
  </TabbedPanel>
}