import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, Menu, X, Phone } from 'lucide-react';
import { BUSINESS_NAME, PHONE } from '../config/brand';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const isHome = loc.pathname === '/';

  const nav = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/quote', label: 'Free Quote' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navbar transparent over hero (white text), white with shadow when scrolled
  const transparent = isHome && !scrolled;
  const headerClass = transparent
    ? 'fixed top-0 left-0 right-0 z-50 bg-transparent'
    : 'fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur shadow-sm';

  const linkBaseClass = (to) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      transparent ? 'text-white hover:text-brand-gold' : 'text-gray-700 hover:text-brand-copper'
    } ${loc.pathname === to ? (transparent ? 'text-brand-gold' : 'text-brand-copper') : ''}`;

  const phoneBtnClass = transparent
    ? 'ml-3 inline-flex items-center gap-2 bg-brand-copper text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-sienna transition-colors border border-brand-gold/40'
    : 'ml-3 inline-flex items-center gap-2 bg-brand-copper text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-sienna transition-colors';

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt={BUSINESS_NAME} className="h-12 w-auto" onError={(e) => { e.currentTarget.style.display='none'; }} />
              <span className={`font-display font-extrabold text-lg leading-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>
                GREASE<br/>TRAPPERS
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className={`${linkBaseClass(n.to)} group`}>
                  {n.label}
                  <span className={`absolute left-0 right-0 -bottom-1 h-0.5 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${transparent ? 'bg-brand-gold' : 'bg-brand-copper'}`} />
                </Link>
              ))}
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className={phoneBtnClass}
              >
                <Phone className="w-4 h-4" />
                {PHONE}
              </a>
            </nav>
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-gray-700'}`}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {open && (
            <div className={`md:hidden pb-4 space-y-1 ${transparent ? 'bg-black/80 backdrop-blur rounded-b-xl px-4' : ''}`}>
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`block ${linkBaseClass(n.to)}`}
                >
                  {n.label}
                </Link>
              ))}
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="block mt-2 text-center bg-brand-copper text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Call {PHONE}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Spacer for fixed navbar on non-home pages */}
      {!isHome && <div className="h-20" />}

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0D0D0D] text-gray-300 border-t border-brand-copper/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt={BUSINESS_NAME} className="h-12 w-auto" onError={(e) => { e.currentTarget.style.display='none'; }} />
              <span className="font-display font-extrabold text-lg text-white leading-tight">GREASE<br/>TRAPPERS, LLC</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              New Jersey's most trusted grease trap cleaning and pumping service.
              Restaurant-grade FOG compliance for commercial kitchens.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-gold">Home</Link></li>
              <li><Link to="/services" className="hover:text-brand-gold">Services</Link></li>
              <li><Link to="/about" className="hover:text-brand-gold">About</Link></li>
              <li><Link to="/quote" className="hover:text-brand-gold">Free Quote</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href={`tel:${PHONE.replace(/[^\d]/g, '')}`} className="hover:text-brand-gold">{PHONE}</a></li>
              <li><a href="mailto:service@greasetrapers.com" className="hover:text-brand-gold">service@greasetrapers.com</a></li>
              <li className="text-gray-400">24/7 Emergency Service</li>
              <li className="text-gray-400">NJDEP Licensed & Insured</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 justify-between">
            <span>© {new Date().getFullYear()} {BUSINESS_NAME}, LLC. All rights reserved.</span>
            <span>NJDEP Waste Hauler #NJ-WH-XXXXX · Fully Insured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}