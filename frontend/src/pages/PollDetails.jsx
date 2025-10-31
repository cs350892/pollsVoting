import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ResultsChart from '../components/ResultsChart';

export default function PollDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoll = async () => {
      try {
        const res = await API.get(`/polls/${id}`);
        setPoll(res.data.poll || res.data);
        if (res.data.results) setResults(res.data);
      } catch (err) {
        try {
          const open = await API.get('/polls/open');
          const p = open.data.find(x => x._id === id);
          if (p) setPoll(p);
          else throw new Error();
        } catch {
          alert('Poll not found');
          navigate('/');
        }
      }

      if (user) {
        API.get(`/votes/${id}/voted`).then(r => setVoted(r.data.voted));
      }
      setLoading(false);
    };
    loadPoll();
  }, [id, user, navigate]);

  const handleVote = async () => {
    if (selected === -1) return alert('Please select an option!');
    try {
      await API.post('/votes', { pollId: id, optionIndex: selected });
      setVoted(true);
      loadResults();
    } catch (err) {
      alert('Vote failed: ' + (err.response?.data?.msg || 'Try again'));
    }
  };

  const loadResults = async () => {
    try {
      const res = await API.get(`/polls/${id}/results`);
      setResults(res.data);
    } catch (err) {}
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading poll...</p>;
  if (!poll) return <p>Poll not found.</p>;

  const now = new Date();
  const isClosed = poll.isClosed || now >= new Date(poll.closingAt);
  const canVote = !isClosed && !voted;

  return (
    <div className="container">
      <div className="card">
        <h2>{poll.question}</h2>
        <p><strong>Closes:</strong> {new Date(poll.closingAt).toLocaleString()}</p>
        <p><strong>Status:</strong> <span style={{ color: isClosed ? 'red' : 'green', fontWeight: 'bold' }}>
          {isClosed ? 'CLOSED' : 'OPEN'}
        </span></p>

        {canVote && (
          <div style={{ margin: '1.5rem 0', padding: '1rem', border: '2px solid #1877f2', borderRadius: '8px' }}>
            <h4 style={{ color: '#1877f2' }}>Cast Your Vote:</h4>
            {poll.options.map((opt, i) => (
              <label key={i} style={{ display: 'block', margin: '0.8rem 0', fontSize: '1.1rem' }}>
                <input type="radio" name="vote" onChange={() => setSelected(i)} style={{ marginRight: '0.6rem', transform: 'scale(1.2)' }} />
                {opt}
              </label>
            ))}
            <button onClick={handleVote} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.2rem', marginTop: '1rem' }}>
              Submit Vote
            </button>
          </div>
        )}

        {voted && !isClosed && (
          <p style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', fontSize: '1.3rem', margin: '1rem 0' }}>
            Thank you for voting!
          </p>
        )}

        {isClosed && !results && (
          <button onClick={loadResults} className="btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
            View Results
          </button>
        )}

        {results && (
          <div style={{ marginTop: '2rem' }}>
            <ResultsChart data={results.results} />
          </div>
        )}
      </div>
    </div>
  );
}