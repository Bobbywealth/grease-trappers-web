import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Lock, LogOut, User } from 'lucide-react';
import { BUSINESS_NAME, PHONE } from '../config/brand';
import { useAuth } from '../admin/context/AuthContext.jsx';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastYRef = useRef(0);
  const loc = useLocation();
  const navigate = useNavigate();
  const isHome = loc.pathname === '/';
  const { user, logout } = useAuth();

  const nav = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/quote', label: 'Free Quote' },
  ];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setCompact(y > 120);
      if (y > lastYRef.current && y > 100) {
        setHidden(true);
      } else if (y < lastYRef.current) {
        setHidden(false);
      }
      lastYRef.current = y;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min((y / docHeight) * 100, 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const transparent = isHome && !scrolled;

  const headerPadding = compact ? 'pt-2 pb-2' : 'pt-4 pb-0';
  const headerHeight = compact ? 'h-14' : 'h-16';
  const logoHeightMobile = compact ? 'h-10' : 'h-14';
  const headerBg = transparent
    ? 'bg-transparent'
    : 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] border-b border-gray-100';
  const headerClass = `fixed top-0 left-0 right-0 z-50 ${headerBg} transition-all duration-300 ${headerPadding} ${headerHeight} ${hidden ? '-translate-y-full' : 'translate-y-0'}`;

  const linkBaseClass = (to) =>
    `relative block px-3 py-3 text-base font-medium transition-colors ${
      transparent ? 'text-white hover:text-brand-gold' : 'text-gray-700 hover:text-brand-copper'
    } ${loc.pathname === to ? (transparent ? 'text-brand-gold' : 'text-brand-copper') : ''}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-copper via-brand-gold to-brand-champagne transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Floating call widget */}
      {scrolled && (
        <a
          href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-gradient-to-r from-brand-copper to-brand-sienna text-white px-4 py-3 rounded-full shadow-2xl shadow-brand-copper/50 hover:scale-105 transition-transform animate-fade-up"
          style={{ boxShadow: '0 8px 25px -5px rgba(185, 120, 50, 0.5)' }}
        >
          <Phone className="w-5 h-5" />
          <span className="font-bold hidden sm:inline">{PHONE}</span>
        </a>
      )}
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className={`flex items-center justify-between ${headerHeight} transition-all duration-300`}>
            {/* Official logo — wordmark built in */}
            <Link to="/" className="flex items-center group md:relative md:static absolute left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0">
              <img
                src="/logo.png"
                alt={BUSINESS_NAME}
                className={`${logoHeightMobile} md:h-[5.2rem] lg:h-[5.5rem] w-auto transition-all duration-300 ${transparent ? 'drop-shadow-[0_0_3px_rgba(255,255,255,0.25)]' : 'drop-shadow-none'}`}
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
              {user ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                      transparent
                        ? 'bg-white/10 backdrop-blur text-white border-white/20 hover:bg-white/20'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-copper to-brand-bronze flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
                  </button>
                  {userMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                        <button
                          onClick={() => { setUserMenu(false); navigate('/dashboard'); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </button>
                        <button
                          onClick={async () => {
                            setUserMenu(false);
                            await logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-2 inline-flex items-center gap-2 bg-white/5 backdrop-blur text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden flex items-center justify-center ${transparent ? 'text-white' : 'text-gray-900'}`}
              aria-label="Toggle menu"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div className={`md:hidden pb-6 space-y-1 ${transparent ? 'bg-black/95 backdrop-blur-lg rounded-b-2xl px-4 mt-2 border border-white/10' : 'bg-white mt-2 shadow-lg rounded-b-2xl border border-gray-100'}`}>
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
                className={`block mt-3 text-center px-4 py-3 rounded-xl text-base font-bold ${transparent ? 'bg-brand-copper text-white' : 'bg-brand-copper text-white'}`}
                style={{ minHeight: '48px' }}
              >
                Call {PHONE}
              </a>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className={`mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold border ${transparent ? 'bg-white/10 text-white border-white/20' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                    style={{ minHeight: '48px' }}
                  >
                    <User className="w-4 h-4" />
                    Dashboard ({user?.name?.split(' ')[0]})
                  </Link>
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await logout();
                      navigate('/');
                    }}
                    className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold border ${transparent ? 'bg-red-500/10 text-red-300 border-red-400/30' : 'bg-red-50 text-red-600 border-red-200'}`}
                    style={{ minHeight: '48px' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={`mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold border ${transparent ? 'bg-white/5 text-white border-white/10' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                  style={{ minHeight: '48px' }}
                >
                  <Lock className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      {!isHome && <div className="h-16" />}

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0D0D0D] text-gray-300 border-t border-brand-copper/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src="/logo.png" alt={BUSINESS_NAME} className="h-20 w-auto" />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 justify-between">
            <span>© {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.</span>
            <span>NJDEP Waste Hauler #NJ-WH-XXXXX · Fully Insured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}