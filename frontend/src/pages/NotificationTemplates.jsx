import { useMemo, useState } from 'react';
import { Bell, Mail, MessageSquare, Eye, Pencil } from 'lucide-react';

const initialTemplates = [
  { id: 1, name: 'Reminder - Time to Take Medication', type: 'reminder', channel: 'push', subject: 'Medication Reminder', message: "It's time to take your {{medication_name}} ({{dosage}}). Don't forget!", variables: ['medication_name', 'dosage'] },
  { id: 2, name: 'Missed Dose Alert', type: 'alert', channel: 'push', subject: 'Missed Dose', message: 'You missed your scheduled dose of {{medication_name}} at {{scheduled_time}}.', variables: ['medication_name', 'scheduled_time'] },
  { id: 3, name: 'Refill Reminder', type: 'reminder', channel: 'email', subject: 'Time to Refill Your Medication', message: 'Hello {{user_name}}, your {{medication_name}} prescription is running low.', variables: ['user_name', 'medication_name'] },
  { id: 4, name: 'Weekly Summary', type: 'summary', channel: 'email', subject: 'Your Weekly Medication Summary', message: 'Hi {{user_name}}, this week you took {{doses_taken}} out of {{total_doses}} scheduled doses.', variables: ['user_name', 'doses_taken', 'total_doses'] },
];

const channelIcons = { push: Bell, email: Mail, sms: MessageSquare };
const typeClasses = {
  reminder: 'bg-blue-100 text-blue-700',
  alert: 'bg-red-100 text-red-700',
  summary: 'bg-purple-100 text-purple-700',
  confirmation: 'bg-green-100 text-[#2E7D32]',
};

const NotificationTemplates = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editForm, setEditForm] = useState({ subject: '', message: '' });

  const stats = useMemo(() => ({
    total: templates.length,
    push: templates.filter((t) => t.channel === 'push').length,
    email: templates.filter((t) => t.channel === 'email').length,
  }), [templates]);

  const startEdit = (template) => {
    setEditingTemplate(template);
    setEditForm({ subject: template.subject, message: template.message });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setTemplates((current) => current.map((template) => template.id === editingTemplate.id ? { ...template, ...editForm } : template));
    setEditingTemplate(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Templates</h1>
        <p className="text-gray-600">Manage notification messages sent to users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"><p className="text-sm text-gray-500">Total Templates</p><p className="text-4xl font-bold text-[#2E7D32] mt-1">{stats.total}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"><p className="text-sm text-gray-500">Push Notifications</p><p className="text-4xl font-bold text-[#2E7D32] mt-1">{stats.push}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"><p className="text-sm text-gray-500">Email Templates</p><p className="text-4xl font-bold text-[#2E7D32] mt-1">{stats.email}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"><p className="text-sm text-gray-500">Active Templates</p><p className="text-4xl font-bold text-[#2E7D32] mt-1">{stats.total}</p></div>
      </div>

      <div className="space-y-4">
        {templates.map((template) => {
          const ChannelIcon = channelIcons[template.channel] || Bell;
          return (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${typeClasses[template.type] || 'bg-gray-100 text-gray-700'}`}>{template.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <ChannelIcon size={16} />
                    <span className="capitalize">{template.channel}</span>
                  </div>
                  <p className="text-sm text-gray-700"><span className="font-medium">Subject:</span> {template.subject}</p>
                  <p className="text-sm text-gray-600 mt-2">{template.message}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {template.variables.map((variable) => (
                      <span key={variable} className="inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{`{{${variable}}}`}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPreviewTemplate(template)} className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors"><Eye size={16} /> Preview</button>
                  <button onClick={() => startEdit(template)} className="border border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors"><Pencil size={16} /> Edit</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Template Preview</h2>
            <p className="text-sm text-gray-500 mb-4">{previewTemplate.name}</p>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="font-medium text-gray-900 mb-2">{previewTemplate.subject}</p>
              <p className="text-sm text-gray-700">{previewTemplate.message}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setPreviewTemplate(null)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {editingTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={saveEdit} className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Edit Template</h2>
            <p className="text-sm text-gray-500 mb-4">{editingTemplate.name}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="5" value={editForm.message} onChange={(e) => setEditForm({ ...editForm, message: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setEditingTemplate(null)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-lg transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NotificationTemplates;
