import { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar bg="success" variant="danger" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Fitness Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user.id && <Nav.Link as={Link} to="/workouts">My Workouts</Nav.Link>}
          </Nav>
          <Nav>
            {user.id ? (
              <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}