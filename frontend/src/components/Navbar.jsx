import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, Mail, Phone } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   PUBLIC NAVBAR — Style Educeet Vert Vert-Sapin (#03594e)
   ────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Notre Vision', href: '#vision' },
    { label: 'Concours', href: '#concours' },
    { label: 'Nos Outils', href: '#outils' },
    { label: 'Témoignages', href: '#temoignages' },
  ];

  const getHref = (linkHref) => {
    if (linkHref === '/') return '/';
    if (location.pathname === '/') return linkHref;
    return '/' + linkHref;
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      if (location.pathname === '/') {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/' + href);
      }
    }
  };

  return (
    <>
      {/* ── Top Bar (Clair) ── */}
      <div className="hidden md:block bg-slate-100 border-b border-slate-200 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
          {/* Left: contact info */}
          <div className="flex items-center gap-6">
            <a href="mailto:ridaouakrim0@gmail.com" className="flex items-center gap-1.5 hover:text-[#03594e] transition-colors font-medium">
              <Mail className="w-3.5 h-3.5 text-[#03594e]" />
              ridaouakrim0@gmail.com
            </a>
            <a href="tel:+212702555943" className="flex items-center gap-1.5 hover:text-[#03594e] transition-colors font-medium">
              <Phone className="w-3.5 h-3.5 text-[#03594e]" />
              +212 702 555 943
            </a>
          </div>

          {/* Right: Auth links */}
          <div className="flex items-center gap-4 font-semibold">
            {user ? (
              <>
                <Link to="/dashboard" className="text-[#03594e] hover:underline">Mon Espace</Link>
                <span className="text-slate-300">|</span>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-[#03594e] transition-colors">Connexion</Link>
                <span className="text-slate-300">|</span>
                <Link to="/register" className="text-[#03594e] hover:underline">Inscription gratuite</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Navbar (Fixed on Scroll) ── */}
      <header 
        className={`w-full z-50 transition-all duration-300 border-b border-slate-100 ${
          sticky 
            ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg shadow-slate-900/5 animate-fadeIn' 
            : 'relative bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between transition-all duration-300 ${sticky ? 'h-16 sm:h-20' : 'h-24 sm:h-28'}`}>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 py-1">
              <img 
                src="/logo.png" 
                alt="Inforéussit" 
                className={`w-auto object-contain transition-all duration-300 hover:scale-105 ${
                  sticky ? 'h-14 sm:h-16 max-h-[65px]' : 'h-20 sm:h-24 md:h-28 max-h-[110px]'
                }`} 
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} 
              />
              <div className="hidden items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#03594e] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-2xl text-[#03594e]">Inforéussit</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={getHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#03594e] transition-colors rounded-lg hover:bg-[#e6f5f3]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Right CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-extrabold text-[#03594e] hover:underline"
                  >
                    Mon Espace →
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-700 hover:text-[#03594e] transition-colors px-4 py-2"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold text-white bg-[#03594e] hover:bg-[#02473e] transition-all shadow-md shadow-[#03594e]/20"
                  >
                    S'inscrire gratuitement →
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {mobileOpen ? (
                  <span className="text-xl font-bold">✕</span>
                ) : (
                  <span className="text-xl font-bold">☰</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white shadow-xl">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={getHref(link.href)}
                  onClick={(e) => { setMobileOpen(false); handleNavClick(e, link.href); }}
                  className="block px-4 py-3 text-sm font-bold text-slate-700 hover:text-[#03594e] hover:bg-[#e6f5f3] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 text-sm font-bold bg-[#e6f5f3] text-[#03594e] rounded-lg">
                      Mon Espace
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-center px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-lg">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 text-sm font-bold border border-slate-200 text-slate-700 rounded-lg">
                      Connexion
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 text-sm font-extrabold text-white bg-[#03594e] rounded-xl">
                      S'inscrire gratuitement →
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent layout shift when header becomes fixed */}
      {sticky && <div className="h-24 sm:h-28 w-full pointer-events-none" />}
    </>
  );
}
