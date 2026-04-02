import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const emptyForm = {
  name: '',
  dosage: '',
  form: 'tablet',
  frequency: '',
  startDate: '',
  endDate: '',
  prescribingDoctor: '',
  notes: '',
};

const AddEditMedication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const fetchMedication = async () => {
      if (!id || !user?.token) return;
      try {
        const response = await axiosInstance.get(`/medications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const med = response.data;
        setForm({
          name: med.name || '',
          dosage: med.dosage || '',
          form: med.form || 'tablet',
          frequency: med.frequency || '',
          startDate: med.startDate?.slice(0, 10) || '',
          endDate: med.endDate?.slice(0, 10) || '',
          prescribingDoctor: med.prescribingDoctor || '',
          notes: med.notes || '',
        });
      } catch {
        alert('Failed to load medication.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedication();
  }, [id, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      if (id) {
        await axiosInstance.put(`/medications/${id}`, form, { headers });
      } else {
        await axiosInstance.post('/medications', form, { headers });
      }
      navigate('/user/medications');
    } catch {
      alert('Failed to save medication.');
    }
  };

  if (loading) {
    return <div className="p-6 max-w-4xl mx-auto text-gray-500">Loading medication...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/user/medications')} className="mb-6 flex items-center gap-2 text-[#2E7D32] hover:underline">
        <ArrowLeft size={18} /> Back to medications
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{id ? 'Edit Medication' : 'Add Medication'}</h1>
        <p className="text-gray-600 mb-6">{id ? 'Update your medication details' : 'Create a new medication entry'}</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
            <input name="dosage" value={form.dosage} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
            <select name="form" value={form.form} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]">
              <option value="tablet">Tablet</option>
              <option value="liquid">Liquid</option>
              <option value="capsule">Capsule</option>
              <option value="injection">Injection</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <input name="frequency" value={form.frequency} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescribing Doctor</label>
            <input name="prescribingDoctor" value={form.prescribingDoctor} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="submit" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-5 py-2 rounded-lg font-medium transition-colors">
              {id ? 'Save Changes' : 'Add Medication'}
            </button>
            <button type="button" onClick={() => navigate('/user/medications')} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditMedication;
