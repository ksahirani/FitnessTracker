import { Card, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function WorkoutCard({ workout, fetchWorkouts, onEditWorkout }) {
  const notyf = new Notyf();

  const deleteWorkout = () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      fetch(`https://fitnessapi-sahirani.onrender.com/deleteWorkout/${workout._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Delete failed');
        }
      })
      .then(data => {
        if (data.message === 'Workout deleted successfully') {
          notyf.success('Workout deleted successfully!');
          fetchWorkouts();
        } else {
          notyf.error('Failed to delete workout');
        }
      })
      .catch(err => {
        console.error('Delete error:', err);
        notyf.error('An error occurred while deleting workout');
      });
    }
  };

  const completeWorkout = () => {
    fetch(`https://fitnessapi-sahirani.onrender.com/completeWorkoutStatus/${workout._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Complete failed');
      }
    })
    .then(data => {
      if (data.message === 'Workout status updated successfully' || data.updatedWorkout) {
        notyf.success('Workout marked as completed!');
        fetchWorkouts();
      } else {
        notyf.error('Failed to update workout status');
      }
    })
    .catch(err => {
      console.error('Complete error:', err);
      notyf.error('An error occurred while updating workout status');
    });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{workout.name}</Card.Title>
        <Card.Text>
          Duration: {workout.duration} minutes<br />
          Status: <span className={`badge ${workout.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
            {workout.status}
          </span><br />
          Date: {new Date(workout.dateAdded).toLocaleDateString()}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button 
            variant="success" 
            onClick={completeWorkout} 
            disabled={workout.status === 'completed'}
            size="sm"
          >
            {workout.status === 'completed' ? 'Completed' : 'Mark Complete'}
          </Button>
          <Button 
            variant="warning" 
            onClick={() => onEditWorkout(workout)}
            size="sm"
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            onClick={deleteWorkout} 
            size="sm"
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}