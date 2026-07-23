import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ShieldCheck, Users, Key, BookOpen, HelpCircle, Plus, 
  RefreshCw, CheckCircle2, AlertCircle, Copy, Lock, Eye, EyeOff, X 
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyPrefix, setKeyPrefix] = useState('INFO');
  const [keyCount, setKeyCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [toast, setToast] = useState(null);

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

  const handleUpdateAccountType = async (userId, newType) => {
    try {
      await API.post('auth/admin/update-generations/', { user_id: userId, account_type: newType });
      setData(prev => {
        const updatedCandidates = prev.candidates.map(c => 
          c.id === userId ? { ...c, account_type: newType } : c
        );
        return { ...prev, candidates: updatedCandidates };
      });
      showToast(`Statut mis à jour vers : ${newType === 'Premium' ? '⭐ Premium' : 'Standard'}`);
    } catch (err) {
      console.error("Failed to update account type:", err);
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
        <div className="flex items-center gap-3 text-sky-600 dark:text-sky-400 font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement du Panneau Administrateur...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, candidates } = data;

  return (
    <div className="space-y-8 py-4">
      
      {/* Admin Header Banner */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-slate-100 to-indigo-500/10 dark:from-purple-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-purple-500/20 dark:border-purple-500/30 flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Espace d'Administration Général
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Gestion des Utilisateurs & Clés</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Supervisez les comptes inscrits, modifiez les rôles/mots de passe et gérez les clés d'activation.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Utilisateurs Inscrits</span>
            <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.total_candidates}</div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Clés Utilisées</span>
            <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{metrics.used_keys} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {metrics.total_keys}</span></div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Clés Libres</span>
            <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-300">{metrics.unused_keys}</div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Banque QCM DB</span>
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.total_questions}</div>
        </div>
      </div>

      {/* License Key Generator Form */}
      <div className="glass-card p-6 rounded-2xl space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-sky-600 dark:text-sky-400" /> Générateur de Clés d'Accès Sécurisées
        </h3>

        <form onSubmit={handleGenerateKeys} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Préfixe de la clé</label>
            <input
              type="text"
              value={keyPrefix}
              onChange={(e) => setKeyPrefix(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm uppercase focus:border-sky-500 focus:outline-none"
              placeholder="ex: CRMEF"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre de clés à générer</label>
            <input
              type="number"
              min="1"
              max="50"
              value={keyCount}
              onChange={(e) => setKeyCount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Générer les Clés
          </button>
        </form>

        {generatedKeys.length > 0 && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Clés nouvellement générées (Cliquer pour copier) :</h4>
            <div className="flex flex-wrap gap-2">
              {generatedKeys.map((k) => (
                <button
                  key={k.id}
                  onClick={() => copyToClipboard(k.key_code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-50 dark:hover:bg-slate-900 transition-all shadow-sm"
                >
                  {k.key_code} <Copy className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Candidates & Users Table */}
      <div className="glass-card p-6 rounded-2xl space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gestion des Comptes Utilisateurs ({candidates.length})</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Gérez les rôles, types de comptes, crédits IA et mots de passe</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Utilisateur</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Statut Compte</th>
                <th className="px-4 py-3">Crédits IA</th>
                <th className="px-4 py-3">Progression</th>
                <th className="px-4 py-3 text-center">Mot de Passe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* User Info */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      {c.full_name}
                      {c.is_staff && (
                        <span className="text-[10px] bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                          👑 ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">@{c.username} • {c.email}</div>
                  </td>

                  {/* Role Selector */}
                  <td className="px-4 py-3.5">
                    <select
                      value={c.is_staff ? 'admin' : 'candidat'}
                      onChange={(e) => handleUpdateRole(c.id, e.target.value === 'admin')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:outline-none cursor-pointer"
                    >
                      <option value="candidat">Candidat</option>
                      <option value="admin">👑 Administrateur</option>
                    </select>
                  </td>

                  {/* Account Type Selector */}
                  <td className="px-4 py-3.5">
                    <select
                      value={c.account_type || 'Standard'}
                      onChange={(e) => handleUpdateAccountType(c.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Standard">Normale</option>
                      <option value="Premium">⭐ Premium</option>
                    </select>
                  </td>

                  {/* AI Generations Counter */}
                  <td className="px-4 py-3.5">
                    {c.account_type === 'Premium' || c.is_staff ? (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full inline-block">
                        ∞ Illimité
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="number" 
                          min="0"
                          value={c.allowed_generations || 0}
                          onChange={(e) => handleUpdateGenerations(c.id, e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs text-center font-bold"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400">crédits</span>
                      </div>
                    )}
                  </td>

                  {/* Progression */}
                  <td className="px-4 py-3.5">
                    <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      {c.completed_courses} / 39 cours
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.total_attempts} QCM ({c.success_rate}%)
                    </div>
                  </td>

                  {/* Change Password Action */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => {
                        setSelectedUserForPassword(c);
                        setNewPassword('');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-semibold transition-all shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Changer MDP
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Change Password */}
      {selectedUserForPassword && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Modifier le Mot de Passe</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Compte : <span className="font-semibold text-sky-600 dark:text-sky-400">@{selectedUserForPassword.username}</span>
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
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
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
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  {passwordLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Enregistrer le Mot de Passe
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
