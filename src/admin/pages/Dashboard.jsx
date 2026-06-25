import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, DollarSign, AlertTriangle, Clock,
  CheckCircle, Truck, Activity, ChevronRight, MapPin
} from 'lucide-react';
import { apiGet } from '../lib/api';

function StatCard({ icon: Icon, label, value, accent = 'pink', sub, loading }) {
  const colors = {
    pink: 'bg-brand-cream text-brand-copper',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors[accent]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {loading ? <span className="text-gray-300">···</span> : value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    apiGet('/api/dashboard/stats')
      .then((data) => {
        setStats(data);
        setRecent(data.recent_jobs || []);
      })
      .catch((e) => console.error('Dashboard load failed:', e))
      .finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals || {};
  const jobsByStatus = stats?.jobs_by_status || [];
  const activeJobs = jobsByStatus.find(s => s.status === 'in_progress')?.count || 0;
  const scheduledJobs = jobsByStatus.find(s => s.status === 'scheduled')?.count || 0;
  const completedJobs = jobsByStatus.find(s => s.status === 'completed')?.count || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={totals.customers || 0}
          accent="blue"
          loading={loading}
        />
        <StatCard
          icon={Briefcase}
          label="Jobs Today"
          value={totals.jobs_scheduled_today || 0}
          sub={`${activeJobs} in progress`}
          accent="pink"
          loading={loading}
        />
        <StatCard
          icon={DollarSign}
          label="Revenue This Month"
          value={`$${parseFloat(totals.revenue_this_month || 0).toLocaleString()}`}
          accent="green"
          loading={loading}
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue Invoices"
          value={totals.overdue_invoices || 0}
          accent="red"
          loading={loading}
        />
      </div>

      {/* Second row: active crews + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Active crews */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Active Now
            </h3>
            <Link to="/live-ops" className="text-xs text-brand-copper hover:underline flex items-center gap-1">
              Live Map <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-2">
              <Clock className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? '...' : (totals.employees_active_now || 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {(totals.employees_active_now || 0) === 1 ? 'employee clocked in' : 'employees clocked in'}
            </div>
          </div>
        </div>

        {/* Job pipeline */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Pipeline</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" /> Scheduled
              </span>
              <span className="font-semibold">{scheduledJobs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> In Progress
              </span>
              <span className="font-semibold text-blue-600">{activeJobs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Completed
              </span>
              <span className="font-semibold text-green-600">{completedJobs}</span>
            </div>
          </div>
        </div>

        {/* Traps + contracts */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Coverage</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-2xl font-bold text-blue-700">{totals.traps || 0}</div>
                <div className="text-xs text-blue-600">Traps under service</div>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-cream rounded-lg">
              <div>
                <div className="text-2xl font-bold text-brand-copper">{totals.active_contracts || 0}</div>
                <div className="text-xs text-brand-sienna">Active contracts</div>
              </div>
              <Briefcase className="w-8 h-8 text-brand-bronze" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent jobs */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Jobs</h3>
          <Link to="/jobs" className="text-sm text-brand-copper hover:underline flex items-center gap-1">
            View all jobs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No jobs yet. Create your first job.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.slice(0, 8).map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  job.status === 'completed' ? 'bg-green-50 text-green-600' :
                  job.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                  job.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {job.customer_name || `Job #${job.id}`}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.scheduled_date || 'Unscheduled'}
                    </span>
                    {job.scheduled_time && <span>{job.scheduled_time}</span>}
                  </div>
                </div>
                <span className={`badge ${
                  job.status === 'completed' ? 'badge-green' :
                  job.status === 'in_progress' ? 'badge-blue' :
                  job.status === 'cancelled' ? 'badge-red' :
                  'badge-yellow'
                }`}>
                  {job.status?.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}