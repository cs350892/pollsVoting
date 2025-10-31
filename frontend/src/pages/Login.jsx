import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'user' })
      });
      alert('Registered! Now login.');
      setIsRegister(false);
    } else {
      await login(form.email, form.password);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 50 }}>
      <div className="card">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 10 }}>
          <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#1877f2' }}>
            {isRegister ? 'Already have account? Login' : 'Need account? Register'}
          </button>
        </p>
      </div>
    </div>
  );
}