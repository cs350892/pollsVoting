import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function VoteConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    const loadPoll = async () => {
      try {
        const polls = await api.getOpenPolls();
        const pollData = polls.data.find(p => p._id === id);
        setPoll(pollData);
      } catch (err) {
        console.error('Error loading poll:', err);
      }
    };
    loadPoll();
  }, [id]);

  return (
    <div className="card text-center">
      <div className="message success">
        <h2>Thank You for Voting!</h2>
        {poll && <p>Your vote for "{poll.question}" has been recorded.</p>}
      </div>
      
      <div className="mt-2">
        <button onClick={() => navigate('/polls')}>
          Back to Polls
        </button>
        {poll && (
          <button 
            onClick={() => navigate(`/poll/${id}/results`)}
            style={{ marginLeft: '1rem' }}
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
}