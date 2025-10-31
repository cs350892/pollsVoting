import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ResultsChart from '../components/ResultsChart';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [form, setForm] = useState({ question: '', options: '', closingAt: '' });
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const future = new Date();
    future.setHours(future.getHours() + 1);
    const iso = future.toISOString().slice(0, 16);
    setForm(prev => ({ ...prev, closingAt: iso }));
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadPolls();
    }
  }, [user]);

  const loadPolls = () => {
    API.get('/polls/admin').then(res => setPolls(res.data));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const closingDate = new Date(form.closingAt);
    const now = new Date();
    if (closingDate <= now) return alert('Closing time must be in the future!');
    const opts = form.options.split('\n').map(s => s.trim()).filter(Boolean);
    if (opts.length < 2) return alert('Minimum 2 options required');
    try {
      await API.post('/polls', { question: form.question, options: opts, closingAt: form.closingAt });
      setForm({ question: '', options: '', closingAt: form.closingAt });
      alert('Poll created!');
      loadPolls();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Try again'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete poll?')) {
      await API.delete(`/polls/${id}`);
      loadPolls();
      if (selectedPoll?._id === id) {
        setSelectedPoll(null);
        setResults(null);
      }
    }
  };

  const handleClose = async (id) => {
    await API.patch(`/polls/${id}/close`);
    loadPolls();
  };

  const viewResults = async (poll) => {
    try {
      const res = await API.get(`/polls/${poll._id}/results`);
      setSelectedPoll(poll);
      setResults(res.data);
    } catch (err) {
      alert('Poll not closed yet!');
    }
  };

  if (user?.role !== 'admin') return <p>Access denied.</p>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 style={{ textAlign: 'center', color: '#1877f2', marginBottom: '1.5rem' }}>
        Admin Dashboard
      </h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Create New Poll</h3>
        <form onSubmit={handleCreate}>
          <input placeholder="Question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required />
          <textarea placeholder="Options (one per line)" value={form.options} onChange={e => setForm({ ...form, options: e.target.value })} rows={4} required />
          <div style={{ margin: '1rem 0' }}>
            <label><strong>Closing Time:</strong></label>
            <input type="datetime-local" value={form.closingAt} onChange={e => setForm({ ...form, closingAt: e.target.value })} required style={{ width: '100%' }} />
            <small style={{ color: '#666' }}>Default: 1 hour from now</small>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Create Poll
          </button>
        </form>
      </div>

      <h2 style={{ color: '#1877f2', marginBottom: '1rem' }}>Your Polls</h2>
      {polls.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No polls created yet.</p>
      ) : (
        <div>
          {polls.map(poll => {
            const now = new Date();
            const isClosed = poll.isClosed || now >= new Date(poll.closingAt);
            return (
              <div key={poll._id} className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{poll.question}</h4>
                  <p><strong>Closes:</strong> {new Date(poll.closingAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> <span style={{ color: isClosed ? 'red' : 'green', fontWeight: 'bold' }}>{isClosed ? 'CLOSED' : 'OPEN'}</span></p>
                </div>
                <div>
                  <button onClick={() => viewResults(poll)} className="btn-primary" style={{ margin: '0.3rem' }}>
                    View Results
                  </button>
                  <button onClick={() => handleClose(poll._id)} disabled={isClosed} className="btn-secondary" style={{ margin: '0.3rem' }}>
                    Close
                  </button>
                  <button onClick={() => handleDelete(poll._id)} className="btn-danger" style={{ margin: '0.3rem' }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {results && selectedPoll && (
        <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
          <h3 style={{ color: '#1877f2', marginBottom: '1rem' }}>
            Results: {selectedPoll.question}
          </h3>
          <ResultsChart data={results.results} />
          <button
            onClick={() => {
              setSelectedPoll(null);
              setResults(null);
            }}
            className="btn-secondary"
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Close Results
          </button>
        </div>
      )}
    </div>
  );
}