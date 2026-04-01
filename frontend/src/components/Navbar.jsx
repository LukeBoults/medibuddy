import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-wide">Medibuddy</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-green-200 transition-colors">Dashboard</Link>
            <Link to="/medications" className="hover:text-green-200 transition-colors">Medications</Link>
            <Link to="/reminders" className="hover:text-green-200 transition-colors">Reminders</Link>
            <Link to="/dose-log" className="hover:text-green-200 transition-colors">Dose Log</Link>
            <Link to="/profile" className="hover:text-green-200 transition-colors">Profile</Link>
            {user?.role === 'admin' && (
            <Link to="/admin/users" className="hover:text-green-200 transition-colors">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100 font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-200 transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100 font-medium transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;