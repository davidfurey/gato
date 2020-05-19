import React, { Component } from 'react';
import { Display } from '../reducers/shared';
import { Card, Form, Button, Col } from 'react-bootstrap'
import { CollapsablePanel } from './CollapsablePanel';

interface QuickCreatePanelProps {
  show: (title: string, subtitle: string, display: Display) => undefined;
  display: Display;
}

interface QuickCreatePanelState {
  title: string;
  subtitle: string;
}

export class QuickCreatePanel extends Component<QuickCreatePanelProps, QuickCreatePanelState> {

  state = {
    title: "",
    subtitle: ""
  };

  constructor(props: QuickCreatePanelProps) {
    super(props);
  }

  create = (): void => {
    this.props.show(this.state.title, this.state.subtitle, this.props.display)
  }

  titleChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      title: event.target.value
    });
  }

  subtitleChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      subtitle: event.target.value
    });
  }

  render(): JSX.Element {
    return (
      <CollapsablePanel header="Quick create">
        <Card.Body>
        <Form.Row>
          <Form.Label lg={3} column="sm">Title</Form.Label>
          <Col>
          <Form.Control size="sm" type="text" onChange={this.titleChanged} />
          </Col>
        </Form.Row>
        <Form.Row>
          <Form.Label lg={3} column="sm">Subtitle</Form.Label>
          <Col>
          <Form.Control size="sm" type="text" onChange={this.subtitleChanged} />
          </Col>
        </Form.Row> 
        <Button variant="primary" size="sm" type="submit" onClick={this.create}>Show</Button>
        </Card.Body>
      </CollapsablePanel>
    )
  }
}