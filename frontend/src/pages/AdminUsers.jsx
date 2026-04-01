import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', isActive: true });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
      } catch (error) {
        alert('Failed to fetch users. Make sure you are an admin.');
      }
    };
    fetchUsers();
  }, [user, navigate]);

  const handleEdit = (u) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, role: u.role, isActive: u.isActive });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/api/admin/users/${editingUser._id}`, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.map(u => u._id === editingUser._id ? response.data : u));
      setEditingUser(null);
    } catch (error) {
      alert('Failed to update user.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axiosInstance.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      alert('Failed to delete user.');
    }
  };

  const handleToggleActive = async (u) => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/users/${u._id}`,
        { isActive: !u.isActive },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUsers(users.map(existing => existing._id === u._id ? response.data : existing));
    } catch (error) {
      alert('Failed to update user status.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">User Management</h1>

      {/* Edit form */}
      {editingUser && (
        <form onSubmit={handleUpdate} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm">
              Update
            </button>
            <button type="button" onClick={() => setEditingUser(null)}
              className="border border-gray-300 text-gray-600 px-5 py-2 rounded hover:bg-gray-50 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {users.length === 0 ? (
          <p className="text-gray-400 p-6">No users found.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-green-50 text-green-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-sm text-green-600 border border-green-600 rounded px-3 py-1 hover:bg-green-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-sm text-red-500 border border-red-400 rounded px-3 py-1 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;