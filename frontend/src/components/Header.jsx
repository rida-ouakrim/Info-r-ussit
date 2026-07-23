import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Award, Menu } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Tableau de bord',
  '/courses':   'Fiches de Cours',
  '/annales':   'Annales & Épreuves',
  '/generator': 'Assistant IA Concours',
  '/bookmarks': 'Questions Favorites',
  '/errors':    "Carnet d'Erreurs",
  '/admin':     'Administration',
};

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const title = PAGE_TITLES[location.pathname] ?? 'ConcoursInfo';

  return (
    <header className="glass-nav sticky top-0 z-30 px-4 sm:px-6 h-14 flex items-center justify-between">
      {/* Title + Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          title="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
          <p className="text-[10px] text-slate-400 mt-0 leading-none">Inforéussit</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800">
            <Award className="w-3 h-3" />
            {user.target_exam}
          </span>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}
