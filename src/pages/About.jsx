import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Users, MapPin, ArrowRight, Phone, Heart } from 'lucide-react';
import { PHONE } from '../config/brand';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="About The Grease Trappers | Family-Owned NJ Service Company"
        description="Family-owned NJ grease trap company since 2008. NJDEP licensed, fully insured, statewide coverage. The Grease Trappers, LLC is New Jersey's most trusted grease trap service."
        canonical="/about"
        keywords={[
          'NJ grease trap company',
          'New Jersey grease trap service',
          'family owned grease trap NJ',
          'NJDEP licensed',
          'statewide NJ coverage',
        ]}
      />
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-wider text-brand-gold mb-3 font-semibold">
              About us
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Family-owned NJ grease trap
              <span className="block bg-gradient-to-r from-brand-copper to-brand-champagne bg-clip-text text-transparent">
                company since 2008
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              We started with one truck and a promise to be the most reliable
              grease trap service in New Jersey. Today we maintain hundreds of
              traps across the state — and we still answer the phone ourselves.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Reliable. Compliant. Local.
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Grease Trappers is a New Jersey-based, family-run grease
                  trap service company. We know the FOG regulations, the
                  municipal inspectors, and the quirks of every kind of
                  commercial kitchen in the state.
                </p>
                <p>
                  We're not a national franchise. We're local folks who care
                  about doing the job right. Our trucks roll out of Newark every
                  morning and we cover the entire state.
                </p>
                <p>
                  Every job is logged, manifest-documented, and tracked. You get
                  a portal to pull your records any time, day or night.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ValueCard
                icon={<Award className="w-6 h-6" />}
                title="NJDEP Licensed"
                desc="Waste hauler #NJ-WH-XXXXX. Full manifests and documentation."
              />
              <ValueCard
                icon={<ShieldCheck className="w-6 h-6" />}
                title="Fully Insured"
                desc="$2M general liability + workers comp. COI on request."
              />
              <ValueCard
                icon={<Users className="w-6 h-6" />}
                title="Family Owned"
                desc="Local NJ owners. Not a national franchise."
              />
              <ValueCard
                icon={<MapPin className="w-6 h-6" />}
                title="Statewide Coverage"
                desc="All 21 counties. Newark-based fleet."
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200">
            <div className="text-center max-w-2xl mx-auto">
              <Heart className="w-10 h-10 text-brand-copper mx-auto mb-4" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our promise
              </h2>
              <p className="text-lg text-gray-700 italic leading-relaxed">
                "Show up when we say we will. Do the work the right way. Leave
                the site cleaner than we found it. If anything's off, we fix it
                — no arguments, no charge."
              </p>
              <p className="text-sm text-gray-500 mt-4">— Bobby Craig, Owner</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-brand-copper to-brand-sienna text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Join hundreds of NJ kitchens
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Restaurants, hospitals, schools, corporate cafeterias, and food
            trucks trust us with their grease traps. You should too.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-copper px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Request Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 px-6 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              <Phone className="w-5 h-5" />
              {PHONE}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200">
      <div className="w-11 h-11 rounded-lg bg-brand-copper/10 text-brand-copper flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}