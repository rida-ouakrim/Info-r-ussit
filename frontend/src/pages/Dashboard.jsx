import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { 
  BookOpen, CheckCircle2, Award, AlertTriangle, Play, Star, 
  Sparkles, ArrowRight, ShieldCheck, RefreshCw, BarChart2 
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get('auth/dashboard/candidate/');
      setData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-sky-400 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement de votre Tableau de Bord...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { user, course_stats, quiz_stats, bookmarks_count, active_sessions, weak_points } = data;

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-blue-500/10 dark:from-sky-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-sky-500/20 dark:border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            Espace Candidat • {user.target_exam}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Bienvenue, {user.first_name || user.username} ! 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Suivez votre progression en temps réel sur l'ensemble du programme officiel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/courses"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all"
          >
            <BookOpen className="w-4 h-4 text-white" />
            Réviser les Cours
          </Link>
          <Link
            to="/annales"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all shadow-sm"
          >
            <Play className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            Lancer un Test
          </Link>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Course Progress Card */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fiches de Cours</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{course_stats.completed} <span className="text-sm text-slate-500 dark:text-slate-400 font-normal">/ {course_stats.total}</span></div>
            <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{course_stats.percentage}% des cours maîtrisés</div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-500 h-2 rounded-full transition-all duration-500" style={{ width: `${course_stats.percentage}%` }}></div>
          </div>
        </div>

        {/* MCQ Attempts Card */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions Tentées</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{quiz_stats.total_attempts}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{quiz_stats.correct_attempts} réponses correctes</div>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Taux de Réussite</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-3xl font-extrabold ${quiz_stats.success_rate >= 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {quiz_stats.success_rate}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Sur les annales & QCM IA</div>
          </div>
        </div>

        {/* Bookmarks Count Card */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions Favorites</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-300">{bookmarks_count}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Enregistrées pour révision</div>
          </div>
          <Link to="/bookmarks" className="text-xs text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-medium">
            Voir les favoris <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* Active Exam Sessions Pause & Resume Banner */}
      {active_sessions.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Session d'Examen en Pause</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Vous avez un examen interrompu prêt à être repris.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {active_sessions.map((sess, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-white text-sm">Concours {sess.exam_year}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Question {sess.current_index + 1} • Score: {sess.quiz_score}</div>
                </div>
                <Link
                  to="/annales"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm"
                >
                  Reprendre
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weak Points Diagnostic & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnostic & Performance par Module</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Analyse détaillée de vos {quiz_stats.total_attempts} questions tentées par domaine du concours</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-extrabold">
              {weak_points.length} modules analysés
            </span>
          </div>

          {weak_points.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              Commencez à répondre aux QCM pour obtenir un diagnostic automatique de vos faiblesses.
            </div>
          ) : (
            <div className="space-y-4">
              {weak_points.map((wp, idx) => {
                const incorrect = wp.total_attempts - wp.correct_attempts;
                const isWeak = wp.success_rate < 50;

                return (
                  <div key={idx} className={`p-5 rounded-2xl border space-y-3 transition-all ${
                    isWeak 
                      ? 'bg-red-500/5 dark:bg-red-950/20 border-red-500/30' 
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {wp.subdomain_name || wp.subdomain_code || 'Module informatique'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                          Code: <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">{wp.subdomain_code}</code>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          wp.success_rate >= 60 
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
                            : wp.success_rate >= 40 
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30' 
                            : 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30'
                        }`}>
                          {wp.success_rate}% Réussite
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          wp.success_rate >= 60 ? 'bg-emerald-500' : wp.success_rate >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${wp.success_rate}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <span><strong>{wp.correct_attempts}</strong> réussies sur <strong>{wp.total_attempts}</strong></span>
                        {incorrect > 0 && (
                          <span className="text-red-600 dark:text-red-400 font-semibold">• {incorrect} erreur{incorrect > 1 ? 's' : ''}</span>
                        )}
                      </div>

                      <Link 
                        to={`/generator?subdomain=${wp.subdomain_code}`} 
                        className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Entraîner ce module
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Actions Rapides</h3>
          
          <div className="space-y-3">
            <Link
              to="/courses"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span className="text-sm font-medium">Consulter les 39 Cours</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/generator"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium">Assistant IA Concours</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/errors"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium">Carnet d'Erreurs</span>
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
