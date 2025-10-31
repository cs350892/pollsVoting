import { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PollForm from '../components/PollForm';

export default function AdminPolls() {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.getAdminPolls().then(res => setPolls(res.data));

  useEffect(() => { if (user?.role === 'admin') load(); }, [user]);

  const handleCreate = async (data) => {
    await api.createPoll(data);
    load();
  };

  const handleUpdate = async (data) => {
    await api.updatePoll(editing._id, data);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete?')) {
      await api.deletePoll(id);
      load();
    }
  };

  const handleClose = async (id) => {
    await api.closePoll(id);
    load();
  };

  if (user?.role !== 'admin') return <p>Admins only</p>;

  return (
    <div>
      <h2>Admin Polls</h2>
      <div className="card">
        <h3>{editing ? 'Edit Poll' : 'Create Poll'}</h3>
        <PollForm initial={editing || {}} onSubmit={editing ? handleUpdate : handleCreate} />
      </div>

      {polls.map(p => (
        <div key={p._id} className="card">
          <h3>{p.question}</h3>
          <p>Closes: {new Date(p.closingAt).toLocaleString()}</p>
          <button onClick={() => setEditing(p)}>Edit</button>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
          {!p.isClosed && <button onClick={() => handleClose(p._id)}>Close Now</button>}
        </div>
      ))}
    </div>
  );
}