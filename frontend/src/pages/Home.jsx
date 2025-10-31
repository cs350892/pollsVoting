// src/pages/Home.jsx
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (user) {
      // Get ALL polls user can access
      Promise.all([
        API.get('/polls/open').catch(() => []),
        API.get('/polls/admin').catch(() => [])
      ]).then(([open, admin]) => {
        const all = [...open.data];
        if (admin.data) all.push(...admin.data);
        // Remove duplicates
        const unique = Array.from(new Set(all.map(p => p._id)))
          .map(id => all.find(p => p._id === id));
        setPolls(unique);
      });
    }
  }, [user]);

  if (!user) return <div className="container"><Link to="/login">Login to vote</Link></div>;

  return (
    <div className="container">
      <h2>Your Polls</h2>
      {polls.length === 0 ? (
        <p>No polls available.</p>
      ) : (
        polls.map(poll => (
          <div key={poll._id} className="card">
            <h3>{poll.question}</h3>
            <p><strong>Closes:</strong> {new Date(poll.closingAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {poll.isClosed ? 'Closed' : 'Open'}</p>
            <Link to={`/poll/${poll._id}`} className="btn-primary">
              {poll.isClosed ? 'View Results' : 'Vote Now'}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}