import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function AddWorkoutModal({ show, handleClose, fetchWorkouts }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const notyf = new Notyf();

  const addWorkout = (addWorkoutEvent) => {
    addWorkoutEvent.preventDefault();
    setIsLoading(true);

    fetch('https://fitnessapi-sahirani.onrender.com/workouts/addWorkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name,
        duration
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        notyf.success('Workout added successfully!');
        fetchWorkouts();
        handleClose();
        setName('');
        setDuration('');
      } else {
        notyf.error('Failed to add workout');
      }
    })
    .catch(err => {
      notyf.error('An error occurred');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addWorkout}>
          <Form.Group className="mb-3">
            <Form.Label>Workout Name</Form.Label>
            <Form.Control 
              type="text" 
              value={name}
              onChange={(changeEvent) => setName(changeEvent.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control 
              type="number" 
              value={duration}
              onChange={(changeEvent) => setDuration(changeEvent.target.value)}
              required
              min="1"
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Workout'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}