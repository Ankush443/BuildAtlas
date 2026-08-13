import { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', location: user?.location || '', website: user?.website || '', github: user?.github || '', linkedin: user?.linkedin || '', skills: user?.skills?.join(', ') || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Update failed'); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label className="block text-sm font-medium mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
        <div><label className="block text-sm font-medium mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field h-24 resize-none" maxLength={500} /></div>
        <div><label className="block text-sm font-medium mb-1">Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" /></div>
        <div><label className="block text-sm font-medium mb-1">Website</label><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="input-field" placeholder="https://..." /></div>
        <div><label className="block text-sm font-medium mb-1">GitHub</label><input value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} className="input-field" placeholder="https://github.com/..." /></div>
        <div><label className="block text-sm font-medium mb-1">LinkedIn</label><input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="input-field" placeholder="https://linkedin.com/in/..." /></div>
        <div><label className="block text-sm font-medium mb-1">Skills (comma-separated)</label><input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Node.js, MongoDB" /></div>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}
