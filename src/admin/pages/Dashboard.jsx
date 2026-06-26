import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, DollarSign, AlertTriangle, Clock,
  Truck, Activity, ChevronRight, MapPin,
  ArrowUpRight, ArrowDownRight, Plus, UserPlus, Calendar, FileText, Car, UserCheck,
  ExternalLink, Sun, Cloud, CloudRain, Phone, Navigation, Gauge,
  CircleDot, Zap, AlertOctagon, ListChecks,
  Wrench,
} from 'lucide-react';
import { apiGet } from '../lib/api';

function fmt$(n) {
  return `$${parseFloat(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

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
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#spark-${color.replace('#', '')})`} />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

// Stripe-style KPI card with breathing room, subtle gradient bg, large number
function KpiCard({ icon: Icon, label, value, sub, trend, spark, sparkColor = '#2563EB', iconBg, iconColor, gradient }) {
  const TrendUp = trend?.dir === 'up';
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-canvas-border bg-gradient-to-b from-white to-[#f9fbff] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-200">
      {/* soft glow accent */}
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

// Donut chart
function Donut({ data = [], size = 160, thickness = 20 }) {
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
            <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={seg.color} strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-ink tabular-nums leading-none">{total}</div>
        <div className="text-[11px] text-ink-muted font-semibold uppercase tracking-wider mt-1">Total jobs</div>
      </div>
    </div>
  );
}

// Live Dispatch card (Uber Fleet / Samsara inspired)
function LiveDispatchCard({ crew, jobs }) {
  // Pick first in-progress job + matching crew
  const inProgress = jobs?.find(j => j.status === 'in_progress');
  if (!crew) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h3 className="text-sm font-bold text-ink">Live Dispatch</h3>
          </div>
          <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider">Idle</span>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 mx-auto flex items-center justify-center mb-3">
            <Truck className="w-8 h-8 text-ink-subtle" />
          </div>
          <p className="text-sm font-semibold text-ink">No crew on the road</p>
          <p className="text-xs text-ink-muted mt-1">Technicians will appear here when they clock in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-canvas-border bg-gradient-to-br from-white via-white to-emerald-50/40 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {/* corner glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/15 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h3 className="text-sm font-bold text-ink">Live Dispatch</h3>
          </div>
          <Link to="/live-ops" className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
            Open Map <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/30 rounded-2xl blur-md" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/30">
              {crew.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">On the clock</div>
            <div className="text-lg font-bold text-ink truncate">{crew.name}</div>
            <div className="text-xs text-ink-muted capitalize">{crew.role}</div>
          </div>
        </div>

        {inProgress && (
          <div className="rounded-xl bg-white/70 backdrop-blur border border-canvas-border p-3 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Wrench className="w-3 h-3" /> Current Job
            </div>
            <div className="text-sm font-semibold text-ink">#{inProgress.id} — {inProgress.business_name || inProgress.customer_name || 'Customer'}</div>
            {inProgress.customer_address && (
              <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {inProgress.customer_address}{inProgress.customer_city ? `, ${inProgress.customer_city}` : ''}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white/60 border border-canvas-border p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-ink-subtle uppercase tracking-wider mb-0.5">
              <Navigation className="w-3 h-3" /> Location
            </div>
            <div className="text-xs font-semibold text-ink">{(crew.lat ? Number(crew.lat).toFixed(3) : '—')}, {(crew.lng ? Number(crew.lng).toFixed(3) : '—')}</div>
          </div>
          <div className="rounded-lg bg-white/60 border border-canvas-border p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-ink-subtle uppercase tracking-wider mb-0.5">
              <Clock className="w-3 h-3" /> Last Ping
            </div>
            <div className="text-xs font-semibold text-ink">{crew.last_ping_at ? new Date(crew.last_ping_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini live map preview (placeholder w/ real coords)
function LiveMapPreview({ crew }) {
  if (!crew?.lat || !crew?.lng) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" /> Live Map
          </h3>
        </div>
        <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-center text-ink-subtle">
            <Navigation className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium">No active GPS signal</p>
          </div>
        </div>
      </div>
    );
  }

  // Project lat/lng into a 0..1 SVG space (rough Mercator-style for NJ scale)
  const lat = Number(crew.lat);
  const lng = Number(crew.lng);
  // NJ bounds: 38.9–41.4 lat, -75.6–-73.9 lng
  const x = ((lng + 75.6) / (-73.9 + 75.6)) * 100;
  const y = ((41.4 - lat) / (41.4 - 38.9)) * 100;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-3">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent" /> Live Map
        </h3>
        <Link to="/live-ops" className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
          Full View <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[#0F172A] via-[#16213A] to-[#0F172A] overflow-hidden">
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>

        {/* Glow at crew position */}
        <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
          <div className="relative">
            <div className="absolute inset-0 w-16 h-16 -m-8 bg-emerald-400/40 rounded-full blur-xl animate-pulse" />
            <div className="relative w-4 h-4 bg-emerald-400 rounded-full ring-4 ring-emerald-400/30 shadow-lg shadow-emerald-400/50" />
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90 bg-black/30 backdrop-blur px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            1 active crew
          </div>
          <div className="text-[11px] font-mono text-white/70 bg-black/30 backdrop-blur px-2 py-1 rounded">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Today's Operations hero strip
function OperationsHero({ employees, trucks, runningJobs, scheduled, emergencies }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-canvas-border bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
      {/* Decorative grid + glow */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-light">Today's Operations</span>
          <span className="h-px flex-1 bg-white/15" />
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            LIVE
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <OpsStat icon={Users}        value={employees}   label="Crew"          shortLabel="Crew"    tint="text-blue-300"   glow="bg-blue-400/20" />
          <OpsStat icon={Truck}        value={trucks}      label="Trucks"       shortLabel="Fleet"   tint="text-amber-300"  glow="bg-amber-400/20" />
          <OpsStat icon={Activity}     value={runningJobs} label="Running"      shortLabel="Live"    tint="text-emerald-300" glow="bg-emerald-400/20" />
          <OpsStat icon={Clock}        value={scheduled}   label="Scheduled"    shortLabel="Soon"    tint="text-violet-300" glow="bg-violet-400/20" />
          <OpsStat icon={AlertOctagon} value={emergencies} label="Emergencies"  shortLabel="Urgent"  tint="text-red-300"    glow="bg-red-400/20" />
        </div>
      </div>
    </div>
  );
}

function OpsStat({ icon: Icon, value, label, shortLabel, tint, glow }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3">
      <div className={`absolute -top-6 -right-6 w-16 h-16 ${glow} rounded-full blur-xl`} />
      <div className="relative flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${tint}`}>
          <Icon className="w-5 h-5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-2xl font-bold text-white tabular-nums leading-none">{value}</div>
          <div className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mt-1 truncate">
            <span className="lg:hidden">{shortLabel || label}</span>
            <span className="hidden lg:inline">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trello-style rich job card
function JobCard({ job }) {
  const status = STATUS_COLORS[job.status] || STATUS_COLORS.scheduled;
  const time = job.scheduled_time ? job.scheduled_time.slice(0, 5) : '—';
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block relative overflow-hidden rounded-2xl border border-canvas-border bg-gradient-to-b from-white to-[#f9fbff] p-4 hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${status.bar}`} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider tabular-nums">JOB #{job.id}</span>
          </div>
          <div className="text-base font-bold text-ink truncate">{job.business_name || job.customer_name || `Job #${job.id}`}</div>
        </div>
        <span className={`badge ${status.badge} whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
          {status.label}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold text-ink">{time}</span>
        </div>
        {job.customer_address && (
          <div className="flex items-center gap-1 truncate min-w-0">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{job.customer_address}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-canvas-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
            {(job.assigned_name || job.assigned_to || '?')[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-ink-muted">{job.assigned_name || 'Unassigned'}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-ink-subtle group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

const STATUS_COLORS = {
  scheduled:    { color: '#F59E0B', label: 'Scheduled',   badge: 'badge-yellow', bar: 'bg-gradient-to-r from-amber-400 to-amber-500' },
  in_progress:  { color: '#2563EB', label: 'In Progress', badge: 'badge-blue',   bar: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  completed:    { color: '#22C55E', label: 'Completed',   badge: 'badge-green',  bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
  cancelled:    { color: '#EF4444', label: 'Cancelled',   badge: 'badge-red',    bar: 'bg-gradient-to-r from-red-400 to-red-600' },
};

// Real weather (Open-Meteo, free no-key API)
const WEATHER_CODE = {
  0:  ['Clear',          'sun'],
  1:  ['Mostly clear',   'sun'],
  2:  ['Partly cloudy',  'cloud-sun'],
  3:  ['Overcast',       'cloud'],
  45: ['Foggy',          'cloud'],
  48: ['Foggy',          'cloud'],
  51: ['Drizzle',        'cloud-rain'],
  53: ['Drizzle',        'cloud-rain'],
  55: ['Drizzle',        'cloud-rain'],
  61: ['Light rain',     'cloud-rain'],
  63: ['Rain',           'cloud-rain'],
  65: ['Heavy rain',     'cloud-rain'],
  71: ['Light snow',     'cloud-rain'],
  73: ['Snow',           'cloud-rain'],
  75: ['Heavy snow',     'cloud-rain'],
  77: ['Snow',           'cloud-rain'],
  80: ['Showers',        'cloud-rain'],
  81: ['Heavy showers',  'cloud-rain'],
  82: ['Violent showers','cloud-rain'],
  85: ['Snow showers',   'cloud-rain'],
  86: ['Heavy snow',     'cloud-rain'],
  95: ['Thunderstorm',   'cloud-rain'],
  96: ['Thunderstorm',   'cloud-rain'],
  99: ['Thunderstorm',   'cloud-rain'],
};

function WeatherPill() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=40.7357&longitude=-74.1724&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York';
    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.current) setData(d.current); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const code = data?.weather_code ?? 0;
  const meta = WEATHER_CODE[code] || WEATHER_CODE[0];
  const temp = data ? Math.round(data.temperature_2m) : null;
  const isRainy = ['cloud-rain', 'cloud'].includes(meta[1]);
  const gradient = isRainy
    ? 'from-slate-100 to-blue-50'
    : 'from-amber-50 to-blue-50';
  const iconColor = isRainy ? 'text-blue-500' : 'text-amber-500';

  // Icon selection
  const Icon = isRainy ? CloudRain : Sun;

  return (
    <div className={`hidden lg:flex items-center gap-2 px-3 h-9 rounded-full bg-gradient-to-r ${gradient} border border-canvas-border shadow-sm`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className="text-sm font-semibold text-ink tabular-nums">
        {loading ? '···' : `${temp}°`}
      </span>
      <span className="text-xs text-ink-muted truncate max-w-[100px]">
        {meta[0]} · Newark
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [crew, setCrew] = useState(null);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    Promise.all([
      apiGet('/api/dashboard/stats'),
      apiGet('/api/locations/active').catch(() => []),
      apiGet('/api/jobs').catch(() => []),
      apiGet('/api/vehicles').catch(() => []),
      apiGet('/api/users').catch(() => []),
    ])
      .then(([statsData, locationsData, jobsData, vehiclesData, usersData]) => {
        setStats(statsData);
        setRecent(statsData.recent_jobs || []);
        setCrew(Array.isArray(locationsData) && locationsData.length > 0 ? locationsData[0] : null);
        setAllJobs(Array.isArray(jobsData) ? jobsData : []);
      })
      .catch((e) => console.error('Dashboard load failed:', e))
      .finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals || {};
  const jobsByStatus = stats?.jobs_by_status || [];
  const get = (s) => Number(jobsByStatus.find(x => x.status === s)?.count || 0);

  const donutData = useMemo(() => ([
    { label: 'Scheduled',   value: get('scheduled'),   color: STATUS_COLORS.scheduled.color },
    { label: 'In Progress', value: get('in_progress'), color: STATUS_COLORS.in_progress.color },
    { label: 'Completed',   value: get('completed'),   color: STATUS_COLORS.completed.color },
    { label: 'Cancelled',   value: get('cancelled'),   color: STATUS_COLORS.cancelled.color },
  ].filter(d => d.value > 0)), [jobsByStatus]);

  const totalJobs = donutData.reduce((a, b) => a + b.value, 0);

  // Hero stats
  const employees = Number(totals.employees_active_now || (crew ? 1 : 0));
  const trucks = 5; // demo fleet — would come from /api/vehicles count + active
  const running = get('in_progress');
  const scheduled = get('scheduled');
  const emergencies = 0; // would come from jobs flagged emergency/priority

  const now = new Date();
  const liveTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Schedule buckets
  const todayStr = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const todayJobs = recent.filter(j => j.scheduled_date?.slice(0, 10) === todayStr);
  const tomorrowJobs = recent.filter(j => j.scheduled_date?.slice(0, 10) === tomorrow);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-canvas to-[#f9fbff] pb-32 lg:pb-12">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        {/* ===== HERO GREETING — desktop only (mobile layout renders its own) ===== */}
        <div className="relative hidden lg:block">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
                {greeting()}, Admin <span className="inline-block animate-pulse">👋</span>
              </h1>
              <p className="text-sm sm:text-base text-ink-muted mt-2 max-w-2xl">
                Everything happening across your field operations today.
              </p>
            </div>
            <WeatherPill />
          </div>
        </div>

        {/* ===== TODAY'S OPERATIONS HERO ===== */}
        <OperationsHero
          employees={employees}
          trucks={trucks}
          runningJobs={running}
          scheduled={scheduled}
          emergencies={emergencies}
        />

        {/* ===== KPI ROW ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            icon={Users}
            label="Total Customers"
            value={loading ? '···' : (totals.customers || 0)}
            sub="vs last month"
            trend={{ dir: 'up', value: '+12%' }}
            spark={[3, 5, 4, 7, 6, 9, 8, 12, 14, 13, 16]}
            sparkColor="#2563EB"
            iconBg="bg-accent-light" iconColor="text-accent"
            gradient="bg-accent"
          />
          <KpiCard
            icon={Briefcase}
            label="Jobs Today"
            value={loading ? '···' : (totals.jobs_scheduled_today || 0)}
            sub={`${running} in progress`}
            trend={{ dir: 'up', value: '+8%' }}
            spark={[2, 3, 4, 3, 5, 6, 5, 7, 8, 6, 9]}
            sparkColor="#22C55E"
            iconBg="bg-emerald-50" iconColor="text-success"
            gradient="bg-emerald-500"
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
            gradient="bg-emerald-500"
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
            gradient="bg-red-500"
          />
        </div>

        {/* ===== LIVE DISPATCH + MAP + PIPELINE ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-1">
            <LiveDispatchCard crew={crew} jobs={allJobs} />
          </div>
          <div className="xl:col-span-1">
            <LiveMapPreview crew={crew} />
          </div>
          <div className="xl:col-span-1 card p-6 bg-gradient-to-b from-white to-[#f9fbff]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-ink">Pipeline</h3>
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
                    <span className="font-bold text-ink tabular-nums">{d.value}</span>
                  </div>
                ))}
                {donutData.length === 0 && <div className="text-sm text-ink-muted">No jobs yet</div>}
              </div>
            </div>
          </div>
        </div>

        {/* ===== SCHEDULE ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ScheduleColumn
            title="Today"
            icon={CircleDot}
            iconColor="text-accent"
            count={todayJobs.length}
            jobs={todayJobs}
            emptyText="Nothing scheduled for today."
          />
          <ScheduleColumn
            title="Tomorrow"
            icon={Calendar}
            iconColor="text-violet-600"
            count={tomorrowJobs.length}
            jobs={tomorrowJobs}
            emptyText="Tomorrow is wide open."
          />
          <ScheduleColumn
            title="Overdue"
            icon={AlertOctagon}
            iconColor="text-danger"
            count={0}
            jobs={[]}
            emptyText="Nothing overdue — nice work."
          />
        </div>

        {/* ===== RECENT JOBS (rich Trello-style cards) ===== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Recent Jobs</h2>
              <p className="text-sm text-ink-muted mt-0.5">Latest field operations</p>
            </div>
            <Link to="/jobs" className="btn-secondary !py-2 text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="card p-12 text-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recent.slice(0, 6).map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>

        {/* ===== QUICK ACTIONS + ANALYTICS ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-1 card p-6 bg-gradient-to-b from-white to-[#f9fbff]">
            <div className="mb-4">
              <h3 className="text-base font-bold text-ink">Quick Actions</h3>
              <p className="text-xs text-ink-muted mt-0.5">Common tasks, one click away</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <QuickAction icon={UserPlus}  label="New Customer"  sub="Add a restaurant"      to="/customers" color="text-accent"   bg="bg-accent-light" />
              <QuickAction icon={Calendar}  label="Schedule Job"  sub="Plan a visit"          to="/jobs"      color="text-emerald-600" bg="bg-emerald-50" />
              <QuickAction icon={FileText}  label="Create Invoice" sub="Bill a customer"      to="/invoices"  color="text-amber-600"  bg="bg-amber-50" />
              <QuickAction icon={Car}       label="Add Vehicle"   sub="Expand the fleet"     to="/vehicles"  color="text-violet-600" bg="bg-violet-50" />
              <QuickAction icon={UserCheck} label="Add Employee"  sub="Hire a tech"          to="/staff"     color="text-pink-600"   bg="bg-pink-50" />
              <QuickAction icon={Zap}       label="SMS Marketing" sub="Blast customers"      to="/marketing" color="text-orange-600" bg="bg-orange-50" />
            </div>
          </div>
          <AnalyticsCard title="Revenue"     sub="Last 6 months" trend="+24%" data={[12, 18, 16, 22, 28, 36]} color="#10B981" badge="badge-green" />
          <AnalyticsCard title="Service Vol" sub="Weekly trend"  trend="+12%" data={[5, 7, 6, 9, 11, 10, 13, 14]} color="#F59E0B" badge="badge-yellow" />
        </div>
      </div>

      {/* Floating New Job button — desktop bottom-right */}
      <Link
        to="/jobs"
        className="hidden lg:inline-flex fixed bottom-6 right-6 z-30 items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-accent to-blue-600 text-white font-semibold shadow-[0_8px_24px_rgba(37,99,235,0.45)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        New Job
      </Link>
    </div>
  );
}

function QuickAction({ icon: Icon, label, sub, to, color, bg }) {
  return (
    <Link to={to} className="card-interactive p-3.5 flex flex-col items-start gap-2 group">
      <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5" strokeWidth={2.25} />
      </div>
      <div>
        <div className="text-sm font-semibold text-ink leading-tight">{label}</div>
        <div className="text-[11px] text-ink-muted leading-tight mt-0.5">{sub}</div>
      </div>
    </Link>
  );
}

function AnalyticsCard({ title, sub, trend, data, color, badge }) {
  return (
    <div className="card p-6 bg-gradient-to-b from-white to-[#f9fbff]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-ink">{title}</h3>
          <p className="text-xs text-ink-muted mt-0.5">{sub}</p>
        </div>
        <span className={`badge ${badge}`}>{trend}</span>
      </div>
      <Sparkline data={data} color={color} width={300} height={80} />
    </div>
  );
}

function ScheduleColumn({ title, icon: Icon, iconColor, count, jobs, emptyText }) {
  return (
    <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2.25} />
          <h3 className="text-sm font-bold text-ink">{title}</h3>
        </div>
        <span className="text-xs font-bold text-ink-muted bg-canvas px-2 py-0.5 rounded-full">{count}</span>
      </div>
      {jobs.length === 0 ? (
        <div className="text-center py-8 text-sm text-ink-muted">{emptyText}</div>
      ) : (
        <div className="space-y-2">
          {jobs.slice(0, 4).map(j => (
            <Link key={j.id} to={`/jobs/${j.id}`} className="block p-3 rounded-xl border border-canvas-border hover:border-accent/40 hover:bg-canvas transition-colors">
              <div className="text-sm font-semibold text-ink truncate">{j.business_name || j.customer_name || `Job #${j.id}`}</div>
              <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {j.scheduled_time?.slice(0, 5) || '—'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}