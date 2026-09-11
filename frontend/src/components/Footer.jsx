import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
      <div>© 2026 Inforéussit · Plateforme Académique Nationale · Tous droits réservés.</div>
      <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
        <Link to="/terms" className="hover:text-[#03594e] dark:hover:text-emerald-400 transition-colors">Conditions d'utilisation</Link>
        <span>•</span>
        <Link to="/privacy" className="hover:text-[#03594e] dark:hover:text-emerald-400 transition-colors">Politique de confidentialité</Link>
      </div>
    </footer>
  );
}
