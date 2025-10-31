import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (user) {
      Promise.all([
        API.get('/polls/open').catch(() => []),
        API.get('/polls/admin').catch(() => [])
      ]).then(([open, admin]) => {
        const all = [...open.data];
        if (admin.data) all.push(...admin.data);
        const unique = Array.from(new Set(all.map(p => p._id)))
          .map(id => all.find(p => p._id === id));
        setPolls(unique);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '10rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#1877f2' }}>Welcome to PollApp</h1>
        <p style={{ fontSize: '1.5rem', color: '#666', margin: '1.5rem 0' }}>
          Create, vote, and see live results!
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            background: '#1877f2',
            color: 'white',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Login to Vote
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 style={{ textAlign: 'center', color: '#1877f2', marginBottom: '1.5rem' }}>
        Active Polls
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Vote on any open poll below
      </p>

      {polls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#888' }}>No polls available right now.</p>
        </div>
      ) : (
        polls.map(poll => {
          const now = new Date();
          const isClosed = poll.isClosed || now >= new Date(poll.closingAt);
          return (
            <div key={poll._id} className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1877f2' }}>{poll.question}</h3>
              <p><strong>Closes:</strong> {new Date(poll.closingAt).toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span style={{ color: isClosed ? 'red' : 'green', fontWeight: 'bold' }}>
                  {isClosed ? 'CLOSED' : 'OPEN'}
                </span>
              </p>
              <Link
                to={`/poll/${poll._id}`}
                className="btn-primary"
                style={{ display: 'inline-block', marginTop: '0.5rem' }}
              >
                {isClosed ? 'View Results' : 'Vote Now'}
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}