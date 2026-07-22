import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ShieldCheck, Users, Key, BookOpen, HelpCircle, Plus, 
  RefreshCw, CheckCircle2, AlertCircle, Copy 
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyPrefix, setKeyPrefix] = useState('INFO');
  const [keyCount, setKeyCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
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
    } catch (err) {
      console.error("Key generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Clé d'accès copiée avec succès !`);
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
      showToast("Nombre de générations mis à jour avec succès !");
    } catch (err) {
      console.error("Failed to update allowed generations:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-sky-400 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement du Panneau Administrateur...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, candidates, license_keys } = data;

  return (
    <div className="space-y-8 py-4">
      {/* Admin Header */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border-purple-500/30 flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Espace d'Administration
          </div>
          <h1 className="text-3xl font-extrabold text-white">Suivi de la Plateforme & Clés d'Accès</h1>
          <p className="text-sm text-slate-300">
            Supervisez la progression des candidats inscrits et gérez les clés d'activation.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Candidats Inscrits</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.total_candidates}</div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Clés Utilisées</span>
            <Key className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{metrics.used_keys} <span className="text-sm font-normal text-slate-400">/ {metrics.total_keys}</span></div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Clés Disponibles</span>
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300">{metrics.unused_keys}</div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Banque de Questions</span>
            <HelpCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.total_questions}</div>
        </div>
      </div>

      {/* License Key Generator Form */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-sky-400" /> Générateur de Clés d'Accès
        </h3>

        <form onSubmit={handleGenerateKeys} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Préfixe de la clé</label>
            <input
              type="text"
              value={keyPrefix}
              onChange={(e) => setKeyPrefix(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              placeholder="ex: CRMEF"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de clés à générer</label>
            <input
              type="number"
              min="1"
              max="20"
              value={keyCount}
              onChange={(e) => setKeyCount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-semibold text-sm shadow-md"
          >
            {generating ? "Génération..." : "Générer les Clés"}
          </button>
        </form>

        {generatedKeys.length > 0 && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase">Clés nouvellement générées :</h4>
            <div className="flex flex-wrap gap-2">
              {generatedKeys.map((k) => (
                <button
                  key={k.id}
                  onClick={() => copyToClipboard(k.key_code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono hover:bg-slate-800"
                >
                  {k.key_code} <Copy className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Candidates Table */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <h3 className="text-lg font-bold text-white">Progression des Candidats Inscrits</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Candidat</th>
                <th className="px-4 py-3">Concours Visé</th>
                <th className="px-4 py-3">Générations IA</th>
                <th className="px-4 py-3">Cours Maîtrisés</th>
                <th className="px-4 py-3">MCQ Répondus</th>
                <th className="px-4 py-3">Taux de Réussite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white">{c.full_name}</div>
                    <div className="text-xs text-slate-400">{c.email}</div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium text-sky-400">{c.target_exam}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0"
                        value={c.allowed_generations || 0}
                        onChange={(e) => handleUpdateGenerations(c.id, e.target.value)}
                        className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs text-center font-bold"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-white">{c.completed_courses}</span> <span className="text-xs text-slate-400">/ 39</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white">{c.total_attempts}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.success_rate >= 60 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {c.success_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-emerald-500/30 text-emerald-400 text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
