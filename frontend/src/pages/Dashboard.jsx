import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [doseLogs, setDoseLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [medsRes, remindersRes, logsRes] = await Promise.all([
          axiosInstance.get('/api/medications', { headers }),
          axiosInstance.get('/api/reminders', { headers }),
          axiosInstance.get('/api/dose-logs', { headers }),
        ]);
        setMedications(medsRes.data);
        setReminders(remindersRes.data);
        setDoseLogs(logsRes.data);
      } catch (error) {
        alert('Failed to fetch dashboard data.');
      }
    };
    fetchData();
  }, [user]);

  const takenToday = doseLogs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.takenAt).toDateString() === today && log.status === 'taken';
  }).length;

  const activeReminders = reminders.filter(r => r.isActive).length;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Good morning, {user?.name} 👋
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Medications</p>
          <p className="text-3xl font-bold text-green-700">{medications.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-sm text-gray-500">Doses Taken Today</p>
          <p className="text-3xl font-bold text-green-700">{takenToday}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Reminders</p>
          <p className="text-3xl font-bold text-green-700">{activeReminders}</p>
        </div>
      </div>

      {/* Today's Reminders */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Today's Reminders</h2>
        {reminders.length === 0 ? (
          <p className="text-gray-400">No reminders scheduled.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {reminders.filter(r => r.isActive).map(reminder => (
              <li key={reminder._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    {reminder.medicationId?.name || 'Unknown Medication'}
                  </p>
                  <p className="text-sm text-gray-500">{reminder.scheduledTime} · {reminder.frequencyType}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Active
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;