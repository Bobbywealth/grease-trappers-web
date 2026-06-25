import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Truck, User as UserIcon,
  CheckCircle, Play, X as XIcon, AlertCircle, FileText,
  Camera, Edit2
} from 'lucide-react';
import { apiGet, apiPut } from '../lib/api';

const STATUSES = [
  { value: 'scheduled', label: 'Scheduled', icon: Calendar, color: 'yellow' },
  { value: 'in_progress', label: 'In Progress', icon: Play, color: 'blue' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'green' },
  { value: 'cancelled', label: 'Cancelled', icon: XIcon, color: 'red' },
];

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [wasteVolume, setWasteVolume] = useState('');

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet(`/api/jobs/${id}`);
      setJob(data);
      setCompletionNotes(data.completion_notes || '');
      setWasteVolume(data.waste_volume_gallons || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const payload = { status: newStatus };
      if (newStatus === 'completed') {
        payload.completion_notes = completionNotes;
        payload.waste_volume_gallons = wasteVolume ? parseFloat(wasteVolume) : null;
        payload.completed_at = new Date().toISOString();
      }
      await apiPut(`/api/jobs/${id}`, payload);
      await load();
    } catch (e) {
      alert('Update failed: ' + e.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !job) {
    return (
      <div className="p-8 text-center text-gray-400">
        {loading ? 'Loading...' : 'Job not found'}
      </div>
    );
  }

  const currentStatus = STATUSES.find(s => s.value === job.status) || STATUSES[0];

  return (
    <div className="p-6 lg:p-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {job.business_name || `Job #${job.id}`}
            </h1>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              {job.service_type || 'pump'} · priority: {job.priority || 'normal'}
            </p>
          </div>
          <span className={`badge badge-${currentStatus.color} flex items-center gap-1`}>
            <currentStatus.icon className="w-3 h-3" />
            {currentStatus.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">{job.business_name}</div>
              {job.address && <div className="text-gray-600">{job.address}</div>}
              <div className="text-gray-600">{[job.city, job.state].filter(Boolean).join(', ')}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="font-medium">{job.scheduled_date || 'Unscheduled'}</div>
              {job.scheduled_time && <div className="text-xs text-gray-500">{job.scheduled_time}</div>}
            </div>
          </div>
          {job.assigned_name && (
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{job.assigned_name}</span>
            </div>
          )}
          {job.vehicle_label && (
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{job.vehicle_label}</span>
            </div>
          )}
        </div>

        {job.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Job Notes</div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
          </div>
        )}
      </div>

      {/* Status actions */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Status Actions</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateStatus(s.value)}
              disabled={updating || job.status === s.value}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                job.status === s.value
                  ? `bg-${s.color}-100 text-${s.color}-700 border border-${s.color}-300`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {job.status === 'in_progress' || job.status === 'completed' ? (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Completion Details</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Waste Volume (gallons)</label>
              <input
                type="number"
                step="0.1"
                value={wasteVolume}
                onChange={(e) => setWasteVolume(e.target.value)}
                className="input max-w-xs"
                placeholder="e.g. 250"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Completion Notes</label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={3}
                className="input"
                placeholder="Disposal site, special notes..."
              />
            </div>
            {job.status !== 'completed' && (
              <button
                onClick={() => updateStatus('completed')}
                disabled={updating}
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Save & Mark Complete
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Photos */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-gray-400" />
            Photos
          </h2>
          <button className="btn-secondary text-sm">Upload Photo</button>
        </div>
        {job.photos?.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {job.photos.map(p => (
              <a key={p.id} href={p.photo_url} target="_blank" rel="noopener" className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={p.photo_url} alt={p.caption || ''} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            No photos uploaded yet.
          </div>
        )}
      </div>

      {/* Signature */}
      {job.signature && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Customer Signature</h2>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 inline-block">
            <img src={job.signature.signature_data} alt={`Signature by ${job.signature.signer_name}`} className="max-h-24" />
            <div className="text-xs text-gray-500 mt-1">Signed by {job.signature.signer_name}</div>
          </div>
        </div>
      )}
    </div>
  );
}