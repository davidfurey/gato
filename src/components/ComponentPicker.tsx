import React, { useState, useRef } from 'react';
import { OSDComponent } from "../OSDComponent";
import { Button, Popover, Overlay, Form, Col, Container, Row, Card } from 'react-bootstrap';
import { ComponentList } from './ComponentList';
import { LowerThirdsType } from './OSDComponents/LowerThirdsComponent';
import { TabbedPanel, TabContainer } from './TabbedPanel'

interface ComponentPickerProps {
  components?: OSDComponent[];
  existingComponent?: (id: string) => void;
  newComponent: (name: string, type: string) => void;
  className?: string;
}

export function LoadComponent(props: { 
  components: OSDComponent[];
  existingComponent: (id: string) => void;
  close: () => void;
}): JSX.Element {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return <div id="page-content-wrapper" style={{height: "15rem", width: "15rem"}} className="p-0 d-flex flex-column overflow-hidden">
    <Container className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
      <Container className="bg-dark flex-fill flex-column d-flex">
        <div className="section-div flex-grow-1 flex-column d-flex">
          <Row className="flex-fill d-flex">
            <Col className="overflow-auto flex-shrink-1 position-relative p-0">
              <div className="position-absolute w-100">
                <ComponentList 
                  components={props.components} 
                  onClick={
                    (id: string, active: boolean): void => 
                      active ? setSelectedComponent(null) : setSelectedComponent(id)
                  }
                  activeId={selectedComponent !== null ? selectedComponent : undefined}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
        <Button 
          size="sm" 
          variant="primary" 
          className="mr-2" 
          disabled={selectedComponent == null}
          onClick={(): void => {
              if (selectedComponent !== null) {
                props.existingComponent(selectedComponent)
                props.close()
              }
            }
          }
        >
          Add
        </Button>
        <Button size="sm" variant="secondary" onClick={props.close}>
          Cancel
        </Button>
      </Card.Footer>
    </Container>
  </div>
}

function CreateComponent(props: { 
  newComponent: (name: string, type: string) => void;
  close: () => void;
}): JSX.Element {
  const [type, setType] = useState(LowerThirdsType);
  const [name, setName] = useState("");

  return <Container style={{height: "15rem", width: "15rem"}} className="container-fluid d-flex flex-column overflow-auto flex-fill p-0">
    <Container className="flex-fill flex-column d-flex bg-dark p-3">
      <Form.Group>
      <Form.Row>
          <Form.Label lg={3} column="sm">Name</Form.Label>
          <Col>
          <Form.Control size="sm" type="text" onChange={(event): void => setName(event.target.value)} />
          </Col>
      </Form.Row>
      <Form.Row>
          <Form.Label lg={3} column="sm">Type</Form.Label>
          <Col>
          <Form.Control as="select" onChange={(event): void => setType(event.target.value)}>
            <option value={LowerThirdsType}>Banner</option>
            <option>Slide</option>
          </Form.Control>
          </Col>
      </Form.Row>
      </Form.Group>
    </Container>
    <Card.Footer className="flex-shrink-1 pt-2 pb-2 text-center">
      <Button 
        size="sm" 
        variant="success" 
        className="mr-2"
        disabled={name === ""}
        onClick={(): void => { props.newComponent(name, type); props.close() }}
      >
        Create
      </Button>
      <Button size="sm" variant="secondary" onClick={props.close}>
        Cancel
      </Button>
    </Card.Footer>
  </Container>
}

function PickerDialog(props: { 
  close: () => void;
  newComponent: (name: string, type: string) => void;
  existingComponent?: (id: string) => void;
  components?: OSDComponent[];
}): JSX.Element {
  if (props.components && props.existingComponent) { 
    return <TabbedPanel className="" variant="pills" size="sm">
      <TabContainer name="Existing" eventKey="existing">  
        <LoadComponent 
          components={props.components} 
          close={props.close} 
          existingComponent={props.existingComponent} 
        /> 
      </TabContainer>
      <TabContainer name="New" eventKey="new">
        <CreateComponent newComponent={props.newComponent} close={props.close} />
      </TabContainer>
    </TabbedPanel>
  } else {
    return <Card>
      <Card.Header className="px-3 py-2 bg-primary text-center">Component</Card.Header>
      <CreateComponent newComponent={props.newComponent} close={props.close} />
    </Card>
  }
}

function popover(
  close: () => void,
  newComponent: (name: string, type: string) => void,
  existingComponent?: (id: string) => void,
  components?: OSDComponent[], 
): JSX.Element {
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <PickerDialog 
      close={close} 
      newComponent={newComponent}
      existingComponent={existingComponent}
      components={components}
    />
  </Popover>
}

export function ComponentPicker(props: ComponentPickerProps): JSX.Element {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const close = (): void => {
    setShow(false)
  }
  const newOnly = props.existingComponent === undefined || props.components === undefined
  return <div>
    <Button ref={target} onClick={(): void => setShow(!show)} className={props.className}>
        <span className="material-icons material-icons-raised">add</span> 
        { newOnly ? "New component" : "Add component" }
    </Button>
    <Overlay placement="right" target={target.current} show={show}>{popover(
      close,
      props.newComponent,
      props.existingComponent,
      props.components
    )}</Overlay>
  </div>
}
