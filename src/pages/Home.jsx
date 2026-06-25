import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, ShieldCheck, Clock, Award, Truck, FileCheck, Wrench,
  ArrowRight, Check, Star, Phone, Calendar, Users, AlertTriangle
} from 'lucide-react';
import { PHONE, HERO_IMAGE } from '../config/brand';

export default function Home() {
  return (
    <>
      {/* HERO — full-width 100vh with cinematic overlay */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black">
        {/* Background image with slow zoom */}
        <div className="absolute inset-0 animate-zoom-hero">
          <img
            src={HERO_IMAGE}
            alt="The Grease Trappers crew servicing a NJ restaurant grease trap"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />
        </div>
        {/* Cinematic left-to-right overlay (95% black → 15%) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/15" />
        {/* Subtle warm bronze glow upper-left */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-copper/40 rounded-full blur-[120px]" />

        {/* Hero content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-white mb-8 opacity-0 animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                AVAILABLE 24/7 FOR EMERGENCIES
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-white text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight mb-6 opacity-0 animate-fade-up-delay-1">
                Commercial{' '}
                <span className="text-brand-gold">Grease Trap</span>{' '}
                Cleaning That Restaurants Can Count On
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed opacity-0 animate-fade-up-delay-2">
                Licensed grease trap pumping, cleaning, maintenance, installation
                and emergency service throughout New Jersey. Fast response. Fully
                insured. NJDEP compliant.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 opacity-0 animate-fade-up-delay-3">
                <Link
                  to="/quote"
                  className="inline-flex items-center justify-center gap-2 bg-brand-copper hover:bg-brand-sienna text-white px-8 py-4 rounded-lg font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-copper/40"
                >
                  Get Free Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold text-base transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call {PHONE}
                </a>
              </div>

              {/* Service badges — 3 glass cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 opacity-0 animate-fade-up-delay-4">
                <Badge icon={<Clock className="w-5 h-5" />} title="Same-Day Service" />
                <Badge icon={<ShieldCheck className="w-5 h-5" />} title="Licensed & Insured" />
                <Badge icon={<FileCheck className="w-5 h-5" />} title="NJDEP Compliant" />
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex text-brand-gold">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="text-sm md:text-base font-medium">Trusted by restaurants throughout New Jersey</span>
            </div>
            <div className="text-xs md:text-sm text-gray-300 flex flex-wrap gap-x-4 gap-y-1 justify-center">
              <span>NJDEP Licensed</span><span>•</span>
              <span>Fully Insured</span><span>•</span>
              <span>Emergency Response</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — glass cards over dark background */}
      <section className="bg-[#0D0D0D] py-8 border-t border-brand-copper/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat icon={<Calendar className="w-6 h-6" />} value="2008" label="Founded" />
            <Stat icon={<Users className="w-6 h-6" />} value="2,500+" label="Restaurants Served" />
            <Stat icon={<AlertTriangle className="w-6 h-6" />} value="24/7" label="Emergency Response" />
            <Stat icon={<ShieldCheck className="w-6 h-6" />} value="100%" label="Commercial Kitchens" />
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 bg-[#0D0D0D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-3 font-semibold">What we do</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
              Full-Service Grease Trap Management
            </h2>
            <p className="text-lg text-gray-400">
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
              icon={<Wrench className="w-7 h-7" />}
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
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-brand-gold font-semibold hover:gap-3 transition-all"
            >
              See all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-3 font-semibold">How it works</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
              Three steps. That's it.
            </h2>
            <p className="text-lg text-gray-400">
              From quote to clean trap. Most jobs scheduled within 48 hours.
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
      <section className="py-24 bg-gradient-to-br from-brand-copper via-brand-sienna to-brand-bronze text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-champagne rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-6">
            Ready to get on the schedule?
          </h2>
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto">
            Free quotes. Same-day emergency service. NJ's most-trusted grease
            trap company is one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-gray-900 transition-all hover:-translate-y-0.5"
            >
              Request Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border-2 border-white/40 px-8 py-4 rounded-lg font-bold text-base hover:bg-white/20 transition-all"
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

function Badge({ icon, title }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 hover:bg-white/15 transition-colors">
      <div className="text-brand-gold flex-shrink-0">{icon}</div>
      <div className="text-white font-semibold text-sm leading-tight">{title}</div>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur border border-brand-copper/30 rounded-xl px-5 py-4 hover:border-brand-gold/60 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-brand-copper/20 text-brand-gold flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-extrabold text-white font-display">{value}</div>
        <div className="text-xs uppercase tracking-wider text-gray-400">{label}</div>
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="group p-8 bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl hover:border-brand-gold/60 hover:bg-white/[0.06] transition-all">
      <div className="w-14 h-14 rounded-xl bg-brand-copper/20 text-brand-gold flex items-center justify-center mb-5 group-hover:bg-brand-copper group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="relative">
      <div className="text-8xl font-display font-extrabold text-brand-copper/30 leading-none mb-2">
        {String(n).padStart(2, '0')}
      </div>
      <h3 className="font-bold text-lg text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}