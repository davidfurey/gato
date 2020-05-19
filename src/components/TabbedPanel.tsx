import React, { Component, ReactNode } from 'react';
import { Card, Nav, Tab } from 'react-bootstrap'

interface TabbedPanelProps {
  children: ReactNode;
  defaultActiveKey?: string;
}

export class TabContainer extends Component<{ name: string; eventKey: string }> {
  render(): JSX.Element {
    console.log(this.props)
    return <Tab.Pane eventKey={this.props.eventKey}>{this.props.children}</Tab.Pane>
  }
}

function isTabContainer(node: React.ReactNode): node is TabContainer {
  const tabContainer = node as TabContainer
  return tabContainer.props !== undefined && 
    tabContainer.props.name !== undefined && 
    tabContainer.props.eventKey !== undefined
}

export function TabbedPanel(props: TabbedPanelProps): JSX.Element {
  const firstTab = React.Children.toArray(props.children).filter(isTabContainer)[0]
  const defaultActiveKey = props.defaultActiveKey || firstTab.props.eventKey

  return <Tab.Container id="left-tabs-example" defaultActiveKey={defaultActiveKey} transition={false}>
    <Card style={{ width: '20rem' }} className="mb-3">
      <Card.Header>
      <Nav variant="tabs">
      { React.Children.map(props.children, (child) =>
        isTabContainer(child) ? 
          <Nav.Item>
            <Nav.Link eventKey={child.props.eventKey}>{child.props.name}</Nav.Link>
          </Nav.Item> : null
      )}
      </Nav>
      </Card.Header>
      <Tab.Content>{props.children}</Tab.Content>
    </Card>
  </Tab.Container>
}