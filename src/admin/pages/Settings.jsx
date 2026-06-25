import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, User, Lock, Bell, Smartphone, Mail,
  Check, AlertCircle, Loader2, Building2, Phone, MapPin,
  Eye, EyeOff, Save, Trash2, Globe, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPut } from '../lib/api';
import { BUSINESS_NAME, PHONE, PHONE_RAW, EMAIL, FOUNDED_YEAR } from '../../config/brand';

const NOTIFICATION_KEY = 'gt_notif_prefs';

function Section({ icon: Icon, title, description, children, action }) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-canvas-border bg-gradient-to-b from-white to-[#f9fbff] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3 p-5 border-b border-canvas-border">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-ink">{title}</h3>
            {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-subtle mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-canvas-border hover:border-accent/30 hover:bg-canvas/40 transition-colors cursor-pointer">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-ink">{label}</div>
        {description && <div className="text-xs text-ink-muted mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-accent' : 'bg-slate-300'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        } translate-y-0.5`} />
      </button>
    </label>
  );
}

function StatusMessage({ kind, children }) {
  if (!children) return null;
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error:   'bg-red-50 border-red-200 text-red-700',
    info:    'bg-accent-light border-accent/20 text-accent',
  };
  const Icon = kind === 'success' ? Check : kind === 'error' ? AlertCircle : AlertCircle;
  return (
    <div className={`flex items-start gap-2 p-3 rounded-xl border text-sm ${styles[kind]} animate-fade-up`}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

export default function Settings() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [notifs, setNotifs] = useState({
    job_complete: true,
    job_assigned: true,
    new_customer: false,
    invoice_paid: true,
    overdue_invoice: true,
    daily_summary: false,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ kind: '', text: '' });
  const [pwdMsg, setPwdMsg] = useState({ kind: '', text: '' });
  const [stats, setStats] = useState(null);

  // Hydrate profile from auth
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Hydrate notification prefs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIFICATION_KEY);
      if (raw) setNotifs(prev => ({ ...prev, ...JSON.parse(raw) }));
    } catch (e) { /* noop */ }
  }, []);

  // Live stats for company snapshot
  useEffect(() => {
    apiGet('/api/dashboard/stats').then(setStats).catch(() => setStats(null));
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true); setProfileMsg({ kind: '', text: '' });
    try {
      const updates = {};
      if (profile.name !== user?.name) updates.name = profile.name;
      if (profile.phone !== (user?.phone || '')) updates.phone = profile.phone;
      // email update requires admin per /api/users/:id rules — non-admin silently skips
      if (Object.keys(updates).length === 0) {
        setProfileMsg({ kind: 'info', text: 'Nothing changed.' });
        return;
      }
      await apiPut(`/api/users/${user.id}`, updates);
      setProfileMsg({ kind: 'success', text: 'Profile updated. Sign out and back in to see your new name everywhere.' });
    } catch (e) {
      setProfileMsg({ kind: 'error', text: e.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePwd = async () => {
    setSavingPwd(true); setPwdMsg({ kind: '', text: '' });
    try {
      if (!pwd.current) { setPwdMsg({ kind: 'error', text: 'Enter your current password.' }); return; }
      if (pwd.next.length < 6) { setPwdMsg({ kind: 'error', text: 'New password must be at least 6 characters.' }); return; }
      if (pwd.next !== pwd.confirm) { setPwdMsg({ kind: 'error', text: 'Passwords do not match.' }); return; }
      await apiPut(`/api/users/${user.id}`, { password: pwd.next });
      setPwdMsg({ kind: 'success', text: 'Password updated successfully.' });
      setPwd({ current: '', next: '', confirm: '' });
    } catch (e) {
      setPwdMsg({ kind: 'error', text: e.message });
    } finally {
      setSavingPwd(false);
    }
  };

  const updateNotif = (key, val) => {
    const next = { ...notifs, [key]: val };
    setNotifs(next);
    try { localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(next)); } catch (e) {}
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-canvas to-[#f9fbff] pb-12">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-[0.16em] mb-2">
            <SettingsIcon className="w-3.5 h-3.5" /> Settings
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">Account & Preferences</h1>
          <p className="text-sm text-ink-muted mt-2">Manage your profile, security, and notifications.</p>
        </div>

        {/* Profile */}
        <Section
          icon={User}
          title="Your Profile"
          description="Update your name and phone number. Email changes require an admin."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input
                type="text"
                className="input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className="input opacity-60 cursor-not-allowed"
                value={profile.email}
                disabled
                hint="Contact an admin to change your email."
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                className="input"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="(555) 555-5555"
              />
            </Field>
            <Field label="Role">
              <input
                type="text"
                className="input opacity-60 cursor-not-allowed capitalize"
                value={user?.role || ''}
                disabled
                hint="Roles are managed by admins."
              />
            </Field>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="btn-primary"
            >
              {savingProfile ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Profile</>}
            </button>
            <StatusMessage kind={profileMsg.kind}>{profileMsg.text}</StatusMessage>
          </div>
        </Section>

        {/* Password */}
        <Section
          icon={Lock}
          title="Password"
          description="Choose a strong password. You'll stay signed in on this device."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Current Password">
              <div className="relative">
                <input
                  type={showPwd.current ? 'text' : 'password'}
                  className="input pr-10"
                  value={pwd.current}
                  onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, current: !showPwd.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="New Password">
              <div className="relative">
                <input
                  type={showPwd.next ? 'text' : 'password'}
                  className="input pr-10"
                  value={pwd.next}
                  onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, next: !showPwd.next })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  {showPwd.next ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirm New Password">
              <div className="relative">
                <input
                  type={showPwd.confirm ? 'text' : 'password'}
                  className="input pr-10"
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, confirm: !showPwd.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={savePwd}
              disabled={savingPwd}
              className="btn-primary"
            >
              {savingPwd ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : <><Lock className="w-4 h-4" /> Update Password</>}
            </button>
            <StatusMessage kind={pwdMsg.kind}>{pwdMsg.text}</StatusMessage>
          </div>
        </Section>

        {/* Company info (read-only snapshot) */}
        <Section
          icon={Building2}
          title="Company"
          description="These details appear on quotes, invoices, and your marketing site. Contact support to change them."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Business Name">
              <input type="text" className="input opacity-60 cursor-not-allowed" value={BUSINESS_NAME} disabled />
            </Field>
            <Field label="Founded">
              <input type="text" className="input opacity-60 cursor-not-allowed" value={FOUNDED_YEAR} disabled />
            </Field>
            <Field label="Phone">
              <input type="text" className="input opacity-60 cursor-not-allowed" value={PHONE} disabled />
            </Field>
            <Field label="Email">
              <input type="text" className="input opacity-60 cursor-not-allowed" value={EMAIL} disabled />
            </Field>
            <Field label="Headquarters">
              <input type="text" className="input opacity-60 cursor-not-allowed" value="Newark, NJ" disabled />
            </Field>
            <Field label="Service Area">
              <input type="text" className="input opacity-60 cursor-not-allowed" value="New Jersey, New York, Pennsylvania" disabled />
            </Field>
          </div>
        </Section>

        {/* Notification preferences */}
        <Section
          icon={Bell}
          title="Notifications"
          description="Pick what you want to be notified about. Saved to this device."
        >
          <div className="space-y-2.5">
            <Toggle
              checked={notifs.job_complete}
              onChange={(v) => updateNotif('job_complete', v)}
              label="Job completed"
              description="When a field crew marks a job as done."
            />
            <Toggle
              checked={notifs.job_assigned}
              onChange={(v) => updateNotif('job_assigned', v)}
              label="New job assigned to me"
              description="When a job is assigned directly to you."
            />
            <Toggle
              checked={notifs.new_customer}
              onChange={(v) => updateNotif('new_customer', v)}
              label="New customer added"
              description="When someone creates a customer account."
            />
            <Toggle
              checked={notifs.invoice_paid}
              onChange={(v) => updateNotif('invoice_paid', v)}
              label="Invoice paid"
              description="When a customer pays an invoice."
            />
            <Toggle
              checked={notifs.overdue_invoice}
              onChange={(v) => updateNotif('overdue_invoice', v)}
              label="Overdue invoice"
              description="Daily digest of invoices past their due date."
            />
            <Toggle
              checked={notifs.daily_summary}
              onChange={(v) => updateNotif('daily_summary', v)}
              label="Daily summary email"
              description="One email at 7 AM with yesterday's numbers."
            />
          </div>
        </Section>

        {/* SMS Marketing settings */}
        <Section
          icon={Smartphone}
          title="SMS Marketing"
          description="Outbound SMS is currently in stub mode — messages are logged to the database but not yet sent via Twilio."
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div>
                <div className="text-sm font-semibold text-amber-900">Twilio not configured</div>
                <div className="text-xs text-amber-700 mt-0.5">Add <code className="px-1 py-0.5 bg-amber-100 rounded">TWILIO_ACCOUNT_SID</code>, <code className="px-1 py-0.5 bg-amber-100 rounded">TWILIO_AUTH_TOKEN</code>, <code className="px-1 py-0.5 bg-amber-100 rounded">TWILIO_FROM_NUMBER</code> to enable real delivery.</div>
              </div>
              <span className="badge badge-yellow">Stub Mode</span>
            </div>
            <Toggle
              checked={false}
              onChange={() => {}}
              label="Auto-send service reminders"
              description="When a customer's last service was 90+ days ago."
              disabled
            />
            <Toggle
              checked={false}
              onChange={() => {}}
              label="Confirm appointments 24h before"
              description="SMS reminder the day before each scheduled job."
              disabled
            />
          </div>
        </Section>

        {/* Account snapshot */}
        <Section
          icon={Globe}
          title="Account Snapshot"
          description="Your account at a glance."
        >
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SnapshotTile label="Active Customers" value={stats.totals?.customers || 0} />
              <SnapshotTile label="Jobs Today"       value={stats.totals?.jobs_scheduled_today || 0} />
              <SnapshotTile label="Active Crew"      value={stats.totals?.employees_active_now || 0} />
              <SnapshotTile label="Overdue"          value={stats.totals?.overdue_invoices || 0} />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading snapshot…
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-canvas-border flex flex-wrap items-center gap-2 text-xs text-ink-muted">
            <span>Member since {new Date(user?.last_login_at || Date.now()).toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
            {user?.last_login_at && (
              <>
                <span>•</span>
                <span>Last login {new Date(user.last_login_at).toLocaleString()}</span>
              </>
            )}
          </div>
        </Section>

        {/* Danger zone */}
        <div className="relative overflow-hidden rounded-[18px] border border-red-200 bg-gradient-to-b from-red-50/60 to-white p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5" strokeWidth={2.25} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-red-900">Danger Zone</h3>
              <p className="text-xs text-red-700 mt-0.5">Sign out of this device. Contact support to delete the account entirely.</p>
            </div>
          </div>
          <button onClick={logout} className="btn-danger">
            <LogOutIcon /> Sign out of this device
          </button>
        </div>
      </div>
    </div>
  );
}

function SnapshotTile({ label, value }) {
  return (
    <div className="rounded-xl bg-canvas border border-canvas-border p-3">
      <div className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-ink tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

function LogOutIcon() {
  // tiny inline so I don't need to import an extra icon
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}