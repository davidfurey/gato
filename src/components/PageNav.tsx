import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

export function PageNav(props: { page: string; event?: string }): JSX.Element {
  return <Navbar bg="primary" variant="dark" expand="lg">
    <Navbar.Brand href="manage.html">GATO</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link active={props.page === "manage"} href="manage.html">Manage</Nav.Link>
        <Nav.Link active={props.page === "control"} href="control.html">Control</Nav.Link>
      </Nav>
    { props.event ? <Navbar.Text>Event: { props.event }</Navbar.Text> : null }
    </Navbar.Collapse>
    </Navbar>
}