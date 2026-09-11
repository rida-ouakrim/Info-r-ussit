import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Database, Eye, UserCheck, HelpCircle, Key } from 'lucide-react';

const PrivacyPolicy = () => {
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
              <Shield size={24} color="#F8C62F" />
            </div>
            <span style={{ background: '#F8C62F', color: '#1B1D21', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 12px', borderRadius: 6 }}>
              Protection des données
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>
            Politique de Confidentialité
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: 650, lineHeight: 1.6 }}>
            Dernière mise à jour : 11 Septembre 2026. Découvrez comment nous protégeons et traitons vos données personnelles avec le plus haut niveau de sécurité.
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
                <Database size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                1. Données Personnelles Collectées
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: '0 0 12px' }}>
              Afin d'assurer le fonctionnement de la plateforme Inforéussit et d'adapter votre parcours de révision, nous collectons les données strictement nécessaires :
            </p>
            <ul style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong>Informations de compte :</strong> Nom, prénom, nom d'utilisateur et adresse e-mail.</li>
              <li><strong>Préférences de concours :</strong> Filière ou concours cible choisi (ex: CRMEF Informatique, Data Science, DBA, etc.).</li>
              <li><strong>Données de progression :</strong> Statut d'avancement des cours, scores aux QCM et annales corrigées.</li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 2 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                2. Utilisation de vos Données
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: '0 0 12px' }}>
              Vos données personnelles sont utilisées exclusivement pour :
            </p>
            <ul style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Personnaliser votre tableau de bord et les statistiques de révision.</li>
              <li>Vous envoyer des codes de vérification lors de l'inscription ou de la réinitialisation de votre mot de passe.</li>
              <li>Permettre au tuteur IA de générer des questions adaptées à votre niveau.</li>
              <li>Assurer le bon fonctionnement et la sécurité technique du service.</li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 3 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                3. Sécurité et Non-Partage des Données
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              Nous appliquons des mesures de sécurité strictes pour protéger vos données contre tout accès non autorisé. <strong>Inforéussit s'engage à ne jamais vendre, louer ni céder vos données personnelles à des tiers à des fins commerciales ou publicitaires.</strong>
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 4 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                4. Vos Droits et Gestion de votre Compte
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment en envoyant un e-mail à notre support à l'adresse <strong>ridaouakrim0@gmail.com</strong>.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e6f5f3', margin: 0 }} />

          {/* Section 5 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#e6f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={18} color="#03594e" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1b1e', margin: 0 }}>
                5. Conservation des Données
              </h2>
            </div>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              Vos données de révision sont conservées pendant toute la durée d'activité de votre compte afin d'assurer la continuité de votre avancement. Si votre compte demeure inactif pendant plus de 24 mois ou sur simple demande de votre part, vos données personnelles seront définitivement supprimées.
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
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0d1b1e' }}>Questions sur vos données ?</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Écrivez-nous à ridaouakrim0@gmail.com</div>
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
              Contacter le délégué aux données
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
