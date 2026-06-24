import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, Menu, X, Phone } from 'lucide-react';
import { BUSINESS_NAME, PHONE } from '../config/brand';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/quote', label: 'Free Quote' },
  ];
  const linkClass = (to) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      loc.pathname === to
        ? 'text-brand-pink'
        : 'text-gray-700 hover:text-brand-pink'
    }`;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-pink-400 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900">
                {BUSINESS_NAME}
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className={linkClass(n.to)}>
                  {n.label}
                </Link>
              ))}
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="ml-3 inline-flex items-center gap-2 bg-brand-pink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {PHONE}
              </a>
            </nav>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {open && (
            <div className="md:hidden pb-4 space-y-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`block ${linkClass(n.to)}`}
                >
                  {n.label}
                </Link>
              ))}
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="block mt-2 text-center bg-brand-pink text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Call {PHONE}
              </a>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-pink-400 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                {BUSINESS_NAME}
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              New Jersey's trusted grease trap cleaning and pumping service.
              Restaurant-grade FOG compliance for commercial kitchens, food
              service, and institutional facilities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/quote" className="hover:text-white">Free Quote</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href={`tel:${PHONE.replace(/[^\d]/g, '')}`} className="hover:text-white">{PHONE}</a></li>
              <li><a href="mailto:service@greasetrapers.com" className="hover:text-white">service@greasetrapers.com</a></li>
              <li className="text-gray-400">24/7 Emergency Service</li>
              <li className="text-gray-400">NJDEP Licensed & Insured</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 justify-between">
            <span>© {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.</span>
            <span>NJDEP Waste Hauler #NJ-WH-XXXXX · Fully Insured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}