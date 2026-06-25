import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Send, Loader2, Phone, Mail, MapPin, User, Building2,
  Droplets, Calendar, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Clock,
  AlertCircle, Ruler, Truck, Wrench, Zap, FileCheck
} from 'lucide-react';
import { API_URL, PHONE } from '../config/brand';
import SEO from '../components/SEO';

const SERVICE_FREQUENCIES = [
  { id: 'one_time',   label: 'One-Time',       icon: Wrench,    desc: 'Single visit' },
  { id: 'weekly',     label: 'Weekly',         icon: Calendar,  desc: 'High volume' },
  { id: 'biweekly',   label: 'Every 2 Weeks',  icon: Calendar,  desc: 'Busy kitchens' },
  { id: 'monthly',    label: 'Monthly',        icon: Calendar,  desc: 'Standard' },
  { id: 'quarterly',  label: 'Quarterly',      icon: Calendar,  desc: 'Most popular' },
  { id: 'other',      label: 'Not Sure',       icon: Sparkles,  desc: 'We recommend' },
];

const STEPS = [
  { num: 1, title: 'Business', icon: Building2 },
  { num: 2, title: 'Service',  icon: Droplets },
  { num: 3, title: 'Done',     icon: CheckCircle2 },
];

export default function Quote() {
  const [step, setStep] = useState(1);
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
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  const update = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setTouched({ ...touched, [k]: true });
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isValidPhone = form.phone.replace(/\D/g, '').length >= 10;

  const step1Valid = form.business_name && form.name && isValidEmail && isValidPhone;
  const step2Valid = form.city;

  const submit = async () => {
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
          message: [form.address, form.city, form.state, form.message].filter(Boolean).join(', '),
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to submit');
      }
      setStep(3);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEO
          title="Quote Request Received | The Grease Trappers, LLC"
          description="Thank you — we'll be in touch within 2 business hours with your NJ grease trap service quote."
          canonical="/quote?submitted=1"
          robots="noindex"
        />
        <section className="min-h-[90vh] bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-copper rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/50"
            >
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              You're all set!
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Quote received. We'll review and respond within{' '}
              <span className="text-brand-gold font-semibold">2 business hours</span>.
            </p>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-brand-copper/50 transition-colors">
                <Clock className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                <div className="text-xs text-gray-400">Response</div>
                <div className="text-sm font-semibold text-white">2 hrs</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-brand-copper/50 transition-colors">
                <ShieldCheck className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                <div className="text-xs text-gray-400">Guarantee</div>
                <div className="text-sm font-semibold text-white">Flat rate</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-brand-copper/50 transition-colors">
                <Zap className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                <div className="text-xs text-gray-400">Urgency</div>
                <div className="text-sm font-semibold text-white">Same day</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-copper to-brand-sienna text-white px-7 py-4 rounded-xl font-semibold text-base md:text-lg hover:shadow-2xl hover:shadow-brand-copper/40 transition-all active:scale-95"
              >
                <Phone className="w-5 h-5" />
                Call {PHONE}
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-7 py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-white/20 transition-all active:scale-95"
              >
                Back to home
              </a>
            </div>

            <p className="text-xs text-gray-500 mt-8">
              For emergencies, call now — we answer 24/7.
            </p>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Free Quote | NJ Grease Trap Cleaning Service"
        description="Request a free quote for grease trap cleaning, pumping, FOG compliance or emergency service in NJ, NYC or PA. Same-day response. No obligation."
        canonical="/quote"
        keywords={[
          'grease trap quote NJ',
          'free quote grease trap',
          'NJ grease trap estimate',
          'request grease trap service',
        ]}
      />

      {/* HERO with animated background */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-20 md:pt-28 pb-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-copper rounded-full filter blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold rounded-full filter blur-3xl opacity-60 animate-pulse-glow"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase">Free Quote — No Obligation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.05]"
          >
            Get a quote in
            <span className="block bg-gradient-to-r from-brand-copper via-brand-gold to-brand-champagne bg-clip-text text-transparent">
              under 2 hours
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Tell us about your kitchen. Flat-rate pricing, no hidden fees, no spam.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-gray-400"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-gold" /> NJDEP Licensed</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-gold" /> 24/7 Service</span>
            <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4 text-brand-gold" /> Fully Insured</span>
          </motion.div>
        </div>
      </section>

      {/* FORM CARD — overlaps hero */}
      <section className="relative -mt-20 md:-mt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress stepper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = step === s.num;
                const isComplete = step > s.num;
                return (
                  <React.Fragment key={s.num}>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full font-bold text-sm transition-all ${
                        isComplete ? 'bg-green-500 text-white' :
                        isActive ? 'bg-gradient-to-br from-brand-copper to-brand-sienna text-white shadow-lg shadow-brand-copper/40' :
                        'bg-white/10 text-gray-400'
                      }`}>
                        {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4 md:w-5 md:h-5" />}
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Step {s.num}</div>
                        <div className={`text-sm font-semibold ${isActive ? 'text-white' : isComplete ? 'text-green-400' : 'text-gray-500'}`}>
                          {s.title}
                        </div>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 md:mx-3 rounded transition-colors ${step > s.num ? 'bg-green-500' : 'bg-white/10'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-6 md:p-10 lg:p-12"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your business</h2>
                    <p className="text-gray-500">We'll use this to send your quote.</p>
                  </div>

                  <Field label="Business name" required icon={Building2}>
                    <input
                      type="text"
                      required
                      value={form.business_name}
                      onChange={update('business_name')}
                      className={inputClass}
                      placeholder="Mario's Diner"
                      autoComplete="organization"
                    />
                  </Field>

                  <Field label="Your name" required icon={User}>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={update('name')}
                      className={inputClass}
                      placeholder="Jane Smith"
                      autoComplete="name"
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Phone" required icon={Phone} error={touched.phone && !isValidPhone ? 'Need 10 digits' : ''}>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={update('phone')}
                        className={inputClass}
                        placeholder="(973) 555-0100"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </Field>
                    <Field label="Email" required icon={Mail} error={touched.email && !isValidEmail ? 'Invalid email' : ''}>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={update('email')}
                        className={inputClass}
                        placeholder="jane@mariosdiner.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </Field>
                  </div>

                  <Field label="Service address" icon={MapPin}>
                    <input
                      type="text"
                      value={form.address}
                      onChange={update('address')}
                      className={inputClass}
                      placeholder="123 Main St"
                      autoComplete="street-address"
                    />
                  </Field>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Field label="City" required icon={MapPin}>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={update('city')}
                          className={inputClass}
                          placeholder="Newark"
                          autoComplete="address-level2"
                        />
                      </Field>
                    </div>
                    <Field label="State">
                      <select value={form.state} onChange={update('state')} className={inputClass}>
                        <option value="NJ">NJ</option>
                        <option value="NY">NY</option>
                        <option value="PA">PA</option>
                        <option value="CT">CT</option>
                      </select>
                    </Field>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!step1Valid}
                    className="w-full bg-gradient-to-r from-brand-copper to-brand-sienna text-white px-6 py-4 rounded-xl font-semibold text-base md:text-lg hover:shadow-xl hover:shadow-brand-copper/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">Service details</h2>
                    <p className="text-gray-500">Helps us give you an accurate quote.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      How often do you need service?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SERVICE_FREQUENCIES.map((f) => {
                        const Icon = f.icon;
                        const selected = form.service_frequency === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setForm({ ...form, service_frequency: f.id })}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all active:scale-95 ${
                              selected
                                ? 'border-brand-copper bg-gradient-to-br from-brand-copper/5 to-brand-gold/5 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {selected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-brand-copper rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                              </div>
                            )}
                            <Icon className={`w-5 h-5 mb-2 ${selected ? 'text-brand-copper' : 'text-gray-400'}`} />
                            <div className={`text-sm font-semibold ${selected ? 'text-gray-900' : 'text-gray-700'}`}>
                              {f.label}
                            </div>
                            <div className="text-xs text-gray-500">{f.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Trap size" icon={Ruler}>
                    <input
                      type="text"
                      value={form.trap_size}
                      onChange={update('trap_size')}
                      className={inputClass}
                      placeholder="e.g. 1000 gal indoor"
                    />
                  </Field>

                  <Field label="Anything else we should know?" icon={FileCheck}>
                    <textarea
                      value={form.message}
                      onChange={update('message')}
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Outdoor/indoor, access notes, current provider, etc."
                    />
                  </Field>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="sm:w-1/3 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting || !step2Valid}
                      className="flex-1 bg-gradient-to-r from-brand-copper to-brand-sienna text-white px-6 py-4 rounded-xl font-semibold text-base md:text-lg hover:shadow-xl hover:shadow-brand-copper/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-5 h-5" /> Get My Quote</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
              By submitting, you agree to be contacted by The Grease Trappers.
              <br className="hidden sm:block" />
              We never share your info. We respond within 2 business hours.
            </p>
          </motion.div>

          {/* Below-form reassurance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center text-sm text-gray-400"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> NJDEP compliant</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 24/7 dispatch</span>
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Statewide NJ</span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

const inputClass = 'w-full px-4 py-3.5 md:py-3 text-base md:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-copper focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400';

function Field({ label, required, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        {label}
        {required && <span className="text-brand-copper">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
