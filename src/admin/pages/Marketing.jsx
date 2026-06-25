import React, { useState, useEffect } from 'react';
import {
  Send, Users, MapPin, MessageSquare, Calendar, FileText, Plus,
  Check, Trash2, RefreshCw, Eye, Clock, Sparkles, Zap,
} from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '../lib/api';

const TABS = [
  { id: 'compose',   label: 'Compose',     icon: Send },
  { id: 'campaigns', label: 'Campaigns',   icon: MessageSquare },
  { id: 'templates', label: 'Templates',   icon: FileText },
];

const FREQ_OPTIONS = [
  { value: 'weekly',    label: 'Weekly' },
  { value: 'biweekly',  label: 'Bi-weekly' },
  { value: 'monthly',   label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'one_time',  label: 'One-time' },
  { value: 'other',     label: 'Other' },
];

const TEMPLATE_CATEGORIES = {
  reminder:    { label: 'Service Reminder', color: 'badge-blue' },
  promo:       { label: 'Promotional',      color: 'badge-yellow' },
  maintenance: { label: 'Maintenance',      color: 'badge-green' },
  seasonal:    { label: 'Seasonal',         color: 'badge-red' },
  general:     { label: 'General',          color: 'badge-gray' },
};

function StatPill({ icon: Icon, label, value, tint, glow }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-canvas-border bg-gradient-to-b from-white to-[#f9fbff] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${glow} rounded-full blur-2xl opacity-50`} />
      <div className="relative flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl ${tint.bg} ${tint.text} flex items-center justify-center`}>
          <Icon className="w-5 h-5" strokeWidth={2.25} />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold text-ink tabular-nums leading-none mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function Marketing() {
  const [tab, setTab] = useState('compose');

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-canvas to-[#f9fbff] pb-32 lg:pb-12">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[20px] border border-canvas-border bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] p-6 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-accent-light text-[11px] font-bold uppercase tracking-[0.16em] mb-2">
                <Zap className="w-3.5 h-3.5" /> SMS Marketing
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Reach your customers instantly.</h1>
              <p className="text-sm text-white/70 mt-2 max-w-xl">Send targeted SMS blasts to your entire customer base, filtered by city, service frequency, or hand-picked.</p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1.5">
              <Sparkles className="w-8 h-8 text-accent-light" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-canvas rounded-2xl border border-canvas-border w-fit">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.25} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'compose'   && <ComposeTab onSent={() => setTab('campaigns')} />}
        {tab === 'campaigns' && <CampaignsTab />}
        {tab === 'templates' && <TemplatesTab />}
      </div>
    </div>
  );
}

// ===== COMPOSE TAB =====
function ComposeTab({ onSent }) {
  const [campaignName, setCampaignName] = useState('');
  const [body, setBody] = useState('');
  const [audienceType, setAudienceType] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState({ cities: [], frequencies: [], customer_ids: [] });
  const [scheduledFor, setScheduledFor] = useState('');
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const chars = body.length;
  const segments = Math.ceil(chars / 160) || 1;

  // Re-preview audience whenever type or filter changes
  useEffect(() => {
    let cancelled = false;
    setLoadingPreview(true);
    setError('');
    apiPost('/api/marketing/audience/preview', { type: audienceType, filter: audienceFilter })
      .then(data => { if (!cancelled) setPreview(data); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoadingPreview(false); });
    return () => { cancelled = true; };
  }, [audienceType, JSON.stringify(audienceFilter)]);

  const send = async () => {
    if (!campaignName.trim()) { setError('Give your campaign a name'); return; }
    if (!body.trim()) { setError('Write a message'); return; }
    if (!preview || preview.count === 0) { setError('No recipients match this audience'); return; }
    setSending(true); setError(''); setSuccess('');
    try {
      const campaign = await apiPost('/api/marketing/campaigns', {
        name: campaignName,
        body,
        audience_type: audienceType,
        audience_filter: audienceFilter,
        scheduled_for: scheduledFor || null,
      });
      const result = await apiPost(`/api/marketing/campaigns/${campaign.id}/send`, {});
      setSuccess(`Sent to ${result.sent} recipient${result.sent === 1 ? '' : 's'}.`);
      setCampaignName('');
      setBody('');
      setScheduledFor('');
      setTimeout(() => onSent?.(), 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Left: composer */}
      <div className="xl:col-span-2 space-y-5">
        {/* Campaign name */}
        <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Campaign name</label>
          <input
            value={campaignName}
            onChange={e => setCampaignName(e.target.value)}
            placeholder="e.g. June Maintenance Reminder"
            className="input"
          />
        </div>

        {/* Audience picker */}
        <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Audience</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {[
              { value: 'all',         label: 'All Customers', icon: Users },
              { value: 'by_city',     label: 'By City',       icon: MapPin },
              { value: 'by_frequency', label: 'By Frequency', icon: RefreshCw },
              { value: 'manual',      label: 'Pick Specific', icon: Check },
            ].map(opt => {
              const Icon = opt.icon;
              const active = audienceType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { setAudienceType(opt.value); setAudienceFilter({ cities: [], frequencies: [], customer_ids: [] }); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    active ? 'border-accent bg-accent-light text-accent' : 'border-canvas-border text-ink-muted hover:border-ink-subtle hover:text-ink'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {audienceType === 'by_city' && preview?.customers && (
            <div>
              <div className="text-xs text-ink-muted mb-2">Select cities</div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {[...new Set(preview.customers.map(c => c.city).filter(Boolean))].sort().map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      const next = audienceFilter.cities.includes(city)
                        ? audienceFilter.cities.filter(c => c !== city)
                        : [...audienceFilter.cities, city];
                      setAudienceFilter({ ...audienceFilter, cities: next });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      audienceFilter.cities.includes(city)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-ink-muted border-canvas-border hover:border-accent hover:text-accent'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {audienceType === 'by_frequency' && (
            <div className="flex flex-wrap gap-1.5">
              {FREQ_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const next = audienceFilter.frequencies.includes(opt.value)
                      ? audienceFilter.frequencies.filter(f => f !== opt.value)
                      : [...audienceFilter.frequencies, opt.value];
                    setAudienceFilter({ ...audienceFilter, frequencies: next });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    audienceFilter.frequencies.includes(opt.value)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-ink-muted border-canvas-border hover:border-accent hover:text-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message */}
        <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Hi {business_name}! Your grease trap service is due this month. Reply YES to book. — Grease Trappers"
            rows={6}
            className="input font-sans"
            maxLength={480}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="font-mono">Use <code className="px-1 py-0.5 bg-canvas rounded text-ink">{'{business_name}'}</code> or <code className="px-1 py-0.5 bg-canvas rounded text-ink">{'{contact_name}'}</code> to personalize</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={`tabular-nums font-semibold ${chars > 160 ? 'text-amber-600' : 'text-ink-muted'}`}>
                {chars}/160
              </span>
              <span className="text-ink-muted">
                {segments} SMS segment{segments === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule + send */}
        <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Schedule</label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={e => setScheduledFor(e.target.value)}
                className="input max-w-xs"
              />
              <p className="text-xs text-ink-muted mt-2">Leave blank to send immediately.</p>
            </div>
            <button
              onClick={send}
              disabled={sending || !preview || preview.count === 0}
              className="btn-primary !py-3 !px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> {scheduledFor ? 'Schedule Campaign' : 'Send Now'}</>}
            </button>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}
        </div>
      </div>

      {/* Right: live preview */}
      <div className="xl:col-span-1 space-y-5">
        {/* Recipients summary */}
        <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-ink">Recipients</h3>
            {loadingPreview && <RefreshCw className="w-3.5 h-3.5 animate-spin text-ink-subtle" />}
          </div>
          <div className="text-4xl font-bold text-ink tabular-nums leading-none">
            {preview ? preview.count : '···'}
          </div>
          <div className="text-xs text-ink-muted mt-1">
            {preview?.count === 1 ? 'customer will receive this message' : 'customers will receive this message'}
          </div>
          {preview?.customers && preview.customers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-canvas-border space-y-2 max-h-48 overflow-y-auto">
              {preview.customers.slice(0, 8).map(c => (
                <div key={c.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {c.business_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-ink truncate text-xs">{c.business_name}</div>
                    <div className="text-[11px] text-ink-muted truncate">{c.city}{c.service_frequency ? ` · ${c.service_frequency}` : ''}</div>
                  </div>
                </div>
              ))}
              {preview.customers.length > 8 && (
                <div className="text-[11px] text-ink-muted text-center pt-2">
                  + {preview.customers.length - 8} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* SMS preview (iPhone-style) */}
        <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> SMS Preview
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 p-3">
            <div className="bg-black rounded-xl p-3 min-h-[160px] flex flex-col">
              <div className="text-[10px] text-white/40 text-center mb-3">Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="flex-1 flex flex-col justify-end">
                {body ? (
                  <div className="bg-gradient-to-br from-accent to-blue-600 text-white rounded-2xl rounded-bl-md px-3 py-2 max-w-[90%] self-start text-sm leading-snug shadow-sm">
                    {body.replace(/\{business_name\}/g, preview?.customers?.[0]?.business_name || '{business_name}').replace(/\{contact_name\}/g, preview?.customers?.[0]?.contact_name || '{contact_name}')}
                  </div>
                ) : (
                  <div className="text-white/30 text-xs italic self-start">Your message will appear here…</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CAMPAIGNS TAB =====
function CampaignsTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([
        apiGet('/api/marketing/campaigns'),
        apiGet('/api/marketing/stats'),
      ]);
      setCampaigns(c);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('Delete this draft campaign?')) return;
    try {
      await apiDelete(`/api/marketing/campaigns/${id}`);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatPill icon={MessageSquare} label="Total Campaigns" value={stats.campaigns_total || 0} tint={{ bg: 'bg-accent-light', text: 'text-accent' }} glow="bg-accent" />
          <StatPill icon={Users}         label="Recipients"      value={stats.recipients_total || 0} tint={{ bg: 'bg-emerald-50', text: 'text-success' }} glow="bg-emerald-500" />
          <StatPill icon={Send}          label="Messages Sent"   value={stats.sent_total || 0} tint={{ bg: 'bg-violet-50', text: 'text-violet-600' }} glow="bg-violet-500" />
          <StatPill icon={Calendar}      label="Last 30 Days"    value={stats.last_30_days || 0} tint={{ bg: 'bg-amber-50', text: 'text-amber-600' }} glow="bg-amber-500" />
        </div>
      )}

      {/* Campaigns table */}
      <div className="card overflow-hidden bg-gradient-to-b from-white to-[#f9fbff]">
        <div className="flex items-center justify-between p-5 border-b border-canvas-border">
          <div>
            <h3 className="text-base font-bold text-ink">All Campaigns</h3>
            <p className="text-xs text-ink-muted mt-0.5">Sent, scheduled, and draft SMS campaigns</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-ink-muted">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-canvas mx-auto flex items-center justify-center mb-3">
              <MessageSquare className="w-7 h-7 text-ink-subtle" />
            </div>
            <p className="text-sm font-semibold text-ink">No campaigns yet</p>
            <p className="text-xs text-ink-muted mt-0.5">Head to the Compose tab to send your first SMS blast.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Audience</th>
                  <th>Recipients</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="font-semibold text-ink">{c.name}</div>
                      <div className="text-xs text-ink-muted truncate max-w-xs">{c.body}</div>
                    </td>
                    <td><span className="badge badge-gray capitalize">{c.audience_type.replace('_', ' ')}</span></td>
                    <td className="font-semibold tabular-nums">{c.recipient_count || 0}</td>
                    <td>
                      <span className={`badge ${
                        c.status === 'sent' ? 'badge-green' :
                        c.status === 'scheduled' ? 'badge-blue' :
                        c.status === 'sending' ? 'badge-yellow' :
                        c.status === 'failed' ? 'badge-red' :
                        'badge-gray'
                      }`}>{c.status}</span>
                    </td>
                    <td className="text-xs text-ink-muted">{c.sent_at ? new Date(c.sent_at).toLocaleString() : '—'}</td>
                    <td className="text-xs text-ink-muted">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-right">
                      {['draft', 'scheduled', 'failed'].includes(c.status) && (
                        <button onClick={() => del(c.id)} className="btn-ghost !p-1.5 text-danger">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== TEMPLATES TAB =====
function TemplatesTab() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/marketing/templates').then(setTemplates).finally(() => setLoading(false));
  }, []);

  const grouped = templates.reduce((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  const copy = (body) => {
    navigator.clipboard?.writeText(body);
  };

  return (
    <div className="space-y-5">
      <div className="card p-5 bg-gradient-to-b from-white to-[#f9fbff]">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-bold text-ink">Message Templates</h3>
        </div>
        <p className="text-sm text-ink-muted">Quick-start messages. Copy and customize for your campaign.</p>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-ink-muted">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge ${TEMPLATE_CATEGORIES[cat]?.color || 'badge-gray'}`}>
                {TEMPLATE_CATEGORIES[cat]?.label || cat}
              </span>
              <span className="text-xs text-ink-muted">{items.length} template{items.length === 1 ? '' : 's'}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {items.map(t => (
                <div key={t.id} className="card p-4 bg-gradient-to-b from-white to-[#f9fbff] hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-ink">{t.name}</h4>
                    <button onClick={() => copy(t.body)} className="btn-ghost !p-1.5" aria-label="Copy">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-ink-muted leading-relaxed">{t.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}