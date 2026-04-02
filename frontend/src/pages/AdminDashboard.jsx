import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Users, Bell, Activity, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUserCount(response.data.length);
      } catch {
        console.error('Failed to fetch admin stats.');
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">Total Users</p>
            <Users className="text-white/80" size={20} />
          </div>
          <p className="text-4xl font-bold">{userCount}</p>
          <p className="text-sm text-white/70 mt-2">Registered accounts</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">System Health</p>
            <Activity className="text-[#2E7D32]" size={20} />
          </div>
          <p className="text-4xl font-bold text-[#2E7D32]">98%</p>
          <p className="text-sm text-gray-500 mt-2">All systems operational</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">Adherence Rate</p>
            <CheckCircle2 className="text-[#2E7D32]" size={20} />
          </div>
          <p className="text-4xl font-bold text-[#2E7D32]">87%</p>
          <p className="text-sm text-gray-500 mt-2">Platform average</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">Active Reminders</p>
            <Bell className="text-[#2E7D32]" size={20} />
          </div>
          <p className="text-4xl font-bold text-[#2E7D32]">—</p>
          <p className="text-sm text-gray-500 mt-2">Across all users</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;