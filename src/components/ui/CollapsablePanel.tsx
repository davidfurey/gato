import React, { Component } from 'react';
import { Card, Collapse } from 'react-bootstrap'
import { Icon } from './Icon'

interface CollapsablePanelProps {
  header: React.ReactNode;
  open?: boolean;
  children: React.ReactElement;
}

interface CollapsablePanelState {
  open: boolean;
}

export class CollapsablePanel extends Component<CollapsablePanelProps, CollapsablePanelState> {

  constructor(props: CollapsablePanelProps) {
    super(props);
    this.state = {
      open: typeof props.open !== 'undefined' ? props.open : true
    }
  }

  toggleOpen = (): void => {
    this.setState({ open: !this.state.open })
  }

  render(): JSX.Element {
    return (
      <Card className="mb-3">
        <Card.Header onClick={this.toggleOpen} className="d-flex justify-content-between align-items-center">
        { this.props.header }
          <Icon name={this.state.open ? "expand_less" : "expand_more" } large />
        </Card.Header>
        <Collapse in={this.state.open}>{this.props.children}</Collapse>
      </Card>
    )
  }
}