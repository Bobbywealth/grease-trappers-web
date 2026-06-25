import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
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

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const transparent = isHome && !scrolled;
  const headerClass = transparent
    ? 'fixed top-0 left-0 right-0 z-50 bg-transparent'
    : 'fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur shadow-sm';

  const linkBaseClass = (to) =>
    `relative block px-3 py-3 text-base font-medium transition-colors ${
      transparent ? 'text-white hover:text-brand-gold' : 'text-gray-700 hover:text-brand-copper'
    } ${loc.pathname === to ? (transparent ? 'text-brand-gold' : 'text-brand-copper') : ''}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Official logo — wordmark built in */}
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.jpeg"
                alt={BUSINESS_NAME}
                className="h-[4.5rem] sm:h-14 md:h-[4.75rem] lg:h-20 w-auto transition-all"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className={`${linkBaseClass(n.to).replace('block', 'inline-block')} group`}>
                  {n.label}
                  <span className={`absolute left-3 right-3 -bottom-1 h-0.5 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${transparent ? 'bg-brand-gold' : 'bg-brand-copper'}`} />
                </Link>
              ))}
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="ml-3 inline-flex items-center gap-2 bg-brand-copper text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-brand-sienna transition-colors border border-brand-gold/40"
              >
                <Phone className="w-4 h-4" />
                {PHONE}
              </a>
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-gray-900'}`}
              aria-label="Toggle menu"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div className={`md:hidden pb-6 space-y-1 ${transparent ? 'bg-black/95 backdrop-blur-lg rounded-b-2xl px-4 mt-2 border border-white/10' : ''}`}>
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={linkBaseClass(n.to)}
                  style={{ minHeight: '44px' }}
                >
                  {n.label}
                </Link>
              ))}
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="block mt-3 text-center bg-brand-copper text-white px-4 py-3 rounded-xl text-base font-bold"
                style={{ minHeight: '48px' }}
              >
                Call {PHONE}
              </a>
            </div>
          )}
        </div>
      </header>

      {!isHome && <div className="h-20" />}

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0D0D0D] text-gray-300 border-t border-brand-copper/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src="/logo.jpeg" alt={BUSINESS_NAME} className="h-20 w-auto" />
            </div>
            <p className="text-sm text-gray-400 max-w-md mt-4">
              New Jersey's most trusted grease trap cleaning and pumping service.
              Restaurant-grade FOG compliance for commercial kitchens.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-[0.15em]">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-gold">Home</Link></li>
              <li><Link to="/services" className="hover:text-brand-gold">Services</Link></li>
              <li><Link to="/about" className="hover:text-brand-gold">About</Link></li>
              <li><Link to="/quote" className="hover:text-brand-gold">Free Quote</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-[0.15em]">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href={`tel:${PHONE.replace(/[^\d]/g, '')}`} className="hover:text-brand-gold">{PHONE}</a></li>
              <li><a href="mailto:service@greasetrapers.com" className="hover:text-brand-gold">service@greasetrapers.com</a></li>
              <li className="text-gray-400">24/7 Emergency Service</li>
              <li className="text-gray-400">NJDEP Licensed & Insured</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 justify-between">
            <span>© {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.</span>
            <span>NJDEP Waste Hauler #NJ-WH-XXXXX · Fully Insured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}