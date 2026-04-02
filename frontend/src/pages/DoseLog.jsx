import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  taken: 'bg-green-100 text-green-700',
  skipped: 'bg-red-100 text-red-600',
  snoozed: 'bg-gray-100 text-gray-500',
};

const DoseLog = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [logs, setLogs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    reminderId: '',
    medicationId: '',
    status: 'taken',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [logsRes, remindersRes] = await Promise.all([
          axiosInstance.get('/dose-logs', { headers }),
          axiosInstance.get('/reminders', { headers }),
        ]);
        setLogs(logsRes.data);
        setReminders(remindersRes.data);
      } catch {
        alert('Failed to fetch dose logs.');
      }
    };

    if (user?.token) fetchData();
  }, [user, location.key]);

  const handleReminderChange = (e) => {
    const reminder = reminders.find((r) => r._id === e.target.value);
    setForm({
      ...form,
      reminderId: e.target.value,
      medicationId: reminder?.medicationId?._id || reminder?.medicationId || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/dose-logs', form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLogs([response.data, ...logs]);
      setForm({
        reminderId: '',
        medicationId: '',
        status: 'taken',
        notes: '',
      });
    } catch {
      alert('Failed to log dose.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Dose Log</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Log a Dose</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="reminderId"
            value={form.reminderId}
            onChange={handleReminderChange}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select reminder</option>
            {reminders.map((r) => (
              <option key={r._id} value={r._id}>
                {r.medicationId?.name || 'Unknown'} — {r.scheduledTime}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="taken">Taken</option>
            <option value="skipped">Skipped</option>
            <option value="snoozed">Snoozed</option>
          </select>

          <input
            name="notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes (optional)"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 md:col-span-2"
          />
        </div>

        <button type="submit" className="mt-4 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm">
          Log Dose
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-green-50 text-green-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Medication</th>
              <th className="px-4 py-3">Scheduled Time</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-gray-400">
                  No dose logs yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{log.medicationId?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-600">{log.reminderId?.scheduledTime || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(log.takenAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyles[log.status]}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{log.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoseLog;