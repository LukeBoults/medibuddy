import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MedicationForm = ({ medications, setMedications, editingMedication, setEditingMedication }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    form: 'tablet',
    frequency: '',
    startDate: '',
    endDate: '',
    prescribingDoctor: '',
    notes: '',
  });

  useEffect(() => {
    if (editingMedication) {
      setForm({
        name: editingMedication.name || '',
        dosage: editingMedication.dosage || '',
        form: editingMedication.form || 'tablet',
        frequency: editingMedication.frequency || '',
        startDate: editingMedication.startDate?.slice(0, 10) || '',
        endDate: editingMedication.endDate?.slice(0, 10) || '',
        prescribingDoctor: editingMedication.prescribingDoctor || '',
        notes: editingMedication.notes || '',
      });
    } else {
      setForm({ name: '', dosage: '', form: 'tablet', frequency: '', startDate: '', endDate: '', prescribingDoctor: '', notes: '' });
    }
  }, [editingMedication]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${user.token}` };
    try {
      if (editingMedication) {
        const response = await axiosInstance.put(`/api/medications/${editingMedication._id}`, form, { headers });
        setMedications(medications.map(m => m._id === editingMedication._id ? response.data : m));
        setEditingMedication(null);
      } else {
        const response = await axiosInstance.post('/api/medications', form, { headers });
        setMedications([...medications, response.data]);
      }
      setForm({ name: '', dosage: '', form: 'tablet', frequency: '', startDate: '', endDate: '', prescribingDoctor: '', notes: '' });
    } catch (error) {
      alert('Failed to save medication.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {editingMedication ? 'Edit Medication' : 'Add Medication'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Drug name" required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input name="dosage" value={form.dosage} onChange={handleChange} placeholder="Dosage (e.g. 500mg)" required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <select name="form" value={form.form} onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="tablet">Tablet</option>
          <option value="liquid">Liquid</option>
          <option value="capsule">Capsule</option>
          <option value="injection">Injection</option>
          <option value="other">Other</option>
        </select>
        <input name="frequency" value={form.frequency} onChange={handleChange} placeholder="Frequency (e.g. twice daily)" required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input name="endDate" type="date" value={form.endDate} onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input name="prescribingDoctor" value={form.prescribingDoctor} onChange={handleChange} placeholder="Prescribing doctor"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
      </div>
      <div className="flex gap-3 mt-4">
        <button type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm">
          {editingMedication ? 'Update' : 'Add Medication'}
        </button>
        {editingMedication && (
          <button type="button" onClick={() => setEditingMedication(null)}
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded hover:bg-gray-50 text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MedicationForm;