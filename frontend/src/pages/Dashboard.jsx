import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  BookOpen, CheckCircle2, Award, AlertTriangle, Play, Star,
  Sparkles, ArrowRight, BarChart2, ChevronDown, ChevronUp
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Collapsible section states
  const [showPaused, setShowPaused] = useState(true);
  const [showDiagnostic, setShowDiagnostic] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await API.get('auth/dashboard/candidate/');
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) console.error("Dashboard error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Chargement de votre Tableau de Bord..." />;
  }

  if (!data) return null;

  const course_stats = data.course_stats || { total: 0, completed: 0, percentage: 0 };
  const quiz_stats = data.quiz_stats || { total_attempts: 0, correct_attempts: 0, success_rate: 0 };
  const bookmarks_count = data.bookmarks_count || 0;
  const weak_points = data.weak_points || [];
  const user = data.user || {};

  // ── Filter out placeholder sessions (year 9999 or invalid years) ──────────
  const active_sessions = (data.active_sessions || []).filter(
    (s) => s.exam_year && s.exam_year !== 9999 && s.exam_year > 1900 && s.exam_year < 2100
  );

  return (
    <div className="space-y-7 py-2 relative z-10 max-w-7xl mx-auto">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/10 dark:text-[#F8C62F] text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            Espace Candidat • {user?.target_exam || 'Concours CRMEF'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bienvenue, <span className="text-[#03594e] dark:text-[#F8C62F]">{user?.first_name || user?.username || user?.email || 'Candidat'}</span> ! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Suivez votre progression en temps réel sur l'ensemble du programme officiel.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/courses"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs bg-[#F8C62F] hover:bg-[#e0b228] text-[#1B1D21] shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 text-[#1B1D21]" />
            Réviser les Cours
          </Link>
          <Link
            to="/annales"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs bg-[#03594e] hover:bg-[#02473e] text-white shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 text-[#F8C62F]" />
            Lancer un Test
          </Link>
        </div>
      </div>

      {/* ─── Metric Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Card 1: Fiches de Cours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fiches de Cours</span>
            <div className="p-3 rounded-xl bg-[#e6f5f3] dark:bg-[#03594e]/20 text-[#03594e] dark:text-[#F8C62F]">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {course_stats.completed} <span className="text-sm font-medium text-slate-400">/ {course_stats.total}</span>
            </div>
            <div className="text-xs font-bold text-[#03594e] dark:text-[#F8C62F]">
              {course_stats.percentage}% des cours maîtrisés
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#03594e] dark:bg-[#F8C62F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${course_stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Questions Tentées */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questions Tentées</span>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <BarChart2 className="w-5 h-5 text-[#03594e] dark:text-[#F8C62F]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {quiz_stats.total_attempts}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {quiz_stats.correct_attempts} réponses correctes
            </div>
          </div>
        </div>

        {/* Card 3: Taux de Réussite */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux de Réussite</span>
            <div className="p-3 rounded-xl bg-[#e6f5f3] dark:bg-[#03594e]/20 text-[#03594e] dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-3xl font-extrabold ${quiz_stats.success_rate >= 60 ? 'text-[#03594e] dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {quiz_stats.success_rate}%
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Sur les annales & QCM IA
            </div>
          </div>
        </div>

        {/* Card 4: Questions Favorites */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questions Favorites</span>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5 fill-[#F8C62F] text-[#F8C62F]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {bookmarks_count}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Enregistrées pour révision
            </div>
          </div>
          <Link to="/bookmarks" className="text-xs font-bold text-[#03594e] dark:text-[#F8C62F] hover:underline inline-flex items-center gap-1">
            Voir les favoris <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ─── Sessions en Pause (collapsible) ────────────────────────────── */}
      {active_sessions.length > 0 && (
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-2xl overflow-hidden">
          {/* Header — always visible, clickable */}
          <button
            type="button"
            onClick={() => setShowPaused(!showPaused)}
            className="w-full flex items-center justify-between gap-3 p-5 text-left cursor-pointer hover:bg-amber-100/40 dark:hover:bg-amber-900/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 shrink-0">
                <Play className="w-4 h-4 fill-[#F8C62F]" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Session d'Examen en Pause
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold">
                    {active_sessions.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {showPaused ? 'Cliquez pour masquer' : `${active_sessions.length} examen${active_sessions.length > 1 ? 's' : ''} interrompu${active_sessions.length > 1 ? 's' : ''} prêt à être repris`}
                </p>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
              {showPaused ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Collapsible content */}
          {showPaused && (
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {active_sessions.map((sess, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">Concours {sess.exam_year}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Question {sess.current_index + 1} • Score: {sess.quiz_score}</div>
                    </div>
                    <Link
                      to="/annales"
                      className="px-3 py-1.5 rounded-lg font-extrabold text-xs bg-[#03594e] hover:bg-[#02473e] text-white transition-colors"
                    >
                      Reprendre
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Diagnostic & Quick Actions (collapsible) ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Diagnostic & Module Performance */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">

          {/* Section header — always visible, clickable */}
          <button
            type="button"
            onClick={() => setShowDiagnostic(!showDiagnostic)}
            className="w-full flex items-center justify-between gap-3 p-6 sm:p-7 text-left cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f5f3] dark:bg-[#03594e]/20 flex items-center justify-center text-[#03594e] dark:text-[#F8C62F] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Diagnostic & Performance par Module</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {showDiagnostic
                    ? `Analyse détaillée de vos ${quiz_stats.total_attempts} questions tentées par domaine`
                    : `${weak_points.length} modules analysés — Cliquez pour afficher`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hidden sm:inline-block">
                {weak_points.length} modules
              </span>
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {showDiagnostic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {/* Collapsible diagnostic content */}
          {showDiagnostic && (
            <div className="p-6 sm:p-7 space-y-6">
              {weak_points.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Commencez à répondre aux QCM pour obtenir un diagnostic automatique de vos faiblesses.
                </div>
              ) : (
                <div className="space-y-4">
                  {weak_points.map((wp, idx) => {
                    const incorrect = wp.total_attempts - wp.correct_attempts;
                    const isWeak = wp.success_rate < 50;

                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-xl border space-y-3 transition-all ${
                          isWeak
                            ? 'bg-red-50/40 dark:bg-red-950/10 border-red-200/60 dark:border-red-900/30'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {wp.subdomain_name || wp.subdomain_code || 'Module informatique'}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                              Code: <code className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 font-mono text-[11px] text-[#03594e] dark:text-[#F8C62F] font-bold">{wp.subdomain_code}</code>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                              wp.success_rate >= 60
                                ? 'bg-[#e6f5f3] text-[#03594e] dark:bg-[#03594e]/30 dark:text-[#F8C62F] border border-[#b3e6df] dark:border-[#03594e]/50'
                                : wp.success_rate >= 40
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}>
                              {wp.success_rate}% Réussite
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200/70 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              wp.success_rate >= 60 ? 'bg-[#03594e] dark:bg-[#F8C62F]' : wp.success_rate >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${wp.success_rate}%` }}
                          />
                        </div>

                        <div className="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs">
                          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                            <span><strong>{wp.correct_attempts}</strong> réussies sur <strong>{wp.total_attempts}</strong></span>
                            {incorrect > 0 && (
                              <span className="text-red-600 dark:text-red-400 font-bold">• {incorrect} erreur{incorrect > 1 ? 's' : ''}</span>
                            )}
                          </div>
                          <Link
                            to={`/generator?subdomain=${wp.subdomain_code}`}
                            className="px-4 py-2 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#F8C62F]" /> Entraîner ce module
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm h-fit">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3.5">Actions Rapides</h3>

          <div className="space-y-3">
            <Link
              to="/courses"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-[#e6f5f3]/60 dark:hover:bg-[#03594e]/20 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#03594e] dark:text-[#F8C62F]" />
                <span className="text-sm font-bold">Consulter les Cours</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/generator"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-[#e6f5f3]/60 dark:hover:bg-[#03594e]/20 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#03594e] dark:text-[#F8C62F]" />
                <span className="text-sm font-bold">Assistant IA Concours</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/errors"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-[#e6f5f3]/60 dark:hover:bg-[#03594e]/20 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-bold">Carnet d'Erreurs</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
