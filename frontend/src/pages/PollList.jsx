import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadPolls();
  }, [isAuthenticated, navigate]);

  const loadPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getOpenPolls();
      if (response.data) {
        setPolls(response.data);
      } else {
        setError('No data received from server');
      }
    } catch (err) {
      console.error('Poll loading error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load polls. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadPolls();
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="card text-center">
        <div className="message">
          <h3>Loading polls...</h3>
          <p>Please wait while we fetch the available polls.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <div className="message error">
          <h3>Error Loading Polls</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="mt-2">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center">Available Polls</h2>
      <div className="poll-list">
        {polls.length === 0 ? (
          <div className="card text-center">
            <p>No polls available at the moment.</p>
            <button onClick={handleRetry} className="mt-2">
              Refresh Polls
            </button>
          </div>
        ) : (
          polls.map(poll => (
            <div key={poll._id} className="poll-item">
              <h3>{poll.question}</h3>
              <p>Number of options: {poll.options.length}</p>
              <p className="mt-2">
                Closes at: {new Date(poll.closingAt).toLocaleDateString()}
              </p>
              <button 
                onClick={() => navigate(`/poll/${poll._id}`)}
                className="mt-2"
              >
                View & Vote
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}