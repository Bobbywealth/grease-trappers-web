import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Truck, X, AlertCircle, Briefcase, Filter } from 'lucide-react';
import { apiGet, apiPost } from '../lib/api';

const emptyJob = {
  customer_id: '',
  trap_id: '',
  vehicle_id: '',
  assigned_to: '',
  scheduled_date: '',
  scheduled_time: '',
  estimated_duration_minutes: 60,
  status: 'scheduled',
  priority: 'normal',
  service_type: 'pump',
  notes: '',
};

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const SERVICE_TYPES = [
  { value: 'pump', label: 'Pump' },
  { value: 'inspect', label: 'Inspect' },
  { value: 'clean', label: 'Clean' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'install', label: 'Install' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyJob);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, [statusFilter]);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const [jobsData, customersData, vehiclesData, usersData] = await Promise.all([
        apiGet(`/api/jobs?${params.toString()}`),
        apiGet('/api/customers'),
        apiGet('/api/vehicles'),
        apiGet('/api/users'),
      ]);
      setJobs(jobsData);
      setCustomers(customersData);
      setVehicles(vehiclesData);
      setUsers(usersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm({
      ...emptyJob,
      scheduled_date: new Date().toISOString().split('T')[0],
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.customer_id) { setError('Select a customer'); return; }
    if (!form.scheduled_date) { setError('Pick a date'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        customer_id: parseInt(form.customer_id, 10),
        trap_id: form.trap_id ? parseInt(form.trap_id, 10) : null,
        vehicle_id: form.vehicle_id ? parseInt(form.vehicle_id, 10) : null,
        assigned_to: form.assigned_to ? parseInt(form.assigned_to, 10) : null,
      };
      await apiPost('/api/jobs', payload);
      setShowModal(false);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id === parseInt(form.customer_id, 10));

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      <div className="card p-4 mb-6 flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No jobs scheduled. Create one.</p>
          <button onClick={openCreate} className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Job
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/jobs/${j.id}`} className="font-medium text-gray-900 hover:text-accent">
                        {j.customer_name || `Customer #${j.customer_id}`}
                      </Link>
                      {j.customer_address && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {j.customer_address}, {j.customer_city}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{j.service_type || 'pump'}</td>
                    <td className="px-4 py-3 text-sm">
                      {j.scheduled_date && (
                        <div className="flex items-center gap-1 text-gray-900">
                          <Calendar className="w-3 h-3" />
                          {j.scheduled_date}
                        </div>
                      )}
                      {j.scheduled_time && <div className="text-xs text-gray-500">{j.scheduled_time}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{j.assigned_name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {j.vehicle_label && (
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {j.vehicle_label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        j.priority === 'urgent' ? 'badge-red' :
                        j.priority === 'high' ? 'badge-yellow' :
                        'badge-gray'
                      }`}>{j.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        j.status === 'completed' ? 'badge-green' :
                        j.status === 'in_progress' ? 'badge-blue' :
                        j.status === 'cancelled' ? 'badge-red' :
                        'badge-yellow'
                      }`}>{j.status?.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">New Job</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Customer *</label>
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value, trap_id: '' })}
                  className="input"
                  required
                >
                  <option value="">Select a customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>

              {selectedCustomer && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trap</label>
                  <select
                    value={form.trap_id}
                    onChange={(e) => setForm({ ...form, trap_id: e.target.value })}
                    className="input"
                  >
                    <option value="">No specific trap</option>
                    {selectedCustomer.traps?.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.location_label || 'Trap'} {t.size_gallons ? `(${t.size_gallons} gal)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    value={form.scheduled_date}
                    onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={form.scheduled_time}
                    onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    value={form.service_type}
                    onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                    className="input"
                  >
                    {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="input"
                  >
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assign to</label>
                  <select
                    value={form.assigned_to}
                    onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                    className="input"
                  >
                    <option value="">Unassigned</option>
                    {users.filter(u => u.is_active).map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle</label>
                  <select
                    value={form.vehicle_id}
                    onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
                    className="input"
                  >
                    <option value="">No vehicle</option>
                    {vehicles.filter(v => v.is_active).map(v => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input"
                  placeholder="Gate code, special instructions, etc."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}