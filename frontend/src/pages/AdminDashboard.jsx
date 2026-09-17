import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ShieldCheck, Users, Key, BookOpen, Plus, 
  RefreshCw, CheckCircle2, Copy, Lock, EyeOff, Eye, X,
  Clock, Award, Search, UserCheck, UserX, BarChart2
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyPrefix, setKeyPrefix] = useState('INFO');
  const [keyCount, setKeyCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [toast, setToast] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamFilter, setSelectedExamFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('created_at');

  // Password Reset Modal State
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await API.get('auth/dashboard/admin/');
      setData(res.data);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKeys = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await API.post('auth/admin/keys/', { prefix: keyPrefix, count: keyCount });
      setGeneratedKeys(res.data);
      await fetchAdminData();
      showToast(`${keyCount} clé(s) générée(s) avec succès !`);
    } catch (err) {
      console.error("Key generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Clé d'accès copiée : ${text}`);
    } catch (err) {
      console.error('Fallback copy error', err);
      showToast(`Clé : ${text}`);
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = (code) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code)
        .then(() => showToast(`Clé d'accès copiée : ${code}`))
        .catch(() => fallbackCopy(code));
    } else {
      fallbackCopy(code);
    }
  };

  const handleUpdateGenerations = async (userId, value) => {
    const val = parseInt(value, 10);
    if (isNaN(val) || val < 0) return;
    try {
      await API.post('auth/admin/update-generations/', { user_id: userId, allowed_generations: val });
      setData(prev => {
        const updatedCandidates = prev.candidates.map(c => 
          c.id === userId ? { ...c, allowed_generations: val } : c
        );
        return { ...prev, candidates: updatedCandidates };
      });
      showToast("Nombre de générations mis à jour !");
    } catch (err) {
      console.error("Failed to update allowed generations:", err);
    }
  };

  const handleUpdateRole = async (userId, isStaff) => {
    try {
      await API.post('auth/admin/update-generations/', { user_id: userId, is_staff: isStaff });
      setData(prev => {
        const updatedCandidates = prev.candidates.map(c => 
          c.id === userId ? { ...c, is_staff: isStaff, is_superuser: isStaff } : c
        );
        return { ...prev, candidates: updatedCandidates };
      });
      showToast(`Rôle mis à jour vers : ${isStaff ? 'Administrateur 👑' : 'Candidat Standard'}`);
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleToggleActive = async (userId, currentActiveStatus) => {
    const newStatus = !currentActiveStatus;
    try {
      await API.post('auth/admin/update-generations/', { user_id: userId, is_active: newStatus });
      setData(prev => {
        const updatedCandidates = prev.candidates.map(c => 
          c.id === userId ? { ...c, is_active: newStatus } : c
        );
        return { ...prev, candidates: updatedCandidates };
      });
      showToast(`Compte ${newStatus ? 'réactivé ✅' : 'suspendu 🚫'}`);
    } catch (err) {
      console.error("Failed to toggle active status:", err);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForPassword || !newPassword || newPassword.length < 6) {
      showToast("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setPasswordLoading(true);
    try {
      await API.post('auth/admin/update-generations/', {
        user_id: selectedUserForPassword.id,
        new_password: newPassword
      });
      showToast(`Mot de passe modifié pour ${selectedUserForPassword.username} !`);
      setSelectedUserForPassword(null);
      setNewPassword('');
    } catch (err) {
      console.error("Password reset error:", err);
      showToast("Erreur lors de la modification du mot de passe.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#03594e] dark:text-[#F8C62F] font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement du Tableau de Bord Administrateur...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, candidates, target_exam_distribution } = data;

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExam = selectedExamFilter === 'ALL' || c.target_exam === selectedExamFilter;

    return matchesSearch && matchesExam;
  }).sort((a, b) => {
    if (sortBy === 'study_hours') return b.study_hours - a.study_hours;
    if (sortBy === 'exams_completed') return b.exams_completed - a.exams_completed;
    if (sortBy === 'success_rate') return b.success_rate - a.success_rate;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="space-y-7 py-2 max-w-7xl mx-auto">
      
      {/* ─── Compact Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/10 dark:text-[#F8C62F] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panneau Administrateur • Inforéussit
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Supervision Globale & Contrôle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Suivi en temps réel des heures révisées, examens passés et gestion des candidats.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2.5 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-[#F8C62F]" /> Actualiser
        </button>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Users */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilisateurs</span>
            <div className="p-2.5 rounded-xl bg-[#e6f5f3] dark:bg-[#03594e]/20 text-[#03594e] dark:text-[#F8C62F]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.total_candidates}</div>
            <p className="text-[11px] text-slate-400 mt-1">Candidats & administrateurs</p>
          </div>
        </div>

        {/* Total Study Hours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heures de Révision</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{metrics.total_global_hours || 0} <span className="text-sm font-medium text-slate-400">h</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Temps total passé sur l'application</p>
          </div>
        </div>

        {/* Total Exams Passed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examens Rendu</span>
            <div className="p-2.5 rounded-xl bg-[#e6f5f3] dark:bg-[#03594e]/20 text-[#03594e] dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#03594e] dark:text-emerald-400">{metrics.total_global_exams_completed || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">{metrics.total_global_attempts || 0} QCMs répondu au total</p>
          </div>
        </div>

        {/* Total Courses Validated */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cours Maîtrisés</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5 text-[#F8C62F]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.total_global_courses_completed || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Sur {metrics.total_courses} fiches de cours</p>
          </div>
        </div>

      </div>

      {/* Distribution & Key Generator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Target Exam Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 col-span-1 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" /> Répartition par Concours
            </h3>
          </div>
          
          <div className="space-y-3">
            {target_exam_distribution && target_exam_distribution.map((item, idx) => {
              const percentage = Math.round((item.count / (metrics.total_candidates || 1)) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="truncate max-w-[200px]">{item.name}</span>
                    <span className="font-bold">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#03594e] dark:bg-[#F8C62F]" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* License Key Generator */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 col-span-1 lg:col-span-2 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" /> Générateur de Clés ({metrics.unused_keys} libres / {metrics.total_keys} créées)
            </h3>
          </div>

          <form onSubmit={handleGenerateKeys} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Préfixe de la clé</label>
              <input
                type="text"
                value={keyPrefix}
                onChange={(e) => setKeyPrefix(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs uppercase focus:outline-none"
                placeholder="ex: CRMEF"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nombre de clés</label>
              <input
                type="number"
                min="1"
                max="50"
                value={keyCount}
                onChange={(e) => setKeyCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="py-2 px-4 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-[#F8C62F]" />}
              Générer
            </button>
          </form>

          {generatedKeys.length > 0 && (
            <div className="p-3 rounded-xl bg-[#e6f5f3] dark:bg-[#03594e]/20 border border-[#b3e6df] dark:border-slate-800 space-y-2">
              <h4 className="text-[11px] font-extrabold text-[#03594e] dark:text-[#F8C62F] uppercase">Clés générées :</h4>
              <div className="flex flex-wrap gap-2">
                {generatedKeys.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => copyToClipboard(k.key_code)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-[#03594e]/30 text-[#03594e] dark:text-[#F8C62F] text-xs font-mono font-bold hover:bg-[#e6f5f3] transition-all cursor-pointer"
                  >
                    {k.key_code} <Copy className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Candidate Control Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Table Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Gestion & Contrôle des Candidats ({filteredCandidates.length} / {candidates.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consultez les heures d'étude, examens passés et gérez les comptes</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Chercher nom, email, pseudo..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Exam Filter */}
            <select
              value={selectedExamFilter}
              onChange={(e) => setSelectedExamFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les concours</option>
              {target_exam_distribution && target_exam_distribution.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Utilisateur / Profil</th>
                <th className="px-4 py-3">Concours Cible</th>
                <th className="px-4 py-3">⏱️ Temps d'Étude</th>
                <th className="px-4 py-3">📝 Examens & QCMs</th>
                <th className="px-4 py-3">📚 Fiches Maîtrisées</th>
                <th className="px-4 py-3">⚡ Crédits IA</th>
                <th className="px-4 py-3">Rôle / Accès</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 font-medium">
                    Aucun utilisateur ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${!c.is_active ? 'opacity-50 bg-red-500/5' : ''}`}>
                    
                    {/* User Identity */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {c.is_online ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="En ligne (actif)" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" title="Hors ligne" />
                        )}
                        <span>{c.full_name}</span>
                        {c.is_staff && (
                          <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold">
                            👑 ADMIN
                          </span>
                        )}
                        {!c.is_active && (
                          <span className="text-[10px] bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full font-bold">
                            BANNIS
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">@{c.username} • {c.email}</div>
                    </td>

                    {/* Target Exam */}
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold inline-block max-w-[170px] truncate">
                        {c.target_exam}
                      </span>
                    </td>

                    {/* Time Spent Studying */}
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-[#03594e] dark:text-[#F8C62F] flex items-center gap-1 text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {c.study_formatted || (c.study_hours ? `${c.study_hours} h` : '< 1 min')}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        {c.is_online ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                            En ligne
                          </span>
                        ) : (
                          <span>Temps réel actif</span>
                        )}
                      </div>
                    </td>

                    {/* Exam & QCM attempts */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {c.exams_completed} examens terminés
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {c.total_attempts} QCM ({c.success_rate}% de réussite)
                      </div>
                    </td>

                    {/* Completed Courses */}
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-[#03594e] dark:text-[#F8C62F]">
                        {c.completed_courses} / {metrics.total_courses} fiches
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-[#03594e] dark:bg-[#F8C62F] rounded-full" 
                          style={{ width: `${Math.min(100, Math.round((c.completed_courses / (metrics.total_courses || 1)) * 100))}%` }}
                        />
                      </div>
                    </td>

                    {/* AI Credits */}
                    <td className="px-4 py-3.5">
                      {c.account_type === 'Premium' || c.is_staff ? (
                        <span className="text-[11px] text-amber-700 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full inline-block">
                          ⭐ Illimité
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number" 
                            min="0"
                            value={c.allowed_generations || 0}
                            onChange={(e) => handleUpdateGenerations(c.id, e.target.value)}
                            className="w-14 px-2 py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs text-center font-bold"
                          />
                          <span className="text-[10px] text-slate-400">crédits</span>
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <select
                        value={c.is_staff ? 'admin' : 'candidat'}
                        onChange={(e) => handleUpdateRole(c.id, e.target.value === 'admin')}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                      >
                        <option value="candidat">Candidat</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUserForPassword(c);
                            setNewPassword('');
                          }}
                          title="Modifier le mot de passe"
                          className="p-1.5 rounded-lg bg-[#e6f5f3] dark:bg-[#03594e]/20 text-[#03594e] dark:text-[#F8C62F] border border-[#b3e6df] dark:border-slate-800 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(c.id, c.is_active)}
                          title={c.is_active ? "Suspendre le compte" : "Réactiver le compte"}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                            c.is_active 
                              ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30' 
                              : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                          }`}
                        >
                          {c.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Change Password */}
      {selectedUserForPassword && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e6f5f3] dark:bg-[#03594e]/20 text-[#03594e] dark:text-[#F8C62F] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Modifier le Mot de Passe</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Compte : <span className="font-bold text-[#03594e] dark:text-[#F8C62F]">@{selectedUserForPassword.username}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserForPassword(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nouveau Mot de Passe (min 6 caractères)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Saisissez le nouveau mot de passe"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForPassword(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#03594e] text-white font-bold text-xs hover:bg-[#02473e] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {passwordLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#F8C62F]" /> : <CheckCircle2 className="w-4 h-4 text-[#F8C62F]" />}
                  Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-emerald-500/30 text-emerald-400 text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
