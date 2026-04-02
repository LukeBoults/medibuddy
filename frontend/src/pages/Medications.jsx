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
      {/* keep the rest of your JSX exactly as it is */}
    </div>
  );
};

export default Medications;