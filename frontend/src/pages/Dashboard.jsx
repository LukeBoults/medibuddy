import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Bell, ClipboardList, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [doseLogs, setDoseLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [medsRes, remindersRes, logsRes] = await Promise.all([
          axiosInstance.get('/medications', { headers }),
          axiosInstance.get('/reminders', { headers }),
          axiosInstance.get('/dose-logs', { headers }),
        ]);
        setMedications(medsRes.data);
        setReminders(remindersRes.data);
        setDoseLogs(logsRes.data);
      } catch {
        console.error('Failed to fetch dashboard data.');
      }
    };
    if (user?.token) fetchData();
  }, [user]);

  const takenToday = doseLogs.filter((log) => {
    const today = new Date().toDateString();
    return new Date(log.takenAt).toDateString() === today && log.status === 'taken';
  }).length;

  const activeReminders = reminders.filter((r) => r.isActive);
  const recentLogs = doseLogs.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's your medication overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate('/user/medications/add')}
          className="h-16 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} /><span>Add Medication</span>
        </button>
        <button
          onClick={() => navigate('/user/reminders')}
          className="h-16 border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors bg-white"
        >
          <Bell size={20} /><span>View Reminders</span>
        </button>
        <button
          onClick={() => navigate('/user/dose-log')}
          className="h-16 border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors bg-white"
        >
          <ClipboardList size={20} /><span>Dose Log</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="text-[#2E7D32]" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Today's Reminders</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Upcoming medication doses for today</p>
          <div className="space-y-3">
            {activeReminders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No reminders for today</p>
            ) : activeReminders.map((reminder) => (
              <div key={reminder._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{reminder.medicationId?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{reminder.scheduledTime} · {reminder.frequencyType}</p>
                </div>
                <Clock className="text-[#2E7D32]" size={20} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="text-[#2E7D32]" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Recent Dose Log</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Your recent medication activity</p>
          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No dose history yet</p>
            ) : recentLogs.map((log) => (
              <div key={log._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{log.medicationId?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{new Date(log.takenAt).toLocaleDateString()}</p>
                </div>
                {log.status === 'taken' ? (
                  <CheckCircle2 className="text-[#2E7D32]" size={20} />
                ) : log.status === 'skipped' ? (
                  <XCircle className="text-red-500" size={20} />
                ) : (
                  <Clock className="text-orange-500" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Active Medications</p>
          <p className="text-4xl font-bold text-[#2E7D32] mt-1">{medications.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Taken Today</p>
          <p className="text-4xl font-bold text-[#2E7D32] mt-1">{takenToday}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Active Reminders</p>
          <p className="text-4xl font-bold text-[#2E7D32] mt-1">{activeReminders.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
