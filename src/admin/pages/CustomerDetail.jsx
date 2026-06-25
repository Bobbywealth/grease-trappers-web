import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Briefcase, FileText, Plus, Edit2, Trash2, X, AlertCircle, Droplet } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api';

const emptyTrap = {
  customer_id: null,
  location_label: '',
  size_gallons: '',
  service_frequency_days: 90,
  last_pumped_at: '',
  install_date: '',
  notes: '',
};

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrapModal, setShowTrapModal] = useState(false);
  const [editingTrap, setEditingTrap] = useState(null);
  const [trapForm, setTrapForm] = useState(emptyTrap);
  const [trapError, setTrapError] = useState('');
  const [trapSaving, setTrapSaving] = useState(false);
  const [deleteTrapId, setDeleteTrapId] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet(`/api/customers/${id}`);
      setCustomer(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openCreateTrap = () => {
    setEditingTrap(null);
    setTrapForm({ ...emptyTrap, customer_id: parseInt(id, 10) });
    setTrapError('');
    setShowTrapModal(true);
  };

  const openEditTrap = (t) => {
    setEditingTrap(t);
    setTrapForm({
      ...emptyTrap,
      ...t,
      size_gallons: t.size_gallons || '',
      last_pumped_at: t.last_pumped_at || '',
      install_date: t.install_date || '',
    });
    setTrapError('');
    setShowTrapModal(true);
  };

  const handleSaveTrap = async () => {
    setTrapSaving(true);
    setTrapError('');
    try {
      const payload = {
        ...trapForm,
        customer_id: parseInt(id, 10),
        size_gallons: trapForm.size_gallons ? parseInt(trapForm.size_gallons, 10) : null,
      };
      if (editingTrap) {
        await apiPut(`/api/traps/${editingTrap.id}`, payload);
      } else {
        await apiPost('/api/traps', payload);
      }
      setShowTrapModal(false);
      load();
    } catch (e) {
      setTrapError(e.message);
    } finally {
      setTrapSaving(false);
    }
  };

  const handleDeleteTrap = async () => {
    try {
      await apiDelete(`/api/traps/${deleteTrapId}`);
      setDeleteTrapId(null);
      load();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  if (loading || !customer) {
    return (
      <div className="p-8 text-center text-gray-400">
        {loading ? 'Loading...' : 'Customer not found'}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <Link to="/customers" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.business_name}</h1>
            {customer.contact_name && (
              <p className="text-gray-500 mt-1">{customer.contact_name}</p>
            )}
          </div>
          <span className={`badge ${customer.is_active ? 'badge-green' : 'badge-gray'}`}>
            {customer.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {(customer.address || customer.city) && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                {customer.address && <div>{customer.address}</div>}
                <div>{[customer.city, customer.state, customer.zip].filter(Boolean).join(', ')}</div>
              </div>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${customer.phone}`} className="hover:text-brand-copper">{customer.phone}</a>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${customer.email}`} className="hover:text-brand-copper truncate">{customer.email}</a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>Terms: <span className="font-medium">{customer.payment_terms?.replace('_', ' ').replace('net', 'Net ')}</span></span>
          </div>
        </div>

        {customer.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Notes</div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
          </div>
        )}
      </div>

      {/* Traps */}
      <div className="card mb-6">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-900">Grease Traps</h2>
            <p className="text-xs text-gray-500 mt-0.5">{customer.traps?.length || 0} installed</p>
          </div>
          <button onClick={openCreateTrap} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Trap
          </button>
        </div>

        {!customer.traps || customer.traps.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Droplet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No traps registered for this customer.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {customer.traps.map((t) => (
              <div key={t.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-cream text-brand-copper flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{t.location_label || 'Trap'}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                    {t.size_gallons && <span>{t.size_gallons} gal</span>}
                    <span>Service every {t.service_frequency_days || 90} days</span>
                    {t.last_pumped_at && <span>Last: {t.last_pumped_at}</span>}
                  </div>
                </div>
                <button onClick={() => openEditTrap(t)} className="p-1.5 text-gray-400 hover:text-brand-copper hover:bg-brand-cream rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTrapId(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent jobs */}
      <div className="card mb-6">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            Recent Jobs
          </h2>
          <Link to="/jobs" className="text-sm text-brand-copper hover:underline">View all jobs</Link>
        </div>
        {!customer.recent_jobs || customer.recent_jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No jobs yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {customer.recent_jobs.slice(0, 10).map((j) => (
              <Link key={j.id} to={`/jobs/${j.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                <div className="text-sm font-medium text-gray-900 w-24 flex-shrink-0">
                  {j.scheduled_date || 'Unscheduled'}
                </div>
                <div className="flex-1 text-sm text-gray-600">{j.service_type || 'pump'}</div>
                <span className={`badge ${
                  j.status === 'completed' ? 'badge-green' :
                  j.status === 'in_progress' ? 'badge-blue' :
                  j.status === 'cancelled' ? 'badge-red' :
                  'badge-yellow'
                }`}>{j.status?.replace('_', ' ')}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Invoices
          </h2>
        </div>
        {!customer.invoices || customer.invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No invoices yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {customer.invoices.slice(0, 10).map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 p-4">
                <div className="text-sm font-medium text-gray-900 w-32 flex-shrink-0">{inv.invoice_number}</div>
                <div className="flex-1 text-sm text-gray-600">${parseFloat(inv.total).toLocaleString()}</div>
                <div className="text-xs text-gray-500 w-24">{inv.issue_date}</div>
                <span className={`badge ${
                  inv.status === 'paid' ? 'badge-green' :
                  inv.status === 'sent' ? 'badge-blue' :
                  inv.status === 'overdue' ? 'badge-red' :
                  inv.status === 'voided' ? 'badge-gray' :
                  'badge-yellow'
                }`}>{inv.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trap Modal */}
      {showTrapModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTrap ? 'Edit Trap' : 'New Trap'}
              </h2>
              <button onClick={() => setShowTrapModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {trapError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{trapError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location Label</label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen, Side lot, Roof"
                  value={trapForm.location_label}
                  onChange={(e) => setTrapForm({ ...trapForm, location_label: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Size (gallons)</label>
                  <input
                    type="number"
                    value={trapForm.size_gallons}
                    onChange={(e) => setTrapForm({ ...trapForm, size_gallons: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Service Every</label>
                  <select
                    value={trapForm.service_frequency_days}
                    onChange={(e) => setTrapForm({ ...trapForm, service_frequency_days: parseInt(e.target.value, 10) })}
                    className="input"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Install Date</label>
                  <input
                    type="date"
                    value={trapForm.install_date}
                    onChange={(e) => setTrapForm({ ...trapForm, install_date: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Pumped</label>
                  <input
                    type="date"
                    value={trapForm.last_pumped_at}
                    onChange={(e) => setTrapForm({ ...trapForm, last_pumped_at: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={trapForm.notes}
                  onChange={(e) => setTrapForm({ ...trapForm, notes: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowTrapModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSaveTrap} disabled={trapSaving} className="btn-primary">
                {trapSaving ? 'Saving...' : (editingTrap ? 'Update Trap' : 'Add Trap')}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTrapId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Trap?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">This trap and its history will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTrapId(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDeleteTrap} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}