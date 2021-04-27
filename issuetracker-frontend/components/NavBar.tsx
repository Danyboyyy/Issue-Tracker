import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

export const NavBar: React.FC = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  });

  let body = null;

  if (fetching) {
    
  }
  else if (!data?.me) {
    body = (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav>
            <Link href="/login" passHref>
              <Nav.Link>Login</Nav.Link>
            </Link>
            <Link href="/register" passHref>
              <Nav.Link>Register</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </>
    )
  }
  else {
    body = (
      <Nav className="ml-auto">
        <Navbar.Text >
          Signed in as: <a>{data.me.username}</a>
        </Navbar.Text>
        <Button onClick={() => { logout();} } variant="outline-dark" className="ml-3">Logout</Button>
      </Nav>
    )
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Issue-Tracker</Navbar.Brand>
      {body}
    </Navbar>
  )
}


export default NavBar;
