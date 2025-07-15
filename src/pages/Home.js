import { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to Fitness Tracker</h1>
      <p className="lead">
        Track your workouts and monitor your progress over time
      </p>
      {user.id ? (
        <Button as={Link} to="/workouts" variant="success" size="lg">
          View Your Workouts
        </Button>
      ) : (
        <div>
          <Button as={Link} to="/login" variant="danger" size="lg" className="me-3">
            Login
          </Button>
          <Button as={Link} to="/register" variant="danger" size="lg">
            Register
          </Button>
        </div>
      )}
    </Container>
  );
}