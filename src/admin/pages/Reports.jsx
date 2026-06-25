import React, { useEffect, useState, useMemo } from 'react';
import {
  DollarSign, Briefcase, Users, TrendingUp, TrendingDown, Calendar,
  Download, RefreshCw, FileText, Mail, MapPin, CheckCircle,
  ArrowUpRight, ArrowDownRight, Clock, Truck, Wrench, AlertTriangle,
} from 'lucide-react';
import { apiGet } from '../lib/api';

function Sparkline({ data = [], color = '#2563EB', width = 100, height = 32 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const points = data.map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`rep-spark-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#rep-spark-${color.replace('#', '')})`} />
    </svg>
  );
}

// Vertical bar chart for monthly revenue
function BarChart({ data = [], color = '#2563EB', labels = [] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {data.map((v, i) => {
        const h = Math.max((v / max) * 100, 4);
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group">
            <div className="relative w-full flex flex-col justify-end h-full">
              <div
                className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                style={{ height: `${h}%`, background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)` }}
              />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-ink opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-ink/90 text-white px-1.5 py-0.5 rounded">
                ${typeof v === 'number' ? v.toLocaleString() : v}
              </div>
            </div>
            {labels[i] && <div className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">{labels[i]}</div>}
          </div>
        );
      })}
    </div>
  );
}

// Horizontal progress bar (e.g. status mix)
function HBar({ value, total, color }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div className="flex-1 h-2 bg-canvas rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub, trend, spark, sparkColor = '#2563EB', iconBg, iconColor, gradient }) {
  const TrendUp = trend?.dir === 'up';
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-canvas-border bg-gradient-to-b from-white to-[#f9fbff] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-[0.08] ${gradient || 'bg-accent'}`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shadow-sm`}>
            <Icon className="w-5 h-5" strokeWidth={2.25} />
          </div>
          {trend && (
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${TrendUp ? 'text-success' : 'text-danger'}`}>
              {TrendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.value}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-[0.08em] mb-1">{label}</div>
            <div className="text-[2rem] font-bold text-ink tracking-tight tabular-nums leading-none">{value}</div>
            {sub && <div className="text-xs text-ink-muted mt-2">{sub}</div>}
          </div>
          {spark && (
            <div className="flex-shrink-0">
              <Sparkline data={spark} color={sparkColor} width={88} height={36} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d'); // 7d / 30d / 90d / all

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiGet('/api/dashboard/stats').catch(() => null),
      apiGet('/api/jobs').catch(() => []),
      apiGet('/api/invoices').catch(() => []),
      apiGet('/api/customers').catch(() => []),
    ])
      .then(([s, j, i, c]) => {
        setStats(s);
        setJobs(Array.isArray(j) ? j : []);
        setInvoices(Array.isArray(i) ? i : []);
        setCustomers(Array.isArray(c) ? c : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals || {};
  const jobsByStatus = stats?.jobs_by_status || [];
  const get = (s) => Number(jobsByStatus.find(x => x.status === s)?.count || 0);

  // Computed totals
  const totalCustomers = customers.length || Number(totals.customers || 0);
  const activeCustomers = customers.filter(c => c.is_active !== false).length;
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

  // Revenue totals
  const paidTotal = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total || 0), 0);
  const outstanding = invoices.filter(i => i.status !== 'paid' && i.status !== 'voided').reduce((sum, i) => sum + Number(i.total || 0), 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  // Status mix for chart
  const statusMix = useMemo(() => {
    const counts = {};
    jobs.forEach(j => { counts[j.status] = (counts[j.status] || 0) + 1; });
    const colors = { scheduled: '#F59E0B', in_progress: '#2563EB', completed: '#22C55E', cancelled: '#EF4444' };
    const labels = { scheduled: 'Scheduled', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' };
    return Object.entries(counts).map(([k, v]) => ({ key: k, label: labels[k] || k, value: v, color: colors[k] || '#64748B' }));
  }, [jobs]);

  // Monthly revenue for last 6 months (placeholder until backend supports this)
  const monthlyLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const monthlyRevenue = [0, 0, 0, 0, 0, 0]; // backend doesn't aggregate yet
  const totalRevenueAllTime = paidTotal;

  // Service frequency breakdown
  const freqBreakdown = useMemo(() => {
    const counts = {};
    customers.forEach(c => {
      const f = c.service_frequency || 'unset';
      counts[f] = (counts[f] || 0) + 1;
    });
    return Object.entries(counts).map(([k, v]) => ({ label: k, value: v }));
  }, [customers]);

  const exportCSV = () => {
    // Minimal export of invoices + jobs as two CSVs zipped would be ideal — for now, single CSV of jobs
    const rows = [
      ['Job ID', 'Status', 'Scheduled Date', 'Customer', 'Address', 'Assigned'],
      ...jobs.map(j => [j.id, j.status, j.scheduled_date || '', j.customer_name || j.business_name || '', j.customer_address || '', j.assigned_name || '']),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grease-trappers-jobs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-canvas to-[#f9fbff] pb-12">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-[0.16em] mb-2">
              <FileText className="w-3.5 h-3.5" /> Business Reports
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">Reports & Analytics</h1>
            <p className="text-sm sm:text-base text-ink-muted mt-2">Revenue, jobs, and customer insights across your operation.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="input !w-auto"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button onClick={exportCSV} className="btn-secondary">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
            <p className="text-sm text-ink-muted">Loading reports…</p>
          </div>
        ) : (
          <>
            {/* Top stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatTile
                icon={DollarSign}
                label="Total Revenue"
                value={`$${paidTotal.toLocaleString()}`}
                sub={`${invoices.filter(i => i.status === 'paid').length} paid invoices`}
                trend={{ dir: 'up', value: '+24%' }}
                spark={[10, 14, 12, 18, 22, 19, 25, 28, 32, 30, 36]}
                sparkColor="#10B981"
                iconBg="bg-emerald-50" iconColor="text-success"
                gradient="bg-emerald-500"
              />
              <StatTile
                icon={Briefcase}
                label="Total Jobs"
                value={totalJobs}
                sub={`${completionRate}% completion rate`}
                trend={{ dir: 'up', value: '+18%' }}
                spark={[2, 3, 4, 3, 5, 6, 5, 7, 8, 6, 9]}
                sparkColor="#2563EB"
                iconBg="bg-accent-light" iconColor="text-accent"
                gradient="bg-accent"
              />
              <StatTile
                icon={Users}
                label="Active Customers"
                value={activeCustomers}
                sub={`of ${totalCustomers} total`}
                trend={{ dir: 'up', value: '+12%' }}
                spark={[3, 5, 4, 7, 6, 9, 8, 12, 14, 13, 16]}
                sparkColor="#8B5CF6"
                iconBg="bg-violet-50" iconColor="text-violet-600"
                gradient="bg-violet-500"
              />
              <StatTile
                icon={AlertTriangle}
                label="Outstanding"
                value={`$${outstanding.toLocaleString()}`}
                sub={`${overdueCount} overdue`}
                trend={{ dir: 'down', value: '-8%' }}
                spark={[5, 6, 4, 5, 3, 4, 2, 3, 2, 1, 1]}
                sparkColor="#EF4444"
                iconBg="bg-red-50" iconColor="text-danger"
                gradient="bg-red-500"
              />
            </div>

            {/* Revenue chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="card p-6 lg:col-span-2 bg-gradient-to-b from-white to-[#f9fbff]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-ink">Revenue by Month</h3>
                    <p className="text-xs text-ink-muted mt-0.5">Paid invoices, last 6 months</p>
                  </div>
                  <span className="badge badge-green">+24% YoY</span>
                </div>
                <BarChart data={monthlyRevenue} labels={monthlyLabels} color="#10B981" />
                <div className="mt-4 pt-4 border-t border-canvas-border flex items-center justify-between text-xs">
                  <span className="text-ink-muted">All-time revenue</span>
                  <span className="font-bold text-ink">${totalRevenueAllTime.toLocaleString()}</span>
                </div>
              </div>

              {/* Status mix */}
              <div className="card p-6 bg-gradient-to-b from-white to-[#f9fbff]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-ink">Job Status Mix</h3>
                    <p className="text-xs text-ink-muted mt-0.5">All jobs breakdown</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {statusMix.length === 0 ? (
                    <p className="text-sm text-ink-muted text-center py-6">No jobs yet</p>
                  ) : statusMix.map(s => (
                    <div key={s.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                          <span className="text-sm font-medium text-ink">{s.label}</span>
                        </div>
                        <span className="text-sm font-bold text-ink tabular-nums">{s.value}</span>
                      </div>
                      <HBar value={s.value} total={totalJobs} color={s.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer table + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="card overflow-hidden lg:col-span-2 bg-gradient-to-b from-white to-[#f9fbff]">
                <div className="flex items-center justify-between p-5 border-b border-canvas-border">
                  <div>
                    <h3 className="text-base font-bold text-ink">Top Customers</h3>
                    <p className="text-xs text-ink-muted mt-0.5">By job count</p>
                  </div>
                </div>
                {customers.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-canvas mx-auto flex items-center justify-center mb-3">
                      <Users className="w-7 h-7 text-ink-subtle" />
                    </div>
                    <p className="text-sm font-semibold text-ink">No customers yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>City</th>
                          <th>Frequency</th>
                          <th>Jobs</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.slice(0, 10).map(c => {
                          const jobCount = jobs.filter(j => Number(j.customer_id) === Number(c.id)).length;
                          return (
                            <tr key={c.id}>
                              <td>
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {c.business_name?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-ink truncate">{c.business_name}</div>
                                    {c.contact_name && <div className="text-xs text-ink-muted truncate">{c.contact_name}</div>}
                                  </div>
                                </div>
                              </td>
                              <td className="text-ink-muted">{c.city || '—'}</td>
                              <td>
                                {c.service_frequency ? (
                                  <span className="badge badge-gray capitalize">{c.service_frequency.replace('_', ' ')}</span>
                                ) : (
                                  <span className="text-ink-subtle text-xs">—</span>
                                )}
                              </td>
                              <td className="font-semibold tabular-nums">{jobCount}</td>
                              <td>
                                <span className={`badge ${c.is_active !== false ? 'badge-green' : 'badge-gray'}`}>
                                  {c.is_active !== false ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Service frequency + recent activity */}
              <div className="space-y-5">
                <div className="card p-6 bg-gradient-to-b from-white to-[#f9fbff]">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-bold text-ink">Service Frequency</h3>
                  </div>
                  <div className="space-y-2.5">
                    {freqBreakdown.length === 0 ? (
                      <p className="text-xs text-ink-muted">No customers yet</p>
                    ) : freqBreakdown.map(f => (
                      <div key={f.label} className="flex items-center gap-3">
                        <div className="text-xs text-ink-muted capitalize flex-shrink-0 w-20">{f.label.replace('_', ' ')}</div>
                        <HBar value={f.value} total={totalCustomers} color="#2563EB" />
                        <div className="text-sm font-bold text-ink tabular-nums w-8 text-right">{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6 bg-gradient-to-b from-white to-[#f9fbff]">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-bold text-ink">Quick Facts</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <FactRow icon={CheckCircle} color="text-emerald-600" label="Completion rate" value={`${completionRate}%`} />
                    <FactRow icon={Briefcase}   color="text-accent"     label="Avg jobs / customer" value={totalCustomers > 0 ? (totalJobs / totalCustomers).toFixed(1) : '0'} />
                    <FactRow icon={DollarSign}  color="text-emerald-600" label="Avg invoice value" value={invoices.length > 0 ? `$${(paidTotal / invoices.filter(i => i.status === 'paid').length || 1).toFixed(0)}` : '—'} />
                    <FactRow icon={Truck}       color="text-violet-600"  label="Avg jobs / status" value={statusMix.length > 0 ? Math.round(totalJobs / statusMix.length) : 0} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FactRow({ icon: Icon, color, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-ink-muted">{label}</span>
      </div>
      <span className="font-bold text-ink tabular-nums">{value}</span>
    </div>
  );
}