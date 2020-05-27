import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

export function PageNav(props: { page: string }): JSX.Element {
  return <Navbar bg="primary" variant="dark" expand="lg">
    <Navbar.Brand href="manage.html">On screen graphics</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link active={props.page === "manage"} href="manage.html">Manage</Nav.Link>
        <Nav.Link active={props.page === "control"} href="control.html">Control</Nav.Link>
      </Nav>
    { props.page === "control" ?
    <Navbar.Text>
      7th Sunday of Easter
    </Navbar.Text> : null
    }
    </Navbar.Collapse>
    </Navbar>
}