import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Truck, FileCheck, ShieldCheck, Clock, Award, Wrench,
  ArrowRight, Check
} from 'lucide-react';
import { PHONE } from '../config/brand';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';

export default function Services() {
  const services = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: 'Grease Trap Pumping & Cleaning',
      short: 'Full pump-out of indoor & outdoor traps',
      items: [
        'Complete waste removal — no skim jobs',
        'Trap wall scraping and rinse',
        'Baffle inspection and cleaning',
        'Inlet/outlet flow verification',
        'Manifest documentation on completion',
      ],
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Used Cooking Oil & Yellow Grease Pickup',
      short: 'Buy-back or haul-away for your grease bins',
      items: [
        'Sealed transfer, zero mess',
        'Weighed and recorded for your records',
        'Buy-back credit available for qualifying volumes',
        'Compatible with all standard grease bins',
      ],
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'NJDEP Compliance & Manifest Filing',
      short: 'All paperwork handled for your inspections',
      items: [
        'NJDEP waste manifest documentation',
        'Interceptor inspection reports',
        'Municipal FOG program compliance',
        'Annual interceptor certification',
        'Records portal — pull docs anytime',
      ],
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Drain Line Jetting',
      short: 'High-pressure hydro-jetting for FOG-clogged lines',
      items: [
        'Up to 4,000 PSI hydro-jetting',
        'Clears grease, sludge, and root intrusion',
        'Camera inspection before/after',
        'Restores full flow to drain laterals',
      ],
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Emergency Response',
      short: 'Backups, overflows, after-hours emergencies',
      items: [
        'Real human dispatch — no phone trees',
        'Average response under 2 hours statewide',
        'Emergency pump-out, line clearing',
        'Available nights, weekends, holidays',
      ],
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'New Trap Installation & Replacement',
      short: 'Full plumbing for new or failing systems',
      items: [
        'Site survey and sizing',
        'NJ plumbing code compliant installation',
        'Removal and disposal of old units',
        'Coordination with your GC or plumber',
      ],
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Scheduled Maintenance Plans',
      short: 'Monthly, quarterly, or custom schedules',
      items: [
        'Predictable flat-rate pricing',
        'Priority scheduling for emergencies',
        'No missed cleanings — we track for you',
        'Locked-in pricing for 12 months',
      ],
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Interceptor Inspections',
      short: 'Pre-purchase, regulatory, and audit inspections',
      items: [
        'Detailed photo + video report',
        'Capacity & condition assessment',
        'Compliance gap analysis',
        'Recommendations for repairs or replacement',
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Grease Trap Services NJ | Pumping, Cleaning, FOG Compliance"
        description="Full-service grease trap management in New Jersey, NYC & Pennsylvania. Pumping, used cooking oil pickup, FOG compliance, hydro-jetting, 24/7 emergency response, NJDEP manifests. Free quotes."
        canonical="/services"
        keywords={[
          'grease trap pumping NJ',
          'grease trap cleaning New Jersey',
          'FOG compliance',
          'NJDEP manifest',
          'used cooking oil pickup',
          'hydro jetting NJ',
          'grease interceptor inspection',
        ]}
      />

      {/* Hero with animated background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
        {/* Animated background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-brand-copper/20 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[100px] animate-pulse-glow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variant="fade-up">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-wider text-brand-gold mb-3 font-semibold">
                What we do
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Full-service grease trap
                <span className="block bg-gradient-to-r from-brand-copper to-brand-champagne bg-clip-text text-transparent">
                  management
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                From one-time emergency pumping to fully managed multi-location
                maintenance programs — we handle every aspect of grease trap and
                FOG compliance for NJ commercial kitchens.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services grid with scroll animations */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-copper/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <Reveal key={i} variant="fade-up" delay={(i % 2) * 100}>
                <div className="group p-7 bg-white rounded-2xl border border-gray-200 hover:border-brand-copper hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-copper to-brand-bronze text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {s.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 group-hover:text-brand-copper transition-colors">{s.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{s.short}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mt-4">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-brand-copper flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with animated background */}
      <section className="py-20 bg-gradient-to-br from-brand-copper to-brand-sienna relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-champagne/20 rounded-full blur-3xl animate-float" />
        </div>
        <Reveal variant="scale-in">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Not sure what you need?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Send us a photo of your trap or interceptor and we'll tell you
              exactly what service makes sense. No obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-copper px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition-all hover:-translate-y-0.5"
              >
                Call {PHONE}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
