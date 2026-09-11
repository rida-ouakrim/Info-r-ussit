import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, BookOpen, FileText, Lock, Scale, AlertCircle, HelpCircle } from 'lucide-react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#f0f9f8 0%,#f5fcfb 50%,#e6f5f3 100%)',
      fontFamily: "'DM Sans', sans-serif",
      color: '#1B1D21',
      padding: '60px 24px 80px',
    }}>
      {/* Container */}
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* Back Link */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 12,
            background: '#ffffff',
            color: '#03594e',
            fontWeight: 800,
            fontSize: 14,
            textDecoration: 'none',
            border: '1px solid #b3e6df',
            boxShadow: '0 4px 14px rgba(3,89,78,0.06)',
            marginBottom: 32,
            transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e6f5f3'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
        >
          <ArrowLeft size={18} /> Retour à l'accueil
        </Link>

        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg,#03594e 0%,#046a5d 60%,#023d33 100%)',
          borderRadius: 24,
          padding: '40px 36px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(3,89,78,0.20)',
          marginBottom: 40,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={24} color="#F8C62F" />
            </div>
            <span style={{ background: '#F8C62F', color: '#1B1D21', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 12px', borderRadius: 6 }}>
              Document Officiel
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>
            Conditions Générales d'Utilisation
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: 650, lineHeight: 1.6 }}>
            Dernière mise à jour : 11 Septembre 2026. Veuillez lire attentivement les présentes conditions régissant l'utilisation de la plateforme Inforéussit.
          </p>
        </div>

        {/* Main Content Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: '40px 36px',
          border: '1px solid #d4ede9',
          boxShadow: '0 12px 40px rgba(3,89,78,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}>

          {/* Section 1 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                1. Objet et Présentation du Service
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              La plateforme <strong>Inforéussit</strong> est un service numérique éducatif dédié à la préparation aux concours informatiques (CRMEF Enseignement, Concours d'État IT, Data Science, Cloud, DBA). Elle met à disposition des utilisateurs des fiches de révision, des annales corrigées, des questionnaires interactifs et un assistant pédagogique basé sur l'intelligence artificielle.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 2 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                2. Inscription et Sécurité des Comptes
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: '0 0 12px' }}>
              Pour accéder aux fonctionnalités de révision et suivre votre avancement, vous devez créer un compte utilisateur valide. L'utilisateur s'engage à :
            </p>
            <ul style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Fournir des informations exactes et à jour lors de l'inscription (nom, prénom, e-mail).</li>
              <li>Conserver la confidentialité de son mot de passe et de ses identifiants de connexion.</li>
              <li>Informer immédiatement l'équipe Inforéussit de toute utilisation non autorisée de son compte.</li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 3 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                3. Propriété Intellectuelle
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              L'ensemble des contenus présents sur la plateforme Inforéussit (cours, fiches magistrales, illustrations, schémas, questions d'annales corrigées, code source et éléments graphiques) est protégé par les lois relatives à la propriété intellectuelle. Toute reproduction, distribution ou exploitation commerciale de tout ou partie du contenu sans autorisation écrite préalable est strictement interdite.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 4 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                4. Utilisation de l'Assistant IA & Contenus Générés
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              L'assistant IA proposé est conçu comme un outil d'accompagnement et de pédagogie. Les réponses fournies par l'IA visent à clarifier des concepts académiques. Bien que les réponses soient régulièrement affinées, l'utilisateur est encouragé à vérifier les notions complexes avec les fiches magistrales et les ressources officielles.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 5 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                5. Modification des Conditions
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              Inforéussit se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés de toute mise à jour importante via la plateforme ou par e-mail. L'utilisation continue du service après modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Contact Box */}
          <div style={{
            background: 'linear-gradient(135deg,#f0f9f8 0%,#e6f5f3 100%)',
            borderRadius: 18,
            padding: '24px 28px',
            border: '1px solid #b3e6df',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <HelpCircle size={24} color="#03594e" />
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0d1b1e' }}>Une question sur nos conditions ?</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Contactez-nous directement à ridaouakrim0@gmail.com</div>
              </div>
            </div>
            <a
              href="mailto:ridaouakrim0@gmail.com"
              style={{
                background: '#03594e',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 13.5,
                padding: '10px 20px',
                borderRadius: 12,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(3,89,78,0.20)',
              }}
            >
              Écrire au support
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
