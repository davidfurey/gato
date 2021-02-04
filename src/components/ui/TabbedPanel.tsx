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

function CloseButton(props: { closeTab: () => void }): JSX.Element {
  return <Button
    onClick={props.closeTab}
    className="close mr-n3 ml-3"
    aria-label="Close"
  ><span aria-hidden="true">&times;</span></Button>
}

function NavItem(props: TabContainerProps & { variant: "pills" | "tabs", size?: "sm" }): JSX.Element {
  const style = props.variant === "pills" ? {
    navItemClass: "d-flex justify-content-center",
    navLinkClass: "btn btn-primary px-1 d-flex justify-content-center" + (props.size === "sm" ? " btn-sm" : ""),
    bsPrefix: "custom-nav-link"
  } : {
    navItemClass: "d-flex justify-content-between align-items-center",
    navLinkClass: "d-flex justify-content-between align-items-center",
    bsPrefix: undefined
  }

  return <Nav.Item className={style.navItemClass}>
    <Nav.Link
      eventKey={props.eventKey}
      className={style.navLinkClass}
      bsPrefix={style.bsPrefix}
    >
      {props.name}
      {props.closeTab ? <CloseButton closeTab={props.closeTab} /> : null }
    </Nav.Link>
  </Nav.Item>
}

export function TabbedPanel(props: TabbedPanelProps): JSX.Element {
  const firstTab = React.Children.toArray(props.children).filter(isTabContainer)[0]
  const defaultActiveKey = props.defaultActiveKey || firstTab?.props.eventKey

  const onSelect = props.onSelect
  const safeOnSelect = onSelect ?
    ((eventKey: string | null) => eventKey ? onSelect(eventKey) : null) : undefined

  const variant = props.variant || "tabs"

  const navClass = props.variant === "pills" ?
    "text-center justify-content-center" :
    "text-center"

  return <Tab.Container
    activeKey={props.activeKey}
    defaultActiveKey={defaultActiveKey}
    transition={false}
    onSelect={safeOnSelect}
  >
    <Card className={props.className === undefined ? "mb-3" : props.className}>
      <Card.Header className={props.size === "sm" ? "px-3 py-2 bg-primary" : ""}>
        <Nav variant={variant} className={navClass}>
        { React.Children.map(props.children, (child) =>
          isTabContainer(child) ?
            <NavItem {...child.props} size={props.size} variant={variant} /> :
            null
        )}
        </Nav>
      </Card.Header>
      <Tab.Content>{props.children}</Tab.Content>
    </Card>
  </Tab.Container>
}