import React, { useState } from 'react';
import { CheckCircle, Send, Loader2, Phone } from 'lucide-react';
import { API_URL, PHONE } from '../config/brand';

export default function Quote() {
  const [form, setForm] = useState({
    business_name: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'NJ',
    trap_size: '',
    service_frequency: 'quarterly',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const r = await fetch(`${API_URL}/api/quote-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          business_name: form.business_name,
          trap_size: form.trap_size,
          service_frequency: form.service_frequency,
          message: [form.address, form.city, form.state, form.notes].filter(Boolean).join(', '),
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to submit');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quote request received!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We'll review your info and get back to you within 2 business hours.
            For emergencies, give us a call right now.
          </p>
          <a
            href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
            className="inline-flex items-center gap-2 bg-brand-copper text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-brand-sienna transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call {PHONE}
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-wider text-brand-gold mb-3 font-semibold">
              Free quote
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Get a quote in
              <span className="block bg-gradient-to-r from-brand-copper to-brand-champagne bg-clip-text text-transparent">
                under 2 hours
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Tell us about your kitchen and trap. We'll send a flat-rate quote
              with no hidden fees. No obligation, no spam.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={submit} className="space-y-8">
            <Section title="Your business">
              <Field label="Business name" required>
                <input type="text" required value={form.business_name} onChange={update('business_name')} className={inputClass} placeholder="Mario's Diner" />
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Contact name" required>
                  <input type="text" required value={form.name} onChange={update('name')} className={inputClass} placeholder="Jane Smith" />
                </Field>
                <Field label="Phone" required>
                  <input type="tel" required value={form.phone} onChange={update('phone')} className={inputClass} placeholder="(973) 555-0100" />
                </Field>
              </div>
              <Field label="Email" required>
                <input type="email" required value={form.email} onChange={update('email')} className={inputClass} placeholder="jane@mariosdiner.com" />
              </Field>
            </Section>

            <Section title="Location">
              <Field label="Street address">
                <input type="text" value={form.address} onChange={update('address')} className={inputClass} placeholder="123 Main St" />
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="City" required>
                  <input type="text" required value={form.city} onChange={update('city')} className={inputClass} placeholder="Newark" />
                </Field>
                <Field label="State">
                  <input type="text" value={form.state} onChange={update('state')} className={inputClass} placeholder="NJ" />
                </Field>
              </div>
            </Section>

            <Section title="Trap details">
              <Field label="Trap size (gallons)">
                <input type="text" value={form.trap_size} onChange={update('trap_size')} className={inputClass} placeholder="e.g. 1000 gal indoor" />
              </Field>
              <Field label="Service frequency">
                <select value={form.service_frequency} onChange={update('service_frequency')} className={inputClass}>
                  <option value="one_time">One-time only</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="weekly">Weekly</option>
                  <option value="other">Not sure — recommend for me</option>
                </select>
              </Field>
              <Field label="Anything else we should know?">
                <textarea value={form.message} onChange={update('message')} rows={4} className={inputClass} placeholder="Outdoor/indoor, access notes, current provider, etc." />
              </Field>
            </Section>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-copper text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-brand-sienna transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-5 h-5" /> Submit Quote Request</>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to be contacted by The Grease Trappers
              about your quote. We never share your info.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-copper focus:border-transparent';

function Section({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 space-y-4">
      <h2 className="font-semibold text-lg text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-brand-copper">*</span>}
      </label>
      {children}
    </div>
  );
}