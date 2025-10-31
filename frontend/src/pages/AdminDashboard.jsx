import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ResultsChart from '../components/ResultsChart';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [form, setForm] = useState({ question: '', options: '', closingAt: '' });

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
      alert('Poll created successfully!');
      loadPolls();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Try again'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this poll?')) {
      await API.delete(`/polls/${id}`);
      loadPolls();
    }
  };

  const handleClose = async (id) => {
    await API.patch(`/polls/${id}/close`);
    loadPolls();
  };

  const viewResults = async (id) => {
    try {
      const res = await API.get(`/polls/${id}/results`);
      alert(`Results: ${JSON.stringify(res.data.results, null, 2)}`);
    } catch (err) {
      alert('Poll not closed yet!');
    }
  };

  if (user?.role !== 'admin') return <p>Access denied.</p>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div className="card">
        <h3>Create New Poll</h3>
        <form onSubmit={handleCreate}>
          <input placeholder="Enter question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required style={{ fontSize: '1.1rem' }} />
          <textarea placeholder="Options (one per line)" value={form.options} onChange={e => setForm({ ...form, options: e.target.value })} rows={4} required style={{ fontSize: '1.1rem' }} />
          <div style={{ margin: '1rem 0' }}>
            <label><strong>Closing Time:</strong></label>
            <input type="datetime-local" value={form.closingAt} onChange={e => setForm({ ...form, closingAt: e.target.value })} required style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem' }} />
            <small style={{ color: '#666' }}>Default: 1 hour from now</small>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.2rem' }}>
            Create Poll
          </button>
        </form>
      </div>

      <h3>Your Polls</h3>
      {polls.length === 0 ? (
        <p>No polls created yet.</p>
      ) : (
        polls.map(poll => {
          const now = new Date();
          const isClosed = poll.isClosed || now >= new Date(poll.closingAt);
          return (
            <div key={poll._id} className="card">
              <h4>{poll.question}</h4>
              <p><strong>Closes:</strong> {new Date(poll.closingAt).toLocaleString()}</p>
              <p><strong>Status:</strong> 
                <span style={{ color: isClosed ? 'red' : 'green', fontWeight: 'bold', marginLeft: '0.5rem' }}>
                  {isClosed ? 'CLOSED' : 'OPEN'}
                </span>
              </p>
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => handleClose(poll._id)} disabled={isClosed} className="btn-secondary">
                  Close Now
                </button>
                <button onClick={() => handleDelete(poll._id)} className="btn-danger">
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}