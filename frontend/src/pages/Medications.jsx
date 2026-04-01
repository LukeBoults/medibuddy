import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import MedicationForm from '../components/MedicationForm';

const Medications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [editingMedication, setEditingMedication] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axiosInstance.get('/api/medications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMedications(response.data);
      } catch (error) {
        alert('Failed to fetch medications.');
      }
    };
    fetchMedications();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) return;
    try {
      await axiosInstance.delete(`/api/medications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMedications(medications.filter(m => m._id !== id));
    } catch (error) {
      alert('Failed to delete medication.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">My Medications</h1>
      </div>

      <MedicationForm
        medications={medications}
        setMedications={setMedications}
        editingMedication={editingMedication}
        setEditingMedication={setEditingMedication}
      />

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
        {medications.length === 0 ? (
          <p className="text-gray-400 p-6">No medications added yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-green-50 text-green-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Dosage</th>
                <th className="px-4 py-3">Form</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medications.map(med => (
                <tr key={med._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{med.name}</td>
                  <td className="px-4 py-3 text-gray-600">{med.dosage}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{med.form}</td>
                  <td className="px-4 py-3 text-gray-600">{med.frequency}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(med.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setEditingMedication(med)}
                      className="text-sm text-green-600 border border-green-600 rounded px-3 py-1 hover:bg-green-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(med._id)}
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

export default Medications;