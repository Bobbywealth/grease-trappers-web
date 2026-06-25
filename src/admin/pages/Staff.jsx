import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, AlertCircle, User as UserIcon, Mail, Phone, Clock } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../lib/api';

const emptyUser = {
  email: '',
  password: '',
  name: '',
  phone: '',
  role: 'employee',
};

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/users');
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyUser);
    setError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      email: u.email,
      name: u.name,
      phone: u.phone || '',
      role: u.role,
      password: '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.email || !form.name) { setError('Email and name are required'); return; }
    if (!editing && !form.password) { setError('Password is required for new users'); return; }
    if (form.password && form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setSaving(true);
    setError('');
    try {
      if (editing) {
        const payload = { name: form.name, phone: form.phone, role: form.role, email: form.email };
        if (form.password) payload.password = form.password;
        await apiPut(`/api/users/${editing.id}`, payload);
      } else {
        await apiPost('/api/users', form);
      }
      setShowModal(false);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const roleColor = {
    admin: 'badge-pink',
    manager: 'badge-blue',
    employee: 'badge-gray',
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.filter(u => u.is_active).length} active team members
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {loading && users.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">Loading...</div>
      ) : users.length === 0 ? (
        <div className="card p-12 text-center">
          <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No staff yet. Add your first team member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u.id} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {u.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{u.name}</div>
                  <div className="text-sm text-gray-500 truncate">{u.email}</div>
                </div>
                <button
                  onClick={() => openEdit(u)}
                  className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent-light rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className={`badge ${roleColor[u.role] || 'badge-gray'}`}>{u.role}</span>
                  <span className={`badge ${u.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {u.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3 h-3" />
                    <a href={`tel:${u.phone}`} className="hover:text-accent">{u.phone}</a>
                  </div>
                )}
                {u.last_login_at && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Last login: {new Date(u.last_login_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Staff' : 'New Staff'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="input"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password {editing && <span className="text-gray-400">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}