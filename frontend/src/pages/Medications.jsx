import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const Medications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axiosInstance.get('/api/medications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMedications(response.data);
      } catch {
        alert('Failed to fetch medications.');
      }
    };
    if (user?.token) fetchMedications();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) return;
    try {
      await axiosInstance.delete(`/api/medications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMedications(medications.filter((m) => m._id !== id));
    } catch {
      alert('Failed to delete medication.');
    }
  };

  const filtered = medications.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.prescribingDoctor || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Medications</h1>
          <p className="text-gray-600">Manage your medication list</p>
        </div>
        <button
          onClick={() => navigate('/user/medications/add')}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} />Add Medication
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          placeholder="Search medications or doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No medications found</p>
          <button
            onClick={() => navigate('/user/medications/add')}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors mx-auto"
          >
            <Plus size={20} />Add Your First Medication
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((med) => (
            <div key={med._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <h3 className="text-lg font-semibold text-[#2E7D32]">{med.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{med.dosage} — {med.form}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">{med.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{new Date(med.startDate).toLocaleDateString()}</span>
                </div>
                {med.prescribingDoctor && (
                  <div className="flex justify-between text-sm gap-3">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium text-right">{med.prescribingDoctor}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/user/medications/edit/${med._id}`)}
                  className="flex-1 border border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 rounded-lg py-2 flex items-center justify-center gap-1 text-sm transition-colors"
                >
                  <Pencil size={14} />Edit
                </button>
                <button
                  onClick={() => handleDelete(med._id)}
                  className="border border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Medications;
