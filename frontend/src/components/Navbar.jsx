import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, LogOut, Sun, Moon, Key, ChevronRight } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   PUBLIC NAVBAR — used on Home / Login / Register pages
   ────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand — Text Logo */}
        <Link to="/" className="flex items-center gap-0.5">
          <span className="font-extrabold text-xl tracking-tight text-blue-600">Info</span>
          <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">réussit</span>
          <span className="ml-2 text-[10px] font-medium text-slate-400 hidden sm:block border-l border-slate-300 dark:border-slate-700 pl-2">Plateforme Nationale</span>
        </Link>

        {/* Public Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#vision" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors font-medium">Notre Vision</a>
          <a href="#concours" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors font-medium">Concours</a>
          <a href="#outils" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors font-medium">Nos Outils</a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
                Mon espace
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-sm py-1.5 px-3">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                Connexion
              </Link>
              <Link to="/register" className="hidden sm:inline-flex btn-primary text-sm py-2 px-4">
                <Key className="w-3.5 h-3.5" /> Activer ma clé
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
