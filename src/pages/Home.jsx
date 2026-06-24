import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, ShieldCheck, Clock, Award, Truck, FileCheck,
  ArrowRight, Check, Star, Phone, Calendar
} from 'lucide-react';
import { PHONE } from '../config/brand';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-pink opacity-20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-gold opacity-15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available 24/7 for emergencies
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              New Jersey's Most Trusted
              <span className="block bg-gradient-to-r from-brand-pink to-pink-300 bg-clip-text text-transparent">
                Grease Trap Specialists
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Restaurant-grade grease trap cleaning, pumping, and FOG compliance
              for commercial kitchens. Same-day emergency response. NJDEP-licensed
              and fully insured.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 bg-brand-pink text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {PHONE}
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> No contracts</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> NJDEP licensed</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> Fully insured</div>
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/30 to-brand-gold/20 rounded-3xl blur-2xl" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
              <Stat icon={<Calendar className="w-6 h-6" />} label="Scheduled service" value="500+" unit="tanks maintained monthly" />
              <Stat icon={<Clock className="w-6 h-6" />} label="Emergency response" value="< 2hr" unit="across all of NJ" />
              <Stat icon={<Star className="w-6 h-6" />} label="Customer rating" value="4.9/5" unit="based on 200+ reviews" />
              <Stat icon={<ShieldCheck className="w-6 h-6" />} label="Compliance" value="100%" unit="NJDEP documentation" />
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Full-service grease trap management
            </h2>
            <p className="text-gray-600">
              From routine pumping to emergency unblocks, we keep your kitchen
              compliant and your drains flowing.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ServiceCard
              icon={<Droplets className="w-7 h-7" />}
              title="Grease Trap Pumping"
              desc="Scheduled or on-demand cleaning for indoor and outdoor traps of any size. Full pump-out, scraping, and rinse."
            />
            <ServiceCard
              icon={<Truck className="w-7 h-7" />}
              title="Grease Collection"
              desc="Used cooking oil and yellow grease pickup. We buy it or haul it — your choice. Sealed transfer, no spills."
            />
            <ServiceCard
              icon={<FileCheck className="w-7 h-7" />}
              title="FOG Compliance"
              desc="NJDEP manifest documentation, interceptor inspections, and municipal FOG program compliance."
            />
            <ServiceCard
              icon={<ShieldCheck className="w-7 h-7" />}
              title="Line Jetting"
              desc="High-pressure hydro-jetting for clogged drain lines, laterals, and grease-laden sewer pipes."
            />
            <ServiceCard
              icon={<Clock className="w-7 h-7" />}
              title="24/7 Emergency"
              desc="Backups, overflows, and after-hours emergencies. Real human dispatch — no phone trees."
            />
            <ServiceCard
              icon={<Award className="w-7 h-7" />}
              title="Maintenance Plans"
              desc="Monthly, quarterly, or custom schedules. Predictable pricing, priority service, and zero missed cleanings."
            />
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-brand-pink font-semibold hover:gap-3 transition-all"
            >
              See all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              How it works
            </h2>
            <p className="text-gray-600">
              Three steps from quote to clean trap. Most jobs scheduled within
              48 hours.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Step n={1} title="Tell us about your trap" desc="Submit a quote request or call us. We'll need the trap size, location, and current service schedule." />
            <Step n={2} title="Get a fixed quote" desc="Flat-rate pricing based on trap size and frequency. No surprise fees. Quotes in under 2 hours during business hours." />
            <Step n={3} title="We handle everything" desc="We arrive on schedule, do the work, leave manifests for your files. Pay online or net-30 for businesses." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-pink to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Ready to get on the schedule?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Free quotes. Same-day emergency service. NJ's most-trusted grease
            trap company is one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-pink px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Request Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 px-6 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call {PHONE}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, label, value, unit }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-pink to-pink-400 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-gray-400 mb-0.5">
          {label}
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-gray-400">{unit}</div>
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-brand-pink hover:shadow-xl transition-all">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-pink/10 to-pink-100 text-brand-pink flex items-center justify-center mb-4 group-hover:from-brand-pink group-hover:to-pink-500 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="relative">
      <div className="text-7xl font-display font-bold text-brand-pink/20 leading-none mb-2">
        {String(n).padStart(2, '0')}
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}