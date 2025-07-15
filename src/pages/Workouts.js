import { useState, useEffect, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';
import WorkoutCard from '../components/WorkoutCard';
import AddWorkoutModal from '../components/AddWorkoutModal';
import EditWorkoutModal from '../components/EditWorkoutModal';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const fetchWorkouts = () => {
    setIsLoading(true);
    fetch('https://fitnessapi-sahirani.onrender.com/getMyWorkouts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.workouts) {
        setWorkouts(data.workouts);
      } else {
        notyf.error('Failed to fetch workouts');
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      notyf.error('An error occurred while fetching workouts');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleEditWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedWorkout(null);
  };

  useEffect(() => {
    if (user.id) {
      fetchWorkouts();
    }
  }, [user.id]);

  if (!user.id) {
    return (
      <Container className="mt-5">
        <h2>Please login to view your workouts</h2>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="mt-5">
        <h2>Loading your workouts...</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Workouts</h2>
        <Button 
          id="addWorkout" 
          variant="success" 
          onClick={() => setShowAddModal(true)}
        >
          Add Workout
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center mt-5">
          <p className="lead">No workouts found. Add your first workout to get started!</p>
        </div>
      ) : (
        workouts.map(workout => (
          <WorkoutCard 
            key={workout._id} 
            workout={workout} 
            fetchWorkouts={fetchWorkouts}
            onEditWorkout={handleEditWorkout}
          />
        ))
      )}

      <AddWorkoutModal 
        show={showAddModal} 
        handleClose={() => setShowAddModal(false)} 
        fetchWorkouts={fetchWorkouts}
      />

      <EditWorkoutModal 
        show={showEditModal} 
        handleClose={handleCloseEditModal} 
        workout={selectedWorkout}
        fetchWorkouts={fetchWorkouts}
      />
    </Container>
  );
}