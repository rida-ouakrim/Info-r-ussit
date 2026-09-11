import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { ChevronDown, RefreshCw } from 'lucide-react';

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
    verification_code: ''
  });

  // Visual Captcha state
  const canvasRef = useRef(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  // Verification Code state
  const [codeSent, setCodeSent] = useState(false);
  const [testCodeNotice, setTestCodeNotice] = useState(null);
  const [sendingCode, setSendingCode] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate random alphanumeric code (exclude confusing chars: 0/O, 1/I/l)
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  // Draw captcha on canvas with distortion effects
  const drawCaptcha = useCallback((code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    const bgColors = [
      ['#1e293b', '#0f172a', '#1e1b4b'],
      ['#0c1524', '#172036', '#1a1040'],
      ['#1a1a2e', '#16213e', '#0f3460'],
    ];
    const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
    grad.addColorStop(0, bg[0]);
    grad.addColorStop(0.5, bg[1]);
    grad.addColorStop(1, bg[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Noise dots
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * W,
        Math.random() * H,
        Math.random() * 2 + 0.5,
        0, Math.PI * 2
      );
      ctx.fillStyle = `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, ${100 + Math.random() * 155}, ${0.15 + Math.random() * 0.25})`;
      ctx.fill();
    }

    // Noise curves (wavy lines)
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${80 + Math.random() * 175}, ${80 + Math.random() * 175}, ${200 + Math.random() * 55}, ${0.25 + Math.random() * 0.3})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      const startY = Math.random() * H;
      ctx.moveTo(0, startY);
      for (let x = 0; x < W; x += 10) {
        ctx.lineTo(x, startY + Math.sin(x * 0.05 + i) * (10 + Math.random() * 15));
      }
      ctx.stroke();
    }

    // Straight decoy lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.lineTo(Math.random() * W, Math.random() * H);
      ctx.strokeStyle = `rgba(${150 + Math.random() * 100}, ${100 + Math.random() * 100}, ${200 + Math.random() * 55}, ${0.15 + Math.random() * 0.2})`;
      ctx.lineWidth = 1 + Math.random();
      ctx.stroke();
    }

    // Draw each character with individual styling
    const textColors = [
      '#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#34d399',
      '#fbbf24', '#fb923c', '#e879f9', '#22d3ee', '#67e8f9',
    ];
    const fonts = ['Georgia', 'Courier New', 'Arial Black', 'Verdana', 'Impact'];
    const charWidth = (W - 30) / code.length;

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 18 + i * charWidth;
      const y = H / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25 radians
      const fontSize = 26 + Math.floor(Math.random() * 8);
      const font = fonts[Math.floor(Math.random() * fonts.length)];

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Text shadow/glow
      ctx.shadowColor = textColors[Math.floor(Math.random() * textColors.length)];
      ctx.shadowBlur = 3 + Math.random() * 4;

      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.fillStyle = textColors[Math.floor(Math.random() * textColors.length)];
      ctx.textBaseline = 'middle';
      ctx.fillText(code[i], 0, 0);

      // Optional stroke outline on some chars
      if (Math.random() > 0.5) {
        ctx.strokeStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.strokeText(code[i], 0, 0);
      }

      ctx.restore();
    }

    // Extra noise dots on top
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.1})`;
      ctx.fill();
    }
  }, []);

  // Generate new captcha
  const generateCaptcha = useCallback(() => {
    const code = generateCode();
    setCaptchaCode(code);
    setUserCaptcha('');
    setIsCaptchaValid(false);
    // Draw on next tick so canvas ref is ready
    setTimeout(() => drawCaptcha(code), 0);
  }, [drawCaptcha]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleCaptchaChange = (e) => {
    const val = e.target.value.toUpperCase();
    setUserCaptcha(val);
    if (val.length === 5 && val === captchaCode) {
      setIsCaptchaValid(true);
    } else {
      setIsCaptchaValid(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    setError(null);
    if (!formData.email || !formData.email.includes('@')) {
      setError("Veuillez d'abord saisir une adresse e-mail valide dans le champ dédié.");
      return;
    }
    if (!isCaptchaValid) {
      setError("Veuillez d'abord recopier les 5 caractères du code de sécurité (Captcha) situé en bas du formulaire.");
      return;
    }

    setSendingCode(true);
    try {
      const res = await API.post('/auth/send-verification-code/', { email: formData.email });
      setCodeSent(true);
      if (res.data && res.data.code) {
        setTestCodeNotice(res.data.code);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erreur lors de l'envoi du code par email.");
      }
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isCaptchaValid) {
      setError("Veuillez d'abord recopier les 5 caractères du code de sécurité (Captcha) situé en bas du formulaire.");
      return;
    }
    if (!codeSent) {
      setError("Veuillez d'abord cliquer sur 'Envoyer le code par Email'.");
      return;
    }
    if (!formData.verification_code || formData.verification_code.length !== 6) {
      setError("Veuillez saisir le code de vérification à 6 chiffres.");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.verification_code) {
          setError(`Code de vérification: ${data.verification_code[0] || data.verification_code}`);
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

      <div style={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(3,89,78,0.10)',
        border: '1px solid #d4ede9',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 1,
      }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#e6f5f3', border: '1px solid #b3e6df', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <svg style={{ width: 22, height: 22, color: '#03594e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0d1b1e', margin: '0 0 4px' }}>Créer un compte</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Inscription gratuite avec vérification par email</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 14, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
            <span style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {codeSent && (
          <div style={{ padding: '14px 16px', borderRadius: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: 12.5, marginBottom: 18 }}>
            <p style={{ fontWeight: 800, fontSize: 13, margin: '0 0 4px' }}>
              Code de vérification envoyé à {formData.email}
            </p>
            {testCodeNotice ? (
              <p style={{ margin: 0, opacity: 0.9 }}>
                Mode test — Votre code : <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 15, padding: '2px 6px', background: '#dcfce7', borderRadius: 6, color: '#14532d' }}>{testCodeNotice}</span>
              </p>
            ) : (
              <p style={{ margin: 0, opacity: 0.9 }}>
                Consultez votre boîte de réception (et les spams) pour récupérer le code à 6 chiffres.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Prénom"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 13.5, color: '#0d1b1e', outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#03594e'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#d4ede9'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Nom"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 13.5, color: '#0d1b1e', outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#03594e'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#d4ede9'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Ex: mohamed_dev"
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 13.5, color: '#0d1b1e', outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={e => { e.target.style.borderColor = '#03594e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4ede9'; e.target.style.background = '#f8fafc'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>Concours cible</label>
            <div style={{ position: 'relative' }}>
              <select
                name="target_exam"
                value={formData.target_exam}
                onChange={handleChange}
                disabled
                style={{
                  width: '100%', padding: '11px 36px 11px 14px', borderRadius: 12, border: '1px solid #b3e6df', background: '#e6f5f3', fontSize: 13.5, fontWeight: 800, color: '#03594e', outline: 'none', appearance: 'none', boxSizing: 'border-box', cursor: 'default'
                }}
              >
                <option value="CRMEF Informatique">CRMEF Secondaire Informatique</option>
              </select>
              <div style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: '#03594e' }}>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B1D21', marginBottom: 6 }}>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 caractères"
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 13.5, color: '#0d1b1e', outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={e => { e.target.style.borderColor = '#03594e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4ede9'; e.target.style.background = '#f8fafc'; }}
            />
          </div>

          {/* EMAIL & VERIFICATION CODE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Adresse email</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={codeSent}
                  placeholder="votre.email@exemple.ma"
                  style={{
                    flex: 1, padding: '11px 14px', borderRadius: 12, border: '1px solid #d4ede9', background: '#f8fafc', fontSize: 13.5, color: '#0d1b1e', outline: 'none', boxSizing: 'border-box', opacity: codeSent ? 0.6 : 1
                  }}
                  onFocus={e => { if (!codeSent) { e.target.style.borderColor = '#03594e'; e.target.style.background = '#fff'; } }}
                  onBlur={e => { e.target.style.borderColor = '#d4ede9'; e.target.style.background = '#f8fafc'; }}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode}
                  style={{
                    background: '#03594e', color: '#fff', fontSize: 12.5, fontWeight: 800, padding: '11px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#02473e'}
                  onMouseLeave={e => e.currentTarget.style.background = '#03594e'}
                >
                  {sendingCode ? "Envoi..." : codeSent ? "Renvoyer" : "Envoyer le code"}
                </button>
              </div>
            </div>

            {codeSent && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#03594e', marginBottom: 6 }}>
                  Code de vérification à 6 chiffres
                </label>
                <input
                  type="text"
                  name="verification_code"
                  maxLength={6}
                  value={formData.verification_code}
                  onChange={handleChange}
                  required
                  placeholder="000000"
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12, border: '2px solid #F8C62F', background: '#fffbeb', fontSize: 18, fontWeight: 900, fontFamily: 'monospace', textAlign: 'center', letterSpacing: '0.4em', color: '#1B1D21', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            )}
          </div>

          {/* CAPTCHA VISUEL */}
          <div style={{ padding: '14px 16px', borderRadius: 14, background: '#f8fafc', border: '1px solid #d4ede9', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                Vérification de sécurité
              </label>
              <button
                type="button"
                onClick={generateCaptcha}
                style={{ fontSize: 11, fontWeight: 600, color: '#03594e', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={12} /> Nouveau code
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #cbd5e1', cursor: 'pointer', flexShrink: 0 }} onClick={generateCaptcha} title="Cliquer pour changer le code">
                <canvas
                  ref={canvasRef}
                  width={180}
                  height={52}
                  style={{ display: 'block' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <input
                  type="text"
                  value={userCaptcha}
                  onChange={handleCaptchaChange}
                  maxLength={5}
                  placeholder="Recopiez"
                  autoComplete="off"
                  spellCheck="false"
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 10, border: isCaptchaValid ? '2px solid #22c55e' : '1px solid #cbd5e1', background: isCaptchaValid ? '#f0fdf4' : '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.2em', textAlign: 'center', textTransform: 'uppercase', outline: 'none', boxSizing: 'border-box'
                  }}
                />
                {isCaptchaValid && (
                  <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, margin: 0 }}>
                    ✓ Captcha validé
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isCaptchaValid || !codeSent || formData.verification_code.length !== 6}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              background: '#03594e',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(3,89,78,0.25)',
              transition: 'all .2s',
              marginTop: 6,
              opacity: (loading || !isCaptchaValid || !codeSent || formData.verification_code.length !== 6) ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!loading && isCaptchaValid) e.currentTarget.style.background = '#02473e'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#03594e'; }}
          >
            {loading ? "Création en cours..." : "Créer mon compte gratuitement"}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13.5, color: '#64748b', marginTop: 20, paddingTop: 16, borderTop: '1px solid #e6f5f3' }}>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#03594e', fontWeight: 800, textDecoration: 'none' }} onMouseEnter={e => e.target.style.textDecoration = 'underline'} onMouseLeave={e => e.target.style.textDecoration = 'none'}>
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
