import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Award, Menu, LayoutDashboard, ShieldCheck, ChevronDown } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': { title: 'Tableau de bord',            emoji: '🏠' },
  '/courses':   { title: 'Fiches de Cours',            emoji: '📚' },
  '/annales':   { title: 'Annales & Épreuves',         emoji: '📝' },
  '/generator': { title: 'Assistant IA Concours',      emoji: '🤖' },
  '/bookmarks': { title: 'Questions Favorites',         emoji: '⭐' },
  '/errors':    { title: "Carnet d'Erreurs",            emoji: '📋' },
  '/admin':     { title: 'Administration',              emoji: '⚙️' },
  '/plan':      { title: 'Plan de Révisions',           emoji: '🗓️' },
  '/languages-academy': { title: 'Académie des Langues', emoji: '🎓' },
};

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { 
    setProfileDropdownOpen(false);
    logout(); 
    navigate('/login'); 
  };

  // Fermer le menu lors d'un changement de page
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Fermer le menu si l'utilisateur clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const pageInfo = PAGE_TITLES[location.pathname] ?? { title: 'Inforéussit', emoji: '🎯' };

  const displayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : (user?.username || user?.email || 'Utilisateur');

  const initial = (user?.first_name || user?.username || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="glass-nav sticky top-0 z-30 px-4 sm:px-6 h-16 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">

      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          id="sidebar-menu-btn"
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          title="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div>
          <h1 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">{pageInfo.title}</h1>
          <p className="text-[11px] font-semibold text-[#03594e] dark:text-[#F8C62F] leading-none mt-0.5">Inforéussit</p>
        </div>
      </div>

      {/* Right: Controls & Profile Dropdown */}
      <div className="flex items-center gap-2">

        {/* Exam badge */}
        {user && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-[#03594e] dark:text-[#F8C62F] bg-[#03594e]/8 dark:bg-[#F8C62F]/10 border border-[#03594e]/15 dark:border-[#F8C62F]/20 px-3 py-1 rounded-full">
            <Award className="w-3 h-3" />
            {user.target_exam || 'Candidat'}
          </span>
        )}

        {/* User Profile Dropdown Button */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Mon Profil"
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-[#F8C62F] text-[#1B1D21] text-xs font-black flex items-center justify-center shadow-sm">
                {initial}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-400 leading-none">
                  {user.is_staff ? 'Administrateur' : 'Candidat'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-3 z-50 animate-fadeIn">
                {/* User Info Header */}
                <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F8C62F] text-[#1B1D21] text-sm font-black flex items-center justify-center shadow-sm shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 inline-block text-[11px] font-semibold text-[#03594e] dark:text-[#F8C62F] bg-[#03594e]/10 dark:bg-[#F8C62F]/10 px-2.5 py-0.5 rounded-full">
                    🎯 {user.target_exam || 'CRMEF Informatique'}
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="py-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" />
                    Mon Tableau de bord
                  </Link>
                  {user.is_staff && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      Administration
                    </Link>
                  )}
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    type="button"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </header>
  );
}
