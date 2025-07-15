import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();

  const loginUser = (loginUserEvent) => {
    loginUserEvent.preventDefault();
    setIsLoading(true);

    fetch('https://fitnessapi-sahirani.onrender.com/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.access) {
        localStorage.setItem('token', data.access);
        getUserDetails(data.access);
        notyf.success('Login successful!');
        navigate('/workouts');
      } else {
        notyf.error(data.message || 'Login failed');
      }
    })
    .catch(err => {
      notyf.error('An error occurred during login');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const getUserDetails = (token) => {
    fetch('https://fitnessapi-sahirani.onrender.com/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(user => {
      setUser({
        id: user._id,
        email: user.email
      });
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Login</h2>
          <Form onSubmit={loginUser}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(changeEvent) => setEmail(changeEvent.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(changeEvent) => setPassword(changeEvent.target.value)}
                required
              />
            </Form.Group>
            <Button variant="danger" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}