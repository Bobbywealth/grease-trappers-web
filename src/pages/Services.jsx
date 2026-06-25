import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Truck, FileCheck, ShieldCheck, Clock, Award, Wrench,
  ArrowRight, Check
} from 'lucide-react';
import { PHONE } from '../config/brand';

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
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <div key={i} className="group p-7 bg-white rounded-2xl border border-gray-200 hover:border-brand-copper hover:shadow-xl transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-copper to-brand-bronze text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">{s.title}</h3>
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
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Not sure what you need?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Send us a photo of your trap or interceptor and we'll tell you
            exactly what service makes sense. No obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 bg-brand-copper text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-brand-sienna transition-colors"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Call {PHONE}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}