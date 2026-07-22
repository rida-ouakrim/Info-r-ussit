import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen, FileText, Sparkles, Star, AlertCircle,
  LayoutDashboard, LogOut, ShieldCheck, Sun, Moon, ChevronLeft, ChevronRight
} from 'lucide-react';

const navLinks = [
  { name: 'Tableau de bord',  path: '/dashboard',  icon: LayoutDashboard, protected: true },
  { name: 'Fiches de Cours',  path: '/courses',     icon: BookOpen,        protected: true },
  { name: 'Annales & Tests',  path: '/annales',     icon: FileText,        protected: true },
  { name: 'Assistant IA',     path: '/generator',   icon: Sparkles,        protected: true },
  { name: 'Questions Favoris',path: '/bookmarks',   icon: Star,            protected: true },
  { name: "Carnet d'Erreurs", path: '/errors',      icon: AlertCircle,     protected: true },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const allLinks = user?.is_staff
    ? [...navLinks, { name: 'Administration', path: '/admin', icon: ShieldCheck, protected: true }]
    : navLinks;

  return (
    <aside className={`sidebar-base fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-200 shadow-xl ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>

      {/* ── Brand Header ── */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-inherit">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-0.5 min-w-0">
            <span className="font-extrabold text-lg tracking-tight text-blue-600">Info</span>
            <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-white">réussit</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mx-auto">
            <span className="text-white font-black text-xs">IR</span>
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2 shrink-0">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 mb-3 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        {allLinks.map((link) => {
          if (link.protected && !user) return null;
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              title={collapsed ? link.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-lg
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold border-l-[3px] border-blue-600 rounded-l-none pl-[9px]'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              <Icon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {!collapsed && <span className="truncate">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer: Theme + User ── */}
      <div className="border-t border-inherit p-3 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          {theme === 'dark'
            ? <><Sun className="w-4 h-4 shrink-0" />{!collapsed && <span>Mode clair</span>}</>
            : <><Moon className="w-4 h-4 shrink-0" />{!collapsed && <span>Mode sombre</span>}</>
          }
        </button>

        {/* User Card */}
        {user && (
          <div className={`flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{user.first_name || user.username}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.target_exam}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Déconnexion"
              className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!user && !collapsed && (
          <div className="space-y-1.5 pt-1">
            <Link to="/login" className="btn-ghost w-full justify-center text-xs py-2">Connexion</Link>
            <Link to="/register" className="btn-primary w-full justify-center text-xs py-2">Activer ma clé</Link>
          </div>
        )}
      </div>
    </aside>
  );
}
