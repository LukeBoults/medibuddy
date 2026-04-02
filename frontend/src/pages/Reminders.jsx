import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import ReminderForm from '../components/ReminderForm';
import { Bell, BellOff, Clock, Calendar, List, Plus } from 'lucide-react';

const Reminders = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);
  const [view, setView] = useState('list');
  const [showForm, setShowForm] = useState(false);

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
      } catch {
        alert('Failed to fetch reminders.');
      }
    };

    if (user?.token) fetchData();
  }, [user, location.key]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;

    try {
      await axiosInstance.delete(`/reminders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch {
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
      setReminders((prev) =>
        prev.map((r) => (r._id === reminder._id ? response.data : r))
      );
    } catch {
      alert('Failed to update reminder.');
    }
  };

  const activeCount = reminders.filter((r) => r.isActive).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reminders</h1>
          <p className="text-gray-600">Manage your medication reminder schedule</p>
        </div>
        <button
          onClick={() => {
            setEditingReminder(null);
            setShowForm(!showForm);
          }}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Close Form' : 'Add Reminder'}
        </button>
      </div>

      {showForm && (
        <ReminderForm
          reminders={reminders}
          setReminders={setReminders}
          medications={medications}
          editingReminder={editingReminder}
          setEditingReminder={(r) => {
            setEditingReminder(r);
            if (!r) setShowForm(false);
          }}
        />
      )}

      <div className="flex bg-gray-100 rounded-lg p-1 max-w-xs mb-6">
        <button
          onClick={() => setView('list')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List size={16} /> List
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar size={16} /> Calendar
        </button>
      </div>

      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center py-12">No reminders set up yet.</p>
          ) : reminders.map((reminder) => (
            <div
              key={reminder._id}
              className={`bg-white rounded-xl border-2 shadow-sm p-5 ${
                reminder.isActive ? 'border-[#2E7D32]' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {reminder.medicationId?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">{reminder.frequencyType}</p>
                </div>
                {reminder.isActive ? (
                  <Bell className="text-[#2E7D32]" size={20} />
                ) : (
                  <BellOff className="text-gray-400" size={20} />
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-gray-500" />
                <span className="text-lg font-semibold text-[#2E7D32]">{reminder.scheduledTime}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">{reminder.isActive ? 'Active' : 'Inactive'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(reminder)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      reminder.isActive ? 'bg-[#2E7D32]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        reminder.isActive ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setEditingReminder(reminder);
                      setShowForm(true);
                    }}
                    className="text-xs text-[#2E7D32] border border-[#2E7D32] rounded px-2 py-1 hover:bg-green-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="text-xs text-red-500 border border-red-300 rounded px-2 py-1 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Weekly Reminder Schedule</h2>
          <p className="text-sm text-gray-500 mb-4">Your active reminders this week</p>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const date = new Date();
              date.setDate(date.getDate() - date.getDay() + i + 1);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={day}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    isToday ? 'bg-green-50 border-[#2E7D32]' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center ${
                        isToday ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="text-xs font-medium">{day}</span>
                      <span className="text-xl font-bold">{date.getDate()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="text-[#2E7D32]" size={18} />
                    <span className="font-semibold text-[#2E7D32]">{activeCount} reminders</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Active Reminders</p>
          <p className="text-4xl font-bold text-[#2E7D32] mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Reminders</p>
          <p className="text-4xl font-bold text-[#2E7D32] mt-1">{reminders.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="text-4xl font-bold text-gray-400 mt-1">{reminders.length - activeCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Reminders;