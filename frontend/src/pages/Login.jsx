import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { Pill } from 'lucide-react';

const Login = () => {
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    role: 'user',
  });

  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/login', loginData);
      login(response.data);
      navigate(response.data.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/auth/register', registerData);
      alert('Registration successful. Please log in.');
      setTab('login');
      setLoginData({
        email: registerData.email,
        password: registerData.password,
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
        <div className="bg-[#2E7D32] text-white p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Pill size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">MediBuddy</h1>
          <p className="text-green-100">Your health companion</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-600 mb-6">Login or create a new account</p>

          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-2.5 rounded-md font-medium transition-colors"
              >
                Login
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={registerData.dob}
                  onChange={(e) => setRegisterData({ ...registerData, dob: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-2.5 rounded-md font-medium transition-colors"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;