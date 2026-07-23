import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Key, User, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle, ChevronDown } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    target_exam: 'CRMEF Informatique',
    license_key: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.license_key) {
          setError(`Clé d'Accès: ${data.license_key[0]}`);
        } else if (data.username) {
          setError(`Nom d'utilisateur: ${data.username[0]}`);
        } else if (data.email) {
          setError(`Email: ${data.email[0]}`);
        } else {
          setError("Erreur lors de l'inscription. Veuillez vérifier vos données.");
        }
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl space-y-8 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center mx-auto">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Inscription & Activation</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Renseignez vos coordonnées et votre Clé d'Accès Sécurisée</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                placeholder="Nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
              placeholder="Pseudo d'accès"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Adresse Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
              placeholder="exemple@domaine.ma"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mot de Passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Concours Cible</label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                1 Actif
              </span>
            </div>
            <div className="relative">
              <select
                name="target_exam"
                value={formData.target_exam}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none appearance-none pr-10 shadow-sm cursor-pointer transition-all"
              >
                <option value="CRMEF Informatique">CRMEF Secondaire Informatique (Disponible ✅)</option>
                <option value="Agrégation Informatique" disabled className="text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900">Agrégation de Génie Informatique (Bientôt disponible 🔒)</option>
                <option value="Master & Doctorat" disabled className="text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900">Master & Doctorat Informatique (Bientôt disponible 🔒)</option>
                <option value="Ingénieur d'État" disabled className="text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900">Concours Ingénieur d'État (Bientôt disponible 🔒)</option>
                <option value="Technicien & Administrateur" disabled className="text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900">Technicien / Administrateur Système (Bientôt disponible 🔒)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* LICENSE KEY INPUT FIELD */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              Clé d'Accès Sécurisée (Obligatoire)
            </label>
            <input
              type="text"
              name="license_key"
              value={formData.license_key}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/50 dark:bg-slate-950 border-2 border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono text-sm tracking-wider focus:border-amber-400 focus:outline-none"
              placeholder="ex: PASS-CONCOURS-2026"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Vérification en cours..." : (
              <>
                Activer mon Compte <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          Vous avez déjà un compte activé ?{' '}
          <Link to="/login" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
