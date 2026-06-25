import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Droplets, ShieldCheck, Clock, Award, Truck, FileCheck, Wrench, ArrowRight,
  Check, Star, Phone, Calendar, Users, Building2, Menu, Lock, Sparkles, ArrowUpRight
} from 'lucide-react';
import { PHONE, HERO_IMAGE } from '../config/brand';
import SEO from '../components/SEO';

// ============================================================
// MOTION — scroll-reveal variants (respects prefers-reduced-motion)
// ============================================================
const EASE = [0.22, 1, 0.36, 1];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const popVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// Reveal a single block as it scrolls into view
function Reveal({ children, className, variant = fadeUpVariant, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={variant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger a grid/group of children as the container enters view
function RevealGroup({ children, className, as: Tag = motion.div }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <Tag
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </Tag>
  );
}

// A child item inside a RevealGroup
function Item({ children, className, variant = fadeUpVariant }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={variant}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      <SEO
        title="NJ Grease Trap Cleaning & Pumping"
        description="Licensed grease trap pumping, cleaning, maintenance, installation and 24/7 emergency service throughout New Jersey, NYC & Pennsylvania. NJDEP compliant. Fully insured. Call (888) 982-1989 for a free quote."
        canonical="/"
      />
      {/* ============================================================
          HERO — RESPONSIVE: desktop split, mobile stacked
          - Desktop (md+): copy on left, floating image card on right
          - Mobile (<md): full-bleed background image, stacked layout
          ============================================================ */}
      <section className="relative w-full overflow-hidden bg-black">
        {/* DESKTOP HERO: full-bleed image with left-side darken for text legibility */}
        <div className="hidden md:block relative min-h-[700px]">
          {/* Full-width background image */}
          <img
            src={HERO_IMAGE}
            alt="The Grease Trappers crew servicing a NJ restaurant grease trap"
            className="absolute inset-0 w-full h-full object-cover animate-zoom-hero"
            loading="eager"
            fetchpriority="high"
          />
          {/* Left-side darken: ~50% width gradient, fully transparent on the right so the photo stays vivid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 75%)',
            }}
          />
          {/* Subtle warm bronze glow upper-left */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-copper/40 rounded-full blur-[120px] pointer-events-none" />

          {/* Content sits directly over the image (no left/right grid columns) */}
          <div className="relative z-10 max-w-7xl mx-auto px-10 lg:px-16 xl:px-20 py-20">
            <div className="max-w-2xl">
              <div className="animate-fade-up">
                <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium text-white">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  AVAILABLE 24/7 FOR EMERGENCIES
                </div>
              </div>

              <h1 className="mt-8 font-display font-extrabold text-white text-4xl lg:text-5xl xl:text-[3.5rem] leading-[1.05] tracking-tight animate-fade-up-delay-1">
                Commercial{' '}
                <span className="text-brand-gold">Grease Trap</span>{' '}
                Cleaning That Restaurants Can Count On
              </h1>

              <p className="mt-6 text-base lg:text-lg text-gray-200 max-w-[540px] leading-relaxed animate-fade-up-delay-2">
                Licensed grease trap pumping, cleaning, maintenance and emergency service for restaurants throughout New Jersey.
              </p>

              <div className="mt-8 flex flex-row gap-3 animate-fade-up-delay-3">
                <Link
                  to="/quote"
                  className="group inline-flex items-center gap-3 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-copper/50"
                  style={{
                    background: 'linear-gradient(135deg, #B97832 0%, #8C5523 50%, #6E3F1A 100%)',
                    boxShadow: '0 10px 30px -10px rgba(140, 85, 35, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <span>Get Free Quote</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
                <a
                  href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold text-base px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  <Phone className="w-5 h-5" />
                  Call {PHONE}
                </a>
              </div>

              {/* Service badges — row of 3 glass tiles under the buttons */}
              <div className="mt-6 flex flex-row gap-3 animate-fade-up-delay-4">
                <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white">
                  <Clock className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-semibold">Same-Day Service</span>
                </div>
                <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-semibold">Licensed & Insured</span>
                </div>
                <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-semibold">NJDEP Compliant</span>
                </div>
              </div>

              {/* Trust strip — overlaid inside the hero, bottom-left */}
              <div className="mt-10 animate-fade-up-delay-5">
                <div className="flex flex-col gap-2 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex text-brand-gold">
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-sm lg:text-base font-medium">Trusted by restaurants throughout New Jersey</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-300 flex flex-row gap-x-3">
                    <span>NJDEP Licensed</span><span>•</span>
                    <span>Fully Insured</span><span>•</span>
                    <span>Emergency Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE HERO: full-bleed background image, stacked */}
        <div className="md:hidden relative min-h-screen">
          {/* Background image with slow zoom */}
          <div className="absolute inset-0 animate-zoom-hero">
            <img
              src={HERO_IMAGE}
              alt="The Grease Trappers crew servicing a NJ restaurant grease trap"
              className="w-full h-full object-cover object-[center_30%] scale-110"
              loading="eager"
              fetchpriority="high"
            />
          </div>
          {/* Cinematic left-to-right overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/20" />
          {/* Subtle warm bronze glow upper-left */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-copper/35 rounded-full blur-[120px]" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 to-transparent" />

          {/* Mobile content */}
          <div className="relative z-10 flex flex-col min-h-screen px-6 pt-28 pb-8">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-5 py-2.5 text-xs font-medium text-white shadow-lg shadow-black/20">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                AVAILABLE 24/7 FOR EMERGENCIES
              </div>
            </div>

            <h1 className="mt-8 font-display font-extrabold text-white text-[2.75rem] leading-[1.05] tracking-tight animate-fade-up-delay-1">
              Commercial{' '}
              <span className="text-brand-gold">Grease Trap</span>{' '}
              Cleaning That Restaurants Can Count On
            </h1>

            <p className="mt-6 text-base text-gray-200 leading-relaxed animate-fade-up-delay-2">
              Licensed grease trap pumping, cleaning, maintenance, installation and emergency service throughout New Jersey.<br />
              Fast response.<br />
              Fully insured.<br />
              NJDEP compliant.
            </p>

            <div className="mt-10 animate-fade-up-delay-3">
              <Link
                to="/quote"
                className="group flex items-center justify-center gap-3 w-full text-white font-bold text-base px-8 py-4 rounded-2xl transition-all duration-300 active:translate-y-0 active:shadow-lg"
                style={{
                  minHeight: '56px',
                  background: 'linear-gradient(135deg, #B97832 0%, #8C5523 50%, #6E3F1A 100%)',
                  boxShadow: '0 10px 30px -10px rgba(140, 85, 35, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                }}
              >
                <span>Get Free Quote</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>

            <div className="mt-4 animate-fade-up-delay-3">
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="flex items-center justify-center gap-2 w-full bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all"
                style={{ minHeight: '56px' }}
              >
                <Phone className="w-5 h-5" />
                Call {PHONE}
              </a>
            </div>

            <div className="flex-1 min-h-[48px]" />

            <div className="animate-fade-up-delay-4">
              <div className="flex flex-col items-center text-center gap-3.5 mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex text-brand-gold">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-sm font-semibold text-white">Trusted by restaurants throughout New Jersey</span>
                </div>
                <div className="text-xs text-gray-300 flex flex-wrap gap-x-3 gap-y-1 justify-center">
                  <span>NJDEP Licensed</span><span>•</span>
                  <span>Fully Insured</span><span>•</span>
                  <span>Emergency Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICE CARDS — 3 equal-width glass cards, one row
          ============================================================ */}
      <section className="bg-[#0D0D0D] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <RevealGroup className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <Item variant={popVariant} className="h-full">
            <ServiceCard
              icon={<Clock className="w-10 h-10 sm:w-12 sm:h-12" />}
              title="Same-Day Service"
              desc="We show up when you need us most."
            />
          </Item>
          <Item variant={popVariant} className="h-full">
            <ServiceCard
              icon={<ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />}
              title="Licensed & Insured"
              desc="Fully licensed, fully insured for your peace of mind."
            />
          </Item>
          <Item variant={popVariant} className="h-full">
            <ServiceCard
              icon={<Droplets className="w-10 h-10 sm:w-12 sm:h-12" />}
              title="NJDEP Compliant"
              desc="We follow all NJDEP guidelines and regulations."
            />
          </Item>
        </RevealGroup>
      </section>

      {/* ============================================================
          STATS — dark glass container, 2x2 on mobile, 1x4 on desktop
          ============================================================ */}
      <section className="bg-[#0D0D0D] px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
        <Reveal className="max-w-7xl mx-auto bg-white/[0.03] backdrop-blur border border-brand-copper/20 rounded-3xl p-6 sm:p-10">
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-8">
            <Item variant={popVariant}><Stat icon={<Calendar className="w-7 h-7 sm:w-9 sm:h-9" />} value="2008" label="Founded" /></Item>
            <Item variant={popVariant}><Stat icon={<Users className="w-7 h-7 sm:w-9 sm:h-9" />} value="2,500+" label="Restaurants Served" /></Item>
            <Item variant={popVariant}><Stat icon={<Clock className="w-7 h-7 sm:w-9 sm:h-9" />} value="24/7" label="Emergency Response" /></Item>
            <Item variant={popVariant}><Stat icon={<Building2 className="w-7 h-7 sm:w-9 sm:h-9" />} value="100%" label="Commercial Kitchens" /></Item>
          </RevealGroup>
        </Reveal>
      </section>

      {/* ============================================================
          SERVICES GRID
          ============================================================ */}
      <section className="py-20 sm:py-24 bg-[#0D0D0D] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-3 font-semibold">What we do</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Full-Service Grease Trap Management
            </h2>
            <p className="text-lg text-gray-400">
              From routine pumping to emergency unblocks, we keep your kitchen compliant and your drains flowing.
            </p>
          </Reveal>
          <RevealGroup className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            <Item className="h-full">
              <FeatureCard
                icon={Droplets}
                accent="from-brand-copper to-brand-sienna"
                title="Grease Trap Pumping"
                desc="Scheduled or on-demand cleaning for indoor and outdoor traps of any size."
                features={['Full pump-out', 'Scraping & rinse', 'Indoor & outdoor', 'Any size']}
              />
            </Item>
            <Item className="h-full">
              <FeatureCard
                icon={Truck}
                accent="from-amber-500 to-orange-600"
                title="Grease Collection"
                desc="Used cooking oil and yellow grease pickup. We buy it or haul it."
                features={['We buy or haul', 'Sealed transfer', 'No spills', 'Recycled properly']}
              />
            </Item>
            <Item className="h-full">
              <FeatureCard
                icon={FileCheck}
                accent="from-emerald-500 to-teal-600"
                title="FOG Compliance"
                desc="NJDEP manifest documentation, interceptor inspections, and municipal FOG programs."
                features={['NJDEP manifests', 'Municipal FOG', 'Interceptors', 'Audit-ready']}
              />
            </Item>
            <Item className="h-full">
              <FeatureCard
                icon={Wrench}
                accent="from-sky-500 to-blue-600"
                title="Line Jetting"
                desc="High-pressure hydro-jetting for clogged drains, laterals, and grease-laden sewer pipes."
                features={['Hydro-jetting', 'Drain lines', 'Sewer laterals', 'Cleared fast']}
              />
            </Item>
            <Item className="h-full">
              <FeatureCard
                icon={Clock}
                accent="from-rose-500 to-red-600"
                title="24/7 Emergency"
                desc="Backups, overflows, and after-hours emergencies. Real human dispatch — no phone trees."
                features={['24/7 dispatch', 'No phone trees', 'Real humans', 'Fast response']}
              />
            </Item>
            <Item className="h-full">
              <FeatureCard
                icon={Award}
                accent="from-violet-500 to-purple-600"
                title="Maintenance Plans"
                desc="Monthly, quarterly, or custom schedules. Predictable pricing and priority service."
                features={['Monthly / quarterly', 'Flat-rate pricing', 'Priority service', 'Locked-in rates']}
              />
            </Item>
          </RevealGroup>
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

      {/* ============================================================
          HOW IT WORKS
          ============================================================ */}
      <section className="py-20 sm:py-24 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-3 font-semibold">How it works</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Three steps. That's it.
            </h2>
            <p className="text-lg text-gray-400">
              From quote to clean trap. Most jobs scheduled within 48 hours.
            </p>
          </Reveal>
          <RevealGroup className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            <Item><Step n={1} title="Tell us about your trap" desc="Submit a quote request or call us. We'll need the trap size, location, and current service schedule." /></Item>
            <Item><Step n={2} title="Get a fixed quote" desc="Flat-rate pricing based on trap size and frequency. No surprise fees. Quotes in under 2 hours during business hours." /></Item>
            <Item><Step n={3} title="We handle everything" desc="We arrive on schedule, do the work, leave manifests for your files. Pay online or net-30 for businesses." /></Item>
          </RevealGroup>
        </div>
      </section>

      {/* ============================================================
          CTA
          ============================================================ */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-brand-copper via-brand-sienna to-brand-bronze text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-champagne rounded-full blur-3xl" />
        </div>
        <Reveal className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Ready to get on the schedule?
          </h2>
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto">
            Free quotes. Same-day emergency service. NJ's most-trusted grease trap company is one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-900 transition-all hover:-translate-y-0.5"
              style={{ minHeight: '56px' }}
            >
              Request Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border-2 border-white/40 px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all"
              style={{ minHeight: '56px' }}
            >
              <Phone className="w-5 h-5" />
              Call {PHONE}
            </a>
          </div>
          <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-full pl-2 pr-5 py-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-copper">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm text-white/90">Existing customer?</span>
            <a
              href="https://grease-trappers-admin-v2.onrender.com/login"
              className="text-sm font-bold text-white underline-offset-4 hover:underline flex items-center gap-1"
            >
              Sign in to your account
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

// ============================================================
// SERVICE CARD — glassmorphism, equal width, large icon + title + desc
// ============================================================
function ServiceCard({ icon, title, desc }) {
  return (
    <div className="group h-full bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 text-center hover:border-brand-gold/50 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-brand-copper/20 hover:-translate-y-1 transition-all duration-300">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-copper/15 text-brand-gold mb-5 group-hover:bg-brand-copper group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

// ============================================================
// STAT — large number, supporting label
// ============================================================
function Stat({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
      <div className="text-brand-gold">{icon}</div>
      <div className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-none">{value}</div>
      <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  );
}

// ============================================================
// FEATURE CARD — services grid (redesigned)
// ============================================================
function FeatureCard({ icon: Icon, accent, title, desc, features = [] }) {
  return (
    <div className="group relative h-full flex flex-col p-7 sm:p-8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur border border-white/10 rounded-2xl hover:border-brand-gold/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-copper/20 transition-all duration-300 overflow-hidden">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Background glow on hover */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

      {/* Icon */}
      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>

      {/* Title + desc */}
      <h3 className="relative font-bold text-xl text-white mb-2 group-hover:text-brand-gold transition-colors">
        {title}
      </h3>
      <p className="relative text-sm text-gray-400 leading-relaxed mb-5">
        {desc}
      </p>

      {/* Feature pills */}
      {features.length > 0 && (
        <ul className="relative space-y-2 mb-5">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${accent} flex items-center justify-center`}>
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* Bottom CTA row */}
      <div className="relative mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-brand-gold transition-colors">
          Learn more
        </span>
        <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-brand-copper flex items-center justify-center transition-all">
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:rotate-45 transition-all" />
        </span>
      </div>
    </div>
  );
}

// ============================================================
// STEP — how it works
// ============================================================
function Step({ n, title, desc }) {
  return (
    <div className="relative text-center sm:text-left">
      <div className="text-7xl sm:text-8xl font-display font-extrabold text-brand-copper/30 leading-none mb-2">
        {String(n).padStart(2, '0')}
      </div>
      <h3 className="font-bold text-lg text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}