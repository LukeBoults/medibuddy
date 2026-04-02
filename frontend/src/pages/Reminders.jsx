import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import ReminderForm from '../components/ReminderForm';

const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [remindersRes, medsRes] = await Promise.all([
          axiosInstance.get('/reminders', { headers }),
          axiosInstance.get('/medications', { headers }),
        ]);
        setReminders(remindersRes.data);
        setMedications(medsRes.data);
      } catch (error) {
        alert('Failed to fetch reminders.');
      }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await axiosInstance.delete(`/reminders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReminders(reminders.filter(r => r._id !== id));
    } catch (error) {
      alert('Failed to delete reminder.');
    }
  };

  const handleToggle = async (reminder) => {
    try {
      const response = await axiosInstance.put(
        `/reminders/${reminder._id}`,
        { isActive: !reminder.isActive },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReminders(reminders.map(r => r._id === reminder._id ? response.data : r));
    } catch (error) {
      alert('Failed to update reminder.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Reminders</h1>

      <ReminderForm
        reminders={reminders}
        setReminders={setReminders}
        medications={medications}
        editingReminder={editingReminder}
        setEditingReminder={setEditingReminder}
      />

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
        {reminders.length === 0 ? (
          <p className="text-gray-400 p-6">No reminders set up yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-green-50 text-green-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">Medication</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reminders.map(reminder => (
                <tr key={reminder._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {reminder.medicationId?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{reminder.scheduledTime}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{reminder.frequencyType}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(reminder)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        reminder.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {reminder.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setEditingReminder(reminder)}
                      className="text-sm text-green-600 border border-green-600 rounded px-3 py-1 hover:bg-green-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reminder._id)}
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

export default Reminders;