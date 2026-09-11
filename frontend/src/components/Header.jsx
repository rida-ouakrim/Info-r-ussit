import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Award, Menu, Bell } from 'lucide-react';

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

  const handleLogout = () => { logout(); navigate('/login'); };

  const pageInfo = PAGE_TITLES[location.pathname] ?? { title: 'Inforéussit', emoji: '🎯' };

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

      {/* Right: Controls */}
      <div className="flex items-center gap-2">

        {/* Exam badge */}
        {user && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-[#03594e] dark:text-[#F8C62F] bg-[#03594e]/8 dark:bg-[#F8C62F]/10 border border-[#03594e]/15 dark:border-[#F8C62F]/20 px-3 py-1 rounded-full">
            <Award className="w-3 h-3" />
            {user.target_exam || 'Candidat'}
          </span>
        )}


        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            id="logout-btn"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        )}

        {/* User avatar (mobile logout) */}
        {user && (
          <button
            onClick={handleLogout}
            className="sm:hidden w-8 h-8 rounded-full bg-[#F8C62F] text-[#1B1D21] text-xs font-black flex items-center justify-center"
            title="Déconnexion"
          >
            {(user?.username || user?.first_name || user?.email || 'U').charAt(0).toUpperCase()}
          </button>
        )}
      </div>

    </header>
  );
}
