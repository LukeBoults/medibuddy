import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const Medications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axiosInstance.get('/medications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMedications(response.data);
      } catch {
        alert('Failed to fetch medications.');
      }
    };

    if (user?.token) fetchMedications();
  }, [user, location.key]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) return;

    try {
      await axiosInstance.delete(`/medications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMedications((prev) => prev.filter((m) => m._id !== id));
    } catch {
      alert('Failed to delete medication.');
    }
  };

  const filtered = medications.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.prescribingDoctor || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medications</h1>
          <p className="text-gray-600">Manage your medications and prescriptions</p>
        </div>

        <button
          onClick={() => navigate('/user/medications/add')}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} />
          Add Medication
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
            No medications found.
          </div>
        ) : (
          filtered.map((medication) => (
            <div
              key={medication._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{medication.name}</h3>
                  <p className="text-sm text-gray-500">{medication.dosage}</p>
                </div>
              </div>

              <div className="space-y-2 mb-5 text-sm text-gray-600">
                <p><span className="font-medium text-gray-800">Frequency:</span> {medication.frequency}</p>
                <p><span className="font-medium text-gray-800">Doctor:</span> {medication.prescribingDoctor || '—'}</p>
                <p><span className="font-medium text-gray-800">Instructions:</span> {medication.instructions || '—'}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/user/medications/edit/${medication._id}`)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 text-sm"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(medication._id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Medications;