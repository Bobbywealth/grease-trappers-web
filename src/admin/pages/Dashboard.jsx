import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, DollarSign, AlertTriangle, Clock,
  CheckCircle, Truck, Activity, ChevronRight, MapPin,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Plus,
  UserPlus, Calendar, FileText, Car, UserCheck, ExternalLink,
  Loader2,
} from 'lucide-react';
import { apiGet } from '../lib/api';

function fmt$(n) {
  return `$${parseFloat(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

// Tiny sparkline SVG
function Sparkline({ data = [], color = '#2563EB', width = 80, height = 28 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const points = data.map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(' ');
  const last = data[data.length - 1];
  const lastX = (data.length - 1) * step;
  const lastY = height - ((last - min) / range) * height;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#spark-${color})`} />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

// Donut chart
function Donut({ data = [], size = 180, thickness = 22 }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
        {data.map((seg, i) => {
          const dash = (seg.value / total) * c;
          const el = (
            <circle
              key={i}
              cx={size/2} cy={size/2} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-ink tabular-nums">{total}</div>
        <div className="text-xs text-ink-muted font-medium mt-0.5">Total jobs</div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, trend, spark, sparkColor = '#2563EB', iconBg = 'bg-accent-light', iconColor = 'text-accent' }) {
  const TrendUp = trend?.dir === 'up';
  return (
    <div className="card-interactive p-5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" strokeWidth={2.25} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${TrendUp ? 'text-success' : 'text-danger'}`}>
            {TrendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-ink tracking-tight tabular-nums">{value}</div>
      <div className="text-xs text-ink-muted mt-0.5 font-medium">{label}</div>
      <div className="flex items-end justify-between mt-3 pt-3 border-t border-canvas-border/60">
        <span className="text-xs text-ink-subtle">{sub}</span>
        {spark && <Sparkline data={spark} color={sparkColor} />}
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  scheduled:    { color: '#F59E0B', label: 'Scheduled',   badge: 'badge-yellow' },
  in_progress:  { color: '#2563EB', label: 'In Progress', badge: 'badge-blue'   },
  completed:    { color: '#22C55E', label: 'Completed',   badge: 'badge-green'  },
  cancelled:    { color: '#EF4444', label: 'Cancelled',   badge: 'badge-red'    },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [employeesActive, setEmployeesActive] = useState(0);

  useEffect(() => {
    Promise.all([
      apiGet('/api/dashboard/stats'),
      apiGet('/api/locations/active').catch(() => []),
    ])
      .then(([statsData, locationsData]) => {
        setStats(statsData);
        setRecent(statsData.recent_jobs || []);
        setEmployeesActive(Array.isArray(locationsData) ? locationsData.length : (statsData?.totals?.employees_active_now || 0));
      })
      .catch((e) => console.error('Dashboard load failed:', e))
      .finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals || {};
  const jobsByStatus = stats?.jobs_by_status || [];
  const get = (s) => jobsByStatus.find(x => x.status === s)?.count || 0;

  const donutData = useMemo(() => ([
    { label: 'Scheduled',   value: get('scheduled'),   color: STATUS_COLORS.scheduled.color },
    { label: 'In Progress', value: get('in_progress'), color: STATUS_COLORS.in_progress.color },
    { label: 'Completed',   value: get('completed'),   color: STATUS_COLORS.completed.color },
    { label: 'Cancelled',   value: get('cancelled'),   color: STATUS_COLORS.cancelled.color },
  ].filter(d => d.value > 0)), [jobsByStatus]);

  const totalJobs = donutData.reduce((a, b) => a + b.value, 0);

  const now = new Date();
  const liveTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">

      {/* ===== KPI Row ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Users}
          label="Total Customers"
          value={loading ? '···' : (totals.customers || 0)}
          sub="vs last month"
          trend={{ dir: 'up', value: '+12%' }}
          spark={[3, 5, 4, 7, 6, 9, 8, 12, 14, 13, 16]}
          sparkColor="#2563EB"
          iconBg="bg-accent-light" iconColor="text-accent"
        />
        <KpiCard
          icon={Briefcase}
          label="Jobs Today"
          value={loading ? '···' : (totals.jobs_scheduled_today || 0)}
          sub={`${get('in_progress')} in progress`}
          trend={{ dir: 'up', value: '+8%' }}
          spark={[2, 3, 4, 3, 5, 6, 5, 7, 8, 6, 9]}
          sparkColor="#22C55E"
          iconBg="bg-emerald-50" iconColor="text-success"
        />
        <KpiCard
          icon={DollarSign}
          label="Revenue This Month"
          value={loading ? '···' : fmt$(totals.revenue_this_month)}
          sub="vs last month"
          trend={{ dir: 'up', value: '+24%' }}
          spark={[10, 14, 12, 18, 22, 19, 25, 28, 32, 30, 36]}
          sparkColor="#10B981"
          iconBg="bg-emerald-50" iconColor="text-success"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Overdue Invoices"
          value={loading ? '···' : (totals.overdue_invoices || 0)}
          sub="needs follow-up"
          trend={{ dir: 'down', value: '-3' }}
          spark={[5, 6, 4, 5, 3, 4, 2, 3, 2, 1, 1]}
          sparkColor="#EF4444"
          iconBg="bg-red-50" iconColor="text-danger"
        />
      </div>

      {/* ===== Activity / Pipeline / Coverage row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Active Now */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-success" strokeWidth={2.25} />
              <h3 className="text-sm font-semibold text-ink">Active Now</h3>
            </div>
            <Link to="/live-ops" className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
              Open Live Map <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-5">
            {/* Large clock graphic */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="44" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                <circle cx="50" cy="50" r="44" stroke="#22C55E" strokeWidth="6" fill="none"
                  strokeDasharray="276" strokeDashoffset="70" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-success">Live</span>
                </div>
                <div className="text-2xl font-bold text-ink tabular-nums mt-0.5">{loading ? '···' : employeesActive}</div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs text-ink-muted mb-0.5">Currently clocked in</div>
              <div className="text-3xl font-bold text-ink tabular-nums">
                {loading ? '···' : employeesActive}
              </div>
              <div className="text-sm text-ink-muted mt-1">
                {employeesActive === 1 ? 'employee on the clock' : 'employees on the clock'}
              </div>
              <div className="text-[11px] text-ink-subtle mt-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> {liveTime}
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline donut */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink">Pipeline</h3>
            <Link to="/jobs" className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
              All Jobs <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex items-center gap-5">
            {totalJobs > 0 ? (
              <Donut data={donutData} size={140} thickness={18} />
            ) : (
              <div className="w-[140px] h-[140px] rounded-full bg-canvas flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-ink-subtle" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              {donutData.map(d => (
                <div key={d.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                    <span className="text-ink-muted">{d.label}</span>
                  </div>
                  <span className="font-semibold text-ink tabular-nums">{d.value}</span>
                </div>
              ))}
              {donutData.length === 0 && (
                <div className="text-sm text-ink-muted">No jobs yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Coverage cards */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink">Coverage</h3>
            <Link to="/customers" className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
              Details <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-accent-light/60 border border-accent/10 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <Truck className="w-5 h-5 text-accent" strokeWidth={2.25} />
                <span className="text-2xl font-bold text-accent tabular-nums">{loading ? '···' : (totals.traps || 0)}</span>
              </div>
              <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Traps Under Service</div>
            </div>
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <Briefcase className="w-5 h-5 text-success" strokeWidth={2.25} />
                <span className="text-2xl font-bold text-success tabular-nums">{loading ? '···' : (totals.active_contracts || 0)}</span>
              </div>
              <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Active Contracts</div>
            </div>
            <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <MapPin className="w-5 h-5 text-warning" strokeWidth={2.25} />
                <span className="text-2xl font-bold text-warning tabular-nums">12</span>
              </div>
              <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Service Areas</div>
            </div>
            <div className="rounded-2xl bg-violet-50/60 border border-violet-100 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <Calendar className="w-5 h-5 text-violet-600" strokeWidth={2.25} />
                <span className="text-2xl font-bold text-violet-600 tabular-nums">{loading ? '···' : (totals.jobs_scheduled_today || 0)}</span>
              </div>
              <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Upcoming Visits</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Recent Jobs + Quick Actions ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">

        {/* Recent Jobs table */}
        <div className="card xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-canvas-border">
            <div>
              <h3 className="text-base font-semibold text-ink">Recent Jobs</h3>
              <p className="text-xs text-ink-muted mt-0.5">Latest field operations</p>
            </div>
            <Link to="/jobs" className="text-sm font-semibold text-accent hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-14 h-14 rounded-2xl bg-canvas mx-auto flex items-center justify-center mb-3">
                <Briefcase className="w-7 h-7 text-ink-subtle" />
              </div>
              <p className="text-sm font-semibold text-ink">No jobs yet</p>
              <p className="text-xs text-ink-muted mt-0.5">Create your first job to get started.</p>
              <Link to="/jobs" className="btn-primary mt-4 inline-flex">
                <Plus className="w-4 h-4" /> Create Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Technician</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.slice(0, 8).map((job) => {
                    const status = STATUS_COLORS[job.status] || STATUS_COLORS.scheduled;
                    return (
                      <tr key={job.id} className="cursor-pointer">
                        <td className="font-semibold text-ink">#{job.id}</td>
                        <td>
                          <div className="font-medium text-ink">{job.customer_name || `Job #${job.id}`}</div>
                          {job.customer_address && (
                            <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {job.customer_address}
                            </div>
                          )}
                        </td>
                        <td className="text-ink-muted text-xs whitespace-nowrap">
                          {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '—'}
                          {job.scheduled_time && (
                            <div className="text-ink-subtle">{job.scheduled_time}</div>
                          )}
                        </td>
                        <td className="text-ink-muted text-xs">{job.assigned_name || 'Unassigned'}</td>
                        <td>
                          <span className={`badge ${status.badge}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
                            {status.label}
                          </span>
                        </td>
                        <td className="text-right">
                          <Link to={`/jobs/${job.id}`} className="btn-ghost !p-1.5 inline-flex" aria-label="View">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-ink">Quick Actions</h3>
            <p className="text-xs text-ink-muted mt-0.5">Common tasks, one click away</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Link to="/customers" className="card-interactive p-4 flex flex-col items-start gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-accent-light text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">New Customer</div>
                <div className="text-[11px] text-ink-muted">Add a restaurant</div>
              </div>
            </Link>
            <Link to="/jobs" className="card-interactive p-4 flex flex-col items-start gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-success flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Schedule Job</div>
                <div className="text-[11px] text-ink-muted">Plan a visit</div>
              </div>
            </Link>
            <Link to="/invoices" className="card-interactive p-4 flex flex-col items-start gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Create Invoice</div>
                <div className="text-[11px] text-ink-muted">Bill a customer</div>
              </div>
            </Link>
            <Link to="/vehicles" className="card-interactive p-4 flex flex-col items-start gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Add Vehicle</div>
                <div className="text-[11px] text-ink-muted">Expand the fleet</div>
              </div>
            </Link>
            <Link to="/staff" className="card-interactive p-4 flex flex-col items-start gap-2 group col-span-2">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Add Employee</div>
                <div className="text-[11px] text-ink-muted">Hire a technician or driver</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Bottom analytics row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">Revenue</h3>
              <p className="text-xs text-ink-muted mt-0.5">Last 6 months</p>
            </div>
            <span className="badge badge-green">+24%</span>
          </div>
          <Sparkline data={[12, 18, 16, 22, 28, 36]} color="#10B981" width={300} height={80} />
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">Jobs Completed</h3>
              <p className="text-xs text-ink-muted mt-0.5">Weekly trend</p>
            </div>
            <span className="badge badge-blue">+8%</span>
          </div>
          <Sparkline data={[8, 10, 9, 12, 14, 16, 18, 17]} color="#2563EB" width={300} height={80} />
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">Service Volume</h3>
              <p className="text-xs text-ink-muted mt-0.5">By week</p>
            </div>
            <span className="badge badge-yellow">+12%</span>
          </div>
          <Sparkline data={[5, 7, 6, 9, 11, 10, 13, 14]} color="#F59E0B" width={300} height={80} />
        </div>
      </div>
    </div>
  );
}