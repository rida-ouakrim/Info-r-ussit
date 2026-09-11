import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen, FileText, Sparkles, Star, AlertCircle,
  LayoutDashboard, LogOut, ShieldCheck, Sun, Moon, ChevronLeft, ChevronRight,
  Compass, Languages, GraduationCap
} from 'lucide-react';

const navLinks = [
  { name: 'Tableau de bord',  path: '/dashboard',  icon: LayoutDashboard, protected: true },
  { name: 'Fiches de Cours',  path: '/courses',     icon: BookOpen,        protected: true },
  { name: 'Annales & Tests',  path: '/annales',     icon: FileText,        protected: true },
  { name: 'Assistant IA',     path: '/generator',   icon: Sparkles,        protected: true },
  { name: 'Questions Favoris',path: '/bookmarks',   icon: Star,            protected: true },
  { name: "Carnet d'Erreurs", path: '/errors',      icon: AlertCircle,     protected: true },
  { name: 'Plan',             path: '/plan',        icon: Compass,         protected: true },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const allLinks = user?.is_staff
    ? [...navLinks,
        { name: 'Administration', path: '/admin', icon: ShieldCheck, protected: true },
        { name: 'Académie des Langues', path: '/languages-academy', icon: Languages, protected: true, adminOnly: true },
      ]
    : navLinks;

  return (
    <aside
      className={`sidebar-base fixed top-0 left-0 h-screen z-50 flex flex-col transition-transform md:transition-all duration-300 shadow-xl
        ${collapsed ? 'md:w-[68px]' : 'md:w-[240px]'}
        w-[240px]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* ── Brand Header ── */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-inherit relative">
        <Link
          to="/"
          className={`flex items-center justify-center flex-1 min-w-0 ${collapsed ? 'hidden md:hidden' : 'flex'} py-1`}
          onClick={onCloseMobile}
        >
          <img 
            src="/logo.png" 
            alt="Inforéussit" 
            className="h-20 sm:h-24 w-auto object-contain max-h-[105px] transition-transform hover:scale-105 mx-auto" 
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} 
          />
          <div className="hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#03594e] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-base text-[#03594e]">Inforéussit</span>
          </div>
        </Link>

        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#F8C62F] flex items-center justify-center mx-auto md:flex hidden">
            <GraduationCap className="w-4 h-4 text-[#1B1D21]" />
          </div>
        )}

        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              if (onCloseMobile) onCloseMobile();
            } else {
              setCollapsed(true);
            }
          }}
          className={`p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ${collapsed ? 'hidden md:hidden' : 'block'} absolute right-2 top-3`}
          title="Réduire le menu"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 mb-3 transition-colors md:flex hidden"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Nav section label */}
        {!collapsed && (
          <div className="px-3 pb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Navigation</span>
          </div>
        )}

        {allLinks.map((link) => {
          if (link.protected && !user) return null;
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={onCloseMobile}
              title={collapsed ? link.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-lg group
                ${isActive
                  ? 'bg-[#F8C62F]/10 dark:bg-[#F8C62F]/10 text-[#03594e] dark:text-[#F8C62F] font-semibold border-l-[3px] border-[#F8C62F] rounded-l-none pl-[9px]'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              <Icon className={`shrink-0 transition-transform group-hover:scale-110 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-[#03594e] dark:text-[#F8C62F]' : ''}`} />
              {!collapsed && <span className="truncate">{link.name}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F8C62F] shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer: Theme + User ── */}
      <div className="border-t border-inherit p-3 space-y-2">

        {/* User Card */}
        {user && (
          <div className={`flex items-center gap-2 px-2 py-2 rounded-xl bg-slate-50 dark:bg-[#1B1D21]/60 border border-slate-200 dark:border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-[#F8C62F] text-[#1B1D21] text-xs font-black flex items-center justify-center shrink-0">
              {(user?.username || user?.first_name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{user?.first_name || user?.username || user?.email || 'Utilisateur'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.target_exam || 'Candidat'}</div>
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
            <Link to="/login" className="block w-full text-center text-xs font-semibold py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#F8C62F] hover:text-[#03594e] dark:hover:text-[#F8C62F] transition-all">Connexion</Link>
            <Link to="/register" className="block w-full text-center text-xs font-bold py-2 rounded-lg bg-[#F8C62F] text-[#1B1D21] hover:bg-yellow-400 transition-all">Activer ma clé</Link>
          </div>
        )}
      </div>
    </aside>
  );
}
