import { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';

const initialMedications = [
  { id: 1, name: 'Aspirin', genericName: 'Acetylsalicylic Acid', category: 'Pain Relief', commonDosages: '81mg, 100mg, 325mg', usageCount: 142 },
  { id: 2, name: 'Metformin', genericName: 'Metformin Hydrochloride', category: 'Diabetes', commonDosages: '500mg, 850mg, 1000mg', usageCount: 98 },
  { id: 3, name: 'Lisinopril', genericName: 'Lisinopril', category: 'Blood Pressure', commonDosages: '5mg, 10mg, 20mg, 40mg', usageCount: 87 },
  { id: 4, name: 'Atorvastatin', genericName: 'Atorvastatin Calcium', category: 'Cholesterol', commonDosages: '10mg, 20mg, 40mg, 80mg', usageCount: 76 },
];

const emptyForm = { name: '', genericName: '', category: '', commonDosages: '' };

const MedicationCatalogue = () => {
  const [catalogue, setCatalogue] = useState(initialMedications);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(
    () => catalogue.filter((med) =>
      [med.name, med.genericName, med.category].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [catalogue, searchTerm]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setCatalogue((current) => [
      ...current,
      { id: Date.now(), ...form, usageCount: 0 },
    ]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication Catalogue</h1>
          <p className="text-gray-600">Manage the master medication database</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus size={20} /> {showForm ? 'Close Form' : 'Add Medication'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
            <input value={form.genericName} onChange={(e) => setForm({ ...form, genericName: e.target.value })} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Common Dosages</label>
            <input value={form.commonDosages} onChange={(e) => setForm({ ...form, commonDosages: e.target.value })} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-5 py-2 rounded-lg font-medium transition-colors">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by brand, generic name, or category..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-green-50 text-green-800 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Generic</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Dosages</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No catalogue entries found.</td></tr>
            ) : filtered.map((med) => (
              <tr key={med.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{med.name}</td>
                <td className="px-4 py-3 text-gray-600">{med.genericName}</td>
                <td className="px-4 py-3 text-gray-600">{med.category}</td>
                <td className="px-4 py-3 text-gray-600">{med.commonDosages}</td>
                <td className="px-4 py-3 text-gray-600">{med.usageCount}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setCatalogue((current) => current.filter((item) => item.id !== med.id))} className="text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-2 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicationCatalogue;
