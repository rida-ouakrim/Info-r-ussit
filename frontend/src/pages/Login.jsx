import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Lock, User, LogIn, CheckCircle2, AlertCircle, ArrowRight, KeyRound, Mail, X, ArrowLeft, RefreshCw } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: enter email, 2: enter code & new password
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  const registeredMessage = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Identifiants incorrects ou compte inactif. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    setResetLoading(true);
    try {
      const res = await API.post('/auth/password-reset/send-code/', { email: resetEmail });
      setResetSuccess(res.data.message || "Code de réinitialisation envoyé par e-mail.");
      setResetStep(2);
    } catch (err) {
      setResetError(err.response?.data?.error || "Une erreur est survenue lors de l'envoi du mail.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    setResetLoading(true);
    try {
      const res = await API.post('/auth/password-reset/confirm/', {
        email: resetEmail,
        code: resetCode,
        new_password: newPassword
      });
      setSuccessMessage(res.data.message || "Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.");
      setIsResetModalOpen(false);
      setResetStep(1);
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      setResetError(err.response?.data?.error || "Une erreur est survenue lors de la réinitialisation.");
    } finally {
      setResetLoading(false);
    }
  };

  const openResetModal = () => {
    setIsResetModalOpen(true);
    setResetStep(1);
    setResetError(null);
    setResetSuccess(null);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      background: 'linear-gradient(135deg,#f0f9f8 0%,#e6f5f3 50%,#f8fefd 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '48px 24px',
    }}>

      {/* Background Shapes */}
      <img src="assets/img/shape/gallary-bg-4-1.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08, pointerEvents: 'none' }} onError={e => e.target.style.display = 'none'} />
      <img src="assets/img/shape/course-1-2.png" alt="" style={{ position: 'absolute', top: 40, right: 60, width: 120, opacity: 0.55, pointerEvents: 'none', animation: 'floatSlow 6s ease-in-out infinite' }} onError={e => e.target.style.display = 'none'} />
      <img src="assets/img/shape/brand-2-1.png" alt="" style={{ position: 'absolute', bottom: 40, right: 60, width: 140, opacity: 0.45, pointerEvents: 'none', animation: 'floatReverse 7s ease-in-out infinite' }} onError={e => e.target.style.display = 'none'} />
      <img src="assets/img/shape/about-1-2.png" alt="" style={{ position: 'absolute', bottom: 60, left: 60, width: 110, opacity: 0.45, pointerEvents: 'none' }} onError={e => e.target.style.display = 'none'} />
      <img src="assets/img/shape/about-6-2.png" alt="" style={{ position: 'absolute', top: 60, left: 50, width: 100, opacity: 0.4, pointerEvents: 'none', animation: 'floatSlow 8s ease-in-out infinite' }} onError={e => e.target.style.display = 'none'} />
      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: -80, right: '20%', width: 350, height: 350, background: 'rgba(3,89,78,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: '15%', width: 280, height: 280, background: 'rgba(248,198,47,0.07)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Form Card */}
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Main Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(3,89,78,0.10), 0 4px 16px rgba(3,89,78,0.06)',
          border: '1px solid #d4ede9',
          padding: '36px 32px',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: '#e6f5f3', border: '1px solid #b3e6df', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <LogIn size={22} color="#03594e" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0d1b1e', margin: '0 0 6px' }}>
              Connexion
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
              Accédez à votre espace candidat pour reprendre vos révisions.
            </p>
          </div>

          {/* Success Message from Registration or Password Reset */}
          {(registeredMessage || successMessage) && (
            <div style={{ padding: '12px 16px', borderRadius: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMessage || "Compte créé avec succès ! Connectez-vous ci-dessous."}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 14, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B1D21', marginBottom: 8 }}>
                Nom d'utilisateur
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="login-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Votre nom d'utilisateur"
                  style={{
                    width: '100%', padding: '12px 16px 12px 42px', borderRadius: 14,
                    border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 14,
                    color: '#0d1b1e', outline: 'none', transition: 'all .2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#03594e'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(3,89,78,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#d4ede9'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#1B1D21' }}>
                  Mot de Passe
                </label>
                <button
                  type="button"
                  onClick={openResetModal}
                  style={{
                    background: 'none', border: 'none', color: '#03594e',
                    fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    padding: 0, textDecoration: 'none'
                  }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 16px 12px 42px', borderRadius: 14,
                    border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 14,
                    color: '#0d1b1e', outline: 'none', transition: 'all .2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#03594e'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(3,89,78,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#d4ede9'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: 14,
                background: '#03594e', color: '#ffffff', fontWeight: 800, fontSize: 15,
                border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(3,89,78,0.25)',
                transition: 'all .2s', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, marginTop: 4,
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#02473e'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#03594e'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            >
              {loading ? <>Connexion en cours...</> : <>Se connecter <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: '#64748b' }}>
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              style={{ color: '#03594e', fontWeight: 800, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
            >
              S'inscrire gratuitement
            </Link>
          </div>

          {/* Trust Indicators */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid #e6f5f3', fontSize: 11.5, fontWeight: 600, color: '#94a3b8' }}>
            <span>🔒 Connexion sécurisée</span>
            <span>•</span>
            <span>🎓 Accès immédiat</span>
            <span>•</span>
            <span>📚 Programme officiel</span>
          </div>
        </div>

      </div>

      {/* ── Modal Mot de Passe Oublié ─────────────────────────────────── */}
      {isResetModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(13, 27, 30, 0.55)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            width: '100%', maxWidth: 440,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #d4ede9',
            padding: '32px 28px',
            position: 'relative',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: '#f1f5f9', border: 'none', borderRadius: 10,
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#64748b'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#e6f5f3', border: '1px solid #b3e6df', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <KeyRound size={22} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0d1b1e', margin: '0 0 6px' }}>
                {resetStep === 1 ? "Mot de passe oublié ?" : "Réinitialisation"}
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                {resetStep === 1
                  ? "Entrez votre adresse email pour recevoir un code de réinitialisation à 6 chiffres."
                  : `Un code a été envoyé à ${resetEmail}. Entrez le code et votre nouveau mot de passe.`}
              </p>
            </div>

            {/* Error Banner */}
            {resetError && (
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{resetError}</span>
              </div>
            )}

            {/* Success Banner */}
            {resetSuccess && (
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{resetSuccess}</span>
              </div>
            )}

            {/* Étape 1 : Saisie Email */}
            {resetStep === 1 && (
              <form onSubmit={handleSendResetCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>
                    Adresse E-mail
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      style={{
                        width: '100%', padding: '11px 14px 11px 40px', borderRadius: 12,
                        border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 13.5,
                        color: '#0d1b1e', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 13 }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    width: '100%', padding: '12px 18px', borderRadius: 12,
                    background: '#03594e', color: '#ffffff', fontWeight: 800, fontSize: 14,
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(3,89,78,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: resetLoading ? 0.7 : 1
                  }}
                >
                  {resetLoading ? <>Envoi en cours...</> : <>Envoyer le code <ArrowRight size={16} /></>}
                </button>
              </form>
            )}

            {/* Étape 2 : Saisie Code & Nouveau Mot de Passe */}
            {resetStep === 2 && (
              <form onSubmit={handleConfirmResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>
                    Code de vérification (6 chiffres)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.trim())}
                    placeholder="123456"
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 12,
                      border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 16,
                      fontWeight: 800, letterSpacing: 4, textAlign: 'center',
                      color: '#03594e', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>
                    Nouveau mot de passe
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%', padding: '11px 14px 11px 40px', borderRadius: 12,
                        border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 13.5,
                        color: '#0d1b1e', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 13 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    style={{
                      padding: '11px 16px', borderRadius: 12,
                      background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 13,
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <ArrowLeft size={16} /> Retour
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    style={{
                      flex: 1, padding: '11px 16px', borderRadius: 12,
                      background: '#03594e', color: '#ffffff', fontWeight: 800, fontSize: 13.5,
                      border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(3,89,78,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: resetLoading ? 0.7 : 1
                    }}
                  >
                    {resetLoading ? <>Réinitialisation...</> : <>Confirmer le mot de passe</>}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
