import React, { useState, useEffect } from 'react';
import { Plus, Truck, Edit2, X, AlertCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../lib/api';

const emptyVehicle = { label: '', license_plate: '', capacity_gallons: '' };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyVehicle);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/vehicles');
      setVehicles(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyVehicle); setError(''); setShowModal(true); };
  const openEdit = (v) => { setEditing(v); setForm({ ...v, capacity_gallons: v.capacity_gallons || '' }); setError(''); setShowModal(true); };

  const handleSave = async () => {
    if (!form.label.trim()) { setError('Label required'); return; }
    try {
      const payload = { ...form, capacity_gallons: form.capacity_gallons ? parseInt(form.capacity_gallons, 10) : null };
      if (editing) await apiPut(`/api/vehicles/${editing.id}`, payload);
      else await apiPost('/api/vehicles', payload);
      setShowModal(false); load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">{vehicles.filter(v => v.is_active).length} active trucks</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="card p-12 text-center">
          <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No vehicles yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.label}</h3>
                    {v.license_plate && <p className="text-sm text-gray-500">{v.license_plate}</p>}
                  </div>
                </div>
                <button onClick={() => openEdit(v)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent-light rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {v.capacity_gallons && <div>Capacity: {v.capacity_gallons} gallons</div>}
                <span className={`badge ${v.is_active ? 'badge-green' : 'badge-gray'}`}>{v.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Vehicle' : 'New Vehicle'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Label *</label>
                <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input" placeholder="e.g. Truck 1" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">License Plate</label>
                <input type="text" value={form.license_plate} onChange={(e) => setForm({ ...form, license_plate: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Capacity (gallons)</label>
                <input type="number" value={form.capacity_gallons} onChange={(e) => setForm({ ...form, capacity_gallons: e.target.value })} className="input" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary">{editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}