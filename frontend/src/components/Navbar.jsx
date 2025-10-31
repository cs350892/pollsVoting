import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <Link to="/">PollApp</Link>
      <div>
        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={logout} className="btn-secondary">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}