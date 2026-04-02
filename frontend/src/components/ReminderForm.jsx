import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ReminderForm = ({ reminders, setReminders, medications, editingReminder, setEditingReminder }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    medicationId: '',
    scheduledTime: '',
    frequencyType: 'daily',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    if (editingReminder) {
      setForm({
        medicationId: editingReminder.medicationId?._id || editingReminder.medicationId || '',
        scheduledTime: editingReminder.scheduledTime || '',
        frequencyType: editingReminder.frequencyType || 'daily',
        endDate: editingReminder.endDate?.slice(0, 10) || '',
        notes: editingReminder.notes || '',
      });
    } else {
      setForm({ medicationId: '', scheduledTime: '', frequencyType: 'daily', endDate: '', notes: '' });
    }
  }, [editingReminder]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${user.token}` };
    try {
      if (editingReminder) {
        const response = await axiosInstance.put(`/reminders/${editingReminder._id}`, form, { headers });
        setReminders(reminders.map(r => r._id === editingReminder._id ? response.data : r));
        setEditingReminder(null);
      } else {
        const response = await axiosInstance.post('/reminders', form, { headers });
        setReminders([...reminders, response.data]);
      }
      setForm({ medicationId: '', scheduledTime: '', frequencyType: 'daily', endDate: '', notes: '' });
    } catch (error) {
      alert('Failed to save reminder.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select name="medicationId" value={form.medicationId} onChange={handleChange} required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="">Select medication</option>
          {medications.map(med => (
            <option key={med._id} value={med._id}>{med.name} — {med.dosage}</option>
          ))}
        </select>
        <input name="scheduledTime" type="time" value={form.scheduledTime} onChange={handleChange} required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <select name="frequencyType" value={form.frequencyType} onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </select>
        <input name="endDate" type="date" value={form.endDate} onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 md:col-span-2" />
      </div>
      <div className="flex gap-3 mt-4">
        <button type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm">
          {editingReminder ? 'Update' : 'Add Reminder'}
        </button>
        {editingReminder && (
          <button type="button" onClick={() => setEditingReminder(null)}
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded hover:bg-gray-50 text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReminderForm;