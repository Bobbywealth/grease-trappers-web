import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, Radio, Settings, DollarSign, FileBarChart,
  Bell, Search, Plus, ChevronDown, Phone, LogOut, Menu, X, HelpCircle,
  MoreHorizontal, Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_NAME, PHONE, PHONE_RAW } from '../../config/brand';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      path: '/dashboard' },
  { icon: Users,          label: 'Customers',      path: '/customers' },
  { icon: Briefcase,      label: 'Jobs',           path: '/jobs' },
  { icon: Radio,          label: 'Live Operations', path: '/live-ops' },
  { icon: Users,          label: 'Staff',          path: '/staff' },
  { icon: Briefcase,      label: 'Vehicles',       path: '/vehicles' },
  { icon: DollarSign,     label: 'Invoices',       path: '/invoices' },
  { icon: FileBarChart,   label: 'Reports',        path: '/reports' },
];

const bottomTabs = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase,      label: 'Jobs',      path: '/jobs' },
  { icon: Users,          label: 'Customers', path: '/customers' },
  { icon: MoreHorizontal, label: 'More',      path: '/live-ops' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const titles = {
  '/dashboard':  { title: 'Dashboard',       sub: 'Real-time overview of your operations' },
  '/customers':  { title: 'Customers',       sub: 'Manage restaurants and service contracts' },
  '/jobs':       { title: 'Jobs',            sub: 'Schedule, track, and complete field jobs' },
  '/live-ops':   { title: 'Live Operations', sub: 'Real-time field crew tracking' },
  '/staff':      { title: 'Staff',           sub: 'Technicians, drivers, and crew assignments' },
  '/vehicles':   { title: 'Vehicles',        sub: 'Fleet and equipment management' },
  '/invoices':   { title: 'Invoices',        sub: 'Billing, payments, and revenue' },
  '/reports':    { title: 'Reports',         sub: 'Business intelligence and exports' },
  '/settings':   { title: 'Settings',        sub: 'Account, integrations, and preferences' },
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [q, setQ] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const current = titles[location.pathname] || { title: 'Dashboard', sub: '' };
  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const initials = (user?.name || 'A U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  const Drawer = (
    <div className="lg:hidden fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}>
      <aside
        className="absolute left-0 top-0 bottom-0 w-80 max-w-[88vw] bg-navy-900 text-slate-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt={BUSINESS_NAME} className="h-8 w-auto" />
            <div>
              <div className="text-sm font-bold text-white">{BUSINESS_NAME}</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Manager Console</div>
            </div>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-px bg-navy-800 mx-3" />

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="section-title !mt-0">Workspace</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className={active ? 'nav-item-active' : 'nav-item'}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="section-title">Account</div>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className={active ? 'nav-item-active' : 'nav-item'}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-700 border border-navy-600/40 p-4">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">Need Help?</span>
              </div>
              <div className="text-sm font-semibold text-white">24/7 Dispatch</div>
              <a
                href={`tel:${PHONE_RAW}`}
                className="flex items-center justify-center gap-2 w-full mt-3 px-3 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors duration-200"
              >
                <Phone className="w-3.5 h-3.5" />
                {PHONE}
              </a>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );

  return (
    <div className="flex h-screen bg-canvas">
      {/* ===== Desktop sidebar ===== */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-navy-900">
        <div className="flex flex-col h-full text-slate-300">
          <div className="px-5 pt-6 pb-5">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img src="/logo.png" alt={BUSINESS_NAME} className="h-9 w-auto" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{BUSINESS_NAME}</div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Manager Console</div>
              </div>
            </Link>
          </div>
          <div className="h-px bg-navy-800 mx-3" />
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="section-title !mt-0">Workspace</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={active ? 'nav-item-active' : 'nav-item'}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="section-title">Account</div>
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={active ? 'nav-item-active' : 'nav-item'}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-3 pb-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-700 border border-navy-600/40 p-4">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">Need Help?</span>
                </div>
                <div className="text-sm font-semibold text-white">24/7 Dispatch</div>
                <div className="text-xs text-slate-400 mt-0.5 mb-3">Tap below to call support anytime.</div>
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors duration-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {PHONE}
                </a>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-navy-800 transition-colors duration-200"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {drawerOpen && Drawer}

      {/* ===== Main column ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header — dark navy */}
        <header className="lg:hidden bg-navy-900 text-white sticky top-0 z-30 border-b border-navy-800">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/dashboard" className="absolute left-1/2 -translate-x-1/2">
              <img src="/logo.png" alt={BUSINESS_NAME} className="h-7 w-auto" />
            </Link>
            <button className="relative p-2 -mr-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-navy-900" />
            </button>
          </div>
        </header>

        {/* Desktop header — white sticky */}
        <header className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-canvas-border sticky top-0 z-30">
          <div className="flex items-center gap-3 px-8 h-16">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-ink truncate">{current.title}</h1>
                <span className="text-sm text-ink-muted truncate">· {greeting()}, {firstName} 👋</span>
              </div>
              <p className="text-xs text-ink-muted truncate">{current.sub}</p>
            </div>

            <div className="flex items-center gap-2 px-3 h-10 bg-canvas border border-canvas-border rounded-full shadow-sm focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all w-72">
              <Search className="w-4 h-4 text-ink-subtle" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search customers, jobs, invoices..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-subtle"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-ink-subtle bg-white border border-canvas-border rounded">⌘K</kbd>
            </div>

            <Link to="/jobs" className="btn-primary !py-2 !px-3.5 text-sm">
              <Plus className="w-4 h-4" />
              New Job
            </Link>

            <button className="relative p-2 rounded-xl text-ink-muted hover:bg-canvas hover:text-ink transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl hover:bg-canvas transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {initials}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-ink leading-tight">{user?.name}</div>
                  <div className="text-[11px] text-ink-muted leading-tight capitalize">{user?.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-ink-subtle" />
              </button>

              {userMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-canvas-border py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-canvas-border">
                      <div className="text-sm font-semibold text-ink">{user?.name}</div>
                      <div className="text-xs text-ink-muted truncate">{user?.email}</div>
                    </div>
                    <Link to="/settings" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-canvas">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-navy-900 lg:bg-canvas pb-24 lg:pb-0">
          {/* Mobile hero block (Dashboard only) — matches the screenshot */}
          {location.pathname === '/dashboard' ? (
            <div className="lg:hidden bg-navy-900 text-white px-5 pt-3 pb-6">
              <h1 className="text-2xl font-bold mb-1">{current.title}</h1>
              <p className="text-base font-semibold text-white/95 mb-0.5">
                {greeting()}, {firstName}! 👋
              </p>
              <p className="text-sm text-white/60 mb-4">Here&apos;s what&apos;s happening today.</p>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {today}
              </div>
            </div>
          ) : (
            <div className="lg:hidden bg-navy-900 text-white px-5 pt-3 pb-4">
              <h1 className="text-2xl font-bold">{current.title}</h1>
              <p className="text-sm text-white/60 mt-1">{current.sub}</p>
            </div>
          )}

          <Outlet />
        </main>

        {/* Mobile bottom tab bar — matches screenshot */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          {/* Floating + button */}
          <Link
            to="/jobs"
            className="absolute left-1/2 -translate-x-1/2 -top-7 w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/40 flex items-center justify-center text-white hover:scale-105 transition-transform"
            aria-label="Create"
          >
            <Plus className="w-7 h-7" strokeWidth={2.5} />
          </Link>

          <div className="bg-white border-t border-canvas-border px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="grid grid-cols-5 items-center">
              {bottomTabs.slice(0, 2).map(tab => <BottomTab key={tab.path} {...tab} active={isActive(tab.path)} />)}
              <div /> {/* spacer for floating + */}
              {bottomTabs.slice(2).map(tab => <BottomTab key={tab.path} {...tab} active={isActive(tab.path)} />)}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

function BottomTab({ icon: Icon, label, to, active }) {
  const content = (
    <>
      <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-accent' : 'text-ink-muted'}`} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[11px] font-semibold ${active ? 'text-accent' : 'text-ink-muted'}`}>{label}</span>
    </>
  );
  return to ? (
    <Link to={to} className="flex flex-col items-center justify-center py-2 px-1">{content}</Link>
  ) : (
    <button className="flex flex-col items-center justify-center py-2 px-1">{content}</button>
  );
}