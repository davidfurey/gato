import React, { Component, ReactNode } from 'react';
import { Card, Nav, Button, Tab } from 'react-bootstrap'

interface TabbedPanelProps {
  children: ReactNode;
  defaultActiveKey?: string;
  onSelect?: (key: string) => void;
  activeKey?: string;
  variant?: "pills" | "tabs";
  size?: "sm";
  className?: string;
}

interface TabContainerProps {
  name: string;
  eventKey: string;
  closeTab?: () => void;
}

export class TabContainer extends Component<TabContainerProps> {
  render(): JSX.Element {
    return <Tab.Pane eventKey={this.props.eventKey}>{this.props.children}</Tab.Pane>
  }
}

function isTabContainer(node: React.ReactNode): node is TabContainer {
  const tabContainer = node as TabContainer
  return tabContainer !== null &&
    tabContainer.props !== undefined &&
    tabContainer.props.name !== undefined &&
    tabContainer.props.eventKey !== undefined
}

export function TabbedPanel(props: TabbedPanelProps): JSX.Element {
  const firstTab = React.Children.toArray(props.children).filter(isTabContainer)[0]
  const defaultActiveKey = props.defaultActiveKey || ( firstTab ? firstTab.props.eventKey : "")

  const onSelect = props.onSelect
  const safeOnSelect = onSelect ?
    ((eventKey: string | null) => eventKey ? onSelect(eventKey) : null) : undefined

  return <Tab.Container
    id="left-tabs-example"
    activeKey={props.activeKey}
    defaultActiveKey={defaultActiveKey}
    transition={false}
    onSelect={safeOnSelect}
  >
    <Card className={props.className === undefined ? "mb-3" : props.className}>
      <Card.Header className={props.size === "sm" ? "px-3 py-2 bg-primary" : ""}>
        { props.variant === "pills" ?
        <Nav variant={props.variant || "tabs"} className="text-center justify-content-center">
        { React.Children.map(props.children, (child) =>
          isTabContainer(child) ?
            <Nav.Item className="d-flex justify-content-center">
              <Nav.Link eventKey={child.props.eventKey} bsPrefix="custom-nav-link" className={"btn btn-primary px-1 d-flex justify-content-center" + (props.size === "sm" ? " btn-sm" : "")}>
                {child.props.name}
                {child.props.closeTab ? <Button onClick={child.props.closeTab} className="close mr-n3 ml-3" aria-label="Close"><span aria-hidden="true">&times;</span></Button> : null}
              </Nav.Link>
            </Nav.Item> : null
        )}
        </Nav> :
        <Nav variant={props.variant || "tabs"} className="text-center">
        { React.Children.map(props.children, (child) =>
          isTabContainer(child) ?
            <Nav.Item className="d-flex justify-content-between align-items-center">
              <Nav.Link eventKey={child.props.eventKey} className="d-flex justify-content-between align-items-center">
                {child.props.name}
                {child.props.closeTab ? <Button onClick={child.props.closeTab} className="close mr-n3 ml-3" aria-label="Close"><span aria-hidden="true">&times;</span></Button> : null}
              </Nav.Link>
            </Nav.Item> : null
        )}
        </Nav>
        }
      </Card.Header>
      <Tab.Content>{props.children}</Tab.Content>
    </Card>
  </Tab.Container>
}