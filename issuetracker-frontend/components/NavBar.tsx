import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import Link from 'next/link';

export const NavBar: React.FC = ({}) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Link href="/login" passHref>
            <Nav.Link>Login</Nav.Link>
          </Link>
          <Link href="/register" passHref>
            <Nav.Link>Register</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}


export default NavBar;
