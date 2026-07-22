import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, FileCheck, Sparkles, Target,
  CheckCircle2, ArrowRight, Award, Users, Brain, Clock,
  ChevronRight, Mail, Phone, MapPin, Key
} from 'lucide-react';

/* ── Stats ──────────────────────────────────────────────── */
const STATS = [
  { value: '39', label: 'Fiches de Cours' },
  { value: '600+', label: 'Questions d\'Annales' },
  { value: '8', label: 'Examens Réels (2018–2025)' },
  { value: '6', label: 'Types de Concours Couverts' },
];

/* ── Concours Types ─────────────────────────────────────── */
const CONCOURS = [
  { code: '01', title: 'CRMEF Secondaire', desc: 'Concours de recrutement des enseignants d\'informatique du secondaire qualifiant.' },
  { code: '02', title: 'Agrégation Informatique', desc: 'Épreuves théoriques et pratiques du concours d\'agrégation marocain.' },
  { code: '03', title: 'Master & Doctorat', desc: 'Concours d\'accès aux masters spécialisés et formations doctorales.' },
  { code: '04', title: 'Ingénieur d\'État', desc: 'Concours de recrutement des ingénieurs informaticiens des services publics.' },
  { code: '05', title: 'Technicien Spécialisé', desc: 'Concours techniciens de l\'administration publique et collectivités.' },
  { code: '06', title: 'Administrateur Systèmes', desc: 'Concours administrateurs systèmes et réseaux du secteur étatique.' },
];

/* ── Features ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: BookOpen,
    title: '39 Fiches de Cours Structurées',
    desc: 'Cours complets organisés par domaine avec théorie, exemples, algorithmes et méthodes pour chaque type de concours.',
  },
  {
    icon: FileCheck,
    title: '600+ Questions d\'Annales Corrigées',
    desc: 'Examens officiels 2018–2025 avec corrections détaillées, barème et explication des points fréquents au jury.',
  },
  {
    icon: Sparkles,
    title: 'Assistant IA de Génération de QCM',
    desc: 'Génération de questionnaires ciblés sur vos points faibles avec correction immédiate et explications pédagogiques.',
  },
  {
    icon: Target,
    title: 'Suivi de Progression Personnalisé',
    desc: 'Tableau de bord avec taux de réussite, carnet d\'erreurs, questions favorites et reprise d\'examen en pause.',
  },
];

/* ── Component ──────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════════════════
          HERO — 2 colonnes : Texte gauche | Image droite
          ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Texte Hero */}
          <div>
            <span className="badge-academic mb-6 inline-block">
              Plateforme Nationale de Préparation aux Concours Informatiques
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Réussissez votre concours d'informatique avec une préparation d'excellence.
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
              Inforéussit réunit des fiches de cours rigoureuses, des annales corrigées et un assistant IA pédagogique pour vous accompagner jusqu'au succès — CRMEF, Agrégation, Master, Ingénieur, Technicien, Administrateur.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register" className="btn-primary text-base px-6 py-3">
                Activer ma clé d'accès <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-ghost text-base px-6 py-3">
                Se connecter
              </Link>
            </div>
          </div>

          {/* Image Hero — Informaticien heureux */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Halo décoratif derrière l'image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-50 dark:bg-blue-900/10 blur-3xl opacity-60"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm lg:max-w-md">
              <img
                src="/images/hero_developer.png"
                alt="Informaticien heureux — Inforéussit"
                className="w-full h-auto rounded-3xl shadow-2xl shadow-slate-300/50 dark:shadow-slate-900/80 object-cover"
                style={{ maxHeight: '520px', objectPosition: 'top' }}
              />

              {/* Badge flottant */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">600+ Questions</div>
                  <div className="text-[10px] text-slate-400">Annales 2018–2025</div>
                </div>
              </div>

              {/* Badge flottant 2 */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">39 Cours</div>
                  <div className="text-[10px] text-slate-400">Fiches structurées</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ── Stats Bar ─────────────────────────────────────── */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="stat-number mb-1">{s.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NOTRE VISION
          ══════════════════════════════════════════════════════ */}
      <section id="vision" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="badge-academic mb-4 inline-block">Notre Vision</span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-5"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Une académie conçue pour les candidats sérieux.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Notre plateforme est fondée sur la rigueur académique. Chaque ressource est conçue par des spécialistes pour répondre précisément aux exigences des jurys nationaux.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Nous couvrons l'ensemble des domaines évalués : algorithmique et structures de données, bases de données, systèmes d'exploitation, réseaux, architecture des machines et génie logiciel.
            </p>
            <ul className="space-y-3">
              {['Contenu aligné sur les programmes officiels', 'Annales vérifiées et corrigées par des experts', 'Interface pensée pour des sessions longues de révision'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Simple Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Brain, label: 'Algorithmique', sub: 'Tri, Graphes, Complexité' },
              { icon: Award, label: 'Bases de Données', sub: 'SQL, Modélisation, BD' },
              { icon: Users, label: 'Réseaux & Systèmes', sub: 'TCP/IP, Linux, Administration' },
              { icon: Clock, label: 'Gestion du temps', sub: 'Simulation d\'examen & Pause' },
            ].map(item => (
              <div key={item.label} className="glass-card feature-card rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{item.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TYPES DE CONCOURS
          ══════════════════════════════════════════════════════ */}
      <section id="concours" className="py-20 px-6 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="badge-academic mb-4 inline-block">Concours Couverts</span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Tous les concours informatiques marocains.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONCOURS.map((c) => (
              <div key={c.code} className="glass-card rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 font-mono">{c.code}</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NOS OUTILS
          ══════════════════════════════════════════════════════ */}
      <section id="outils" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="badge-academic mb-4 inline-block">Nos Outils</span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Tout ce dont vous avez besoin pour réussir.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card feature-card rounded-xl p-7 flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-1">
                <f.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BAND — styles 100% inline pour éviter tout conflit CSS
          ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#2563eb', padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '2rem',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '16px',
            lineHeight: '1.3',
          }}>
            Prêt à commencer votre préparation ?
          </h2>
          <p style={{
            color: '#bfdbfe',
            fontSize: '1rem',
            marginBottom: '36px',
            lineHeight: '1.7',
          }}>
            Activez votre clé d'accès nominative et commencez votre parcours vers la réussite dès aujourd'hui.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                color: '#1d4ed8',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              }}
            >
              <Key style={{ width: '16px', height: '16px', color: '#1d4ed8' }} />
              <span style={{ color: '#1d4ed8' }}>Activer ma clé d'accès</span>
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '14px',
                padding: '11px 24px',
                borderRadius: '8px',
                border: '1.5px solid rgba(255,255,255,0.5)',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: '#ffffff' }}>Déjà inscrit ? Se connecter</span>
              <ChevronRight style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════ */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-0.5 mb-4">
              <span className="font-extrabold text-2xl tracking-tight text-blue-400">Info</span>
              <span className="font-extrabold text-2xl tracking-tight text-white">réussit</span>
            </div>
            <p className="text-sm leading-relaxed">
              Plateforme nationale de référence pour la préparation aux concours de recrutement et de qualification en informatique au Maroc.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Activer une clé d'accès</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Connexion candidat</Link></li>
              <li><a href="#vision" className="hover:text-white transition-colors">Notre vision</a></li>
              <li><a href="#concours" className="hover:text-white transition-colors">Concours couverts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact & Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" /> <a href="mailto:ridaouarkim0@gmail.com" className="hover:text-white transition-colors">ridaouarkim0@gmail.com</a></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-500" /> 0702555943</li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <a href="https://github.com/rida-ouakrim" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub : rida-ouakrim</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-600">
          © 2026 ConcoursInfo. Tous droits réservés.
        </div>
      </footer>

    </div>
  );
}
