import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditWorkoutModal({ show, handleClose, workout, fetchWorkouts }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const notyf = new Notyf();


  useEffect(() => {
    if (workout) {
      setName(workout.name || '');
      setDuration(workout.duration || '');
    }
  }, [workout]);

  const updateWorkout = (updateWorkoutEvent) => {
    updateWorkoutEvent.preventDefault();
    setIsLoading(true);

    fetch(`https://fitnessapi-sahirani.onrender.com/updateWorkout/${workout._id}`, {
      method: 'PATCH',
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
      if (data.message === 'Workout updated successfully' || data.updatedWorkout) {
        notyf.success('Workout updated successfully!');
        fetchWorkouts();
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to update workout');
      }
    })
    .catch(err => {
      console.error('Update error:', err);
      notyf.error('An error occurred while updating workout');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleModalClose = () => {
    setName('');
    setDuration('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateWorkout}>
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
            {isLoading ? 'Updating...' : 'Update Workout'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}