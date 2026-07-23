import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import {
  BookOpen, FileCheck, Sparkles, Target,
  CheckCircle2, ArrowRight, Award, Users, Brain, Clock,
  ChevronRight, ChevronLeft, Mail, Phone, MapPin, Key
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
  const [activeSlide, setActiveSlide] = useState(0);
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
                src={heroImg}
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
          APERÇU SLIDER DES QCM & CORRECTIONS (EXAM CAROUSEL SHOWCASE)
          ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="badge-academic inline-block">Aperçu Réel des Épreuves</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Visualisez la structure de nos QCM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Basculez entre les aperçus pour voir la coloration du code, la gestion des tableaux et le format des explications.
            </p>
          </div>

          {/* Slider Tab Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveSlide(0)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSlide === 0
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              💻 1. Code & Algorithmes
            </button>
            <button
              onClick={() => setActiveSlide(1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSlide === 1
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              📊 2. Tableaux & Formules
            </button>
            <button
              onClick={() => setActiveSlide(2)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSlide === 2
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              ⚡ 3. Corrections & Astuces
            </button>
          </div>

          {/* Interactive Slide Card Container */}
          <div className="relative glass-card p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[380px] flex flex-col justify-between">
            
            {/* SLIDE 0: Code Algorithmique */}
            {activeSlide === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                  <span>Q1 : Algorithmique & Logique</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">Question avec Code Source</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">On considère l'algorithme suivante :</p>
                
                {/* Code Snippet Box */}
                <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 shadow-inner overflow-x-auto">
                  <div className="text-slate-500 pb-1 flex items-center justify-between border-b border-slate-800 text-[11px] mb-2">
                    <span>&gt;_ Algorithme / Code Source</span>
                    <span className="text-slate-400">Copier</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-bold">ALGORITHME</span> : Évaluation logique<br/>
                    <span className="text-purple-400 font-bold">VARIABLES</span> : <span className="text-sky-300">a, b</span>: <span className="text-emerald-400">Entier</span>, <span className="text-sky-300">y</span>: <span className="text-emerald-400">Booléen</span><br/>
                    <span className="text-purple-400 font-bold">DÉBUT</span><br/>
                    &nbsp;&nbsp;a &lt;- <span className="text-amber-400">10</span>; b &lt;- <span className="text-amber-400">20</span>; y &lt;- <span className="text-emerald-400">VRAI</span><br/>
                    &nbsp;&nbsp;résultat &lt;- (a = 10 <span className="text-amber-400 font-bold">ET</span> b ≠ 15) <span className="text-amber-400 font-bold">OU</span> y<br/>
                    &nbsp;&nbsp;<span className="text-sky-400">Ecrire</span> résultat<br/>
                    <span className="text-purple-400 font-bold">FIN</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold pt-1">Quelle est la valeur finale de résultat ?</p>
                
                {/* Option Choices */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300">
                    <strong className="text-sky-600">A)</strong> FAUX
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300">
                    <strong className="text-sky-600">B)</strong> 10
                  </div>
                  <div className="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-between col-span-2 sm:col-span-1">
                    <span><strong className="text-emerald-600">C)</strong> VRAI</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300">
                    <strong className="text-sky-600">D)</strong> 1 ET 0
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 1: Tableaux & Formules */}
            {activeSlide === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                  <span>Q70 : Systèmes d'Information & Excel</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Tableau de Données</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  On considère le tableau suivant présentant des informations sur les produits vendus :
                </p>

                {/* Data Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <table className="w-full text-left text-xs font-medium text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-slate-950 font-bold border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                      <tr>
                        <th className="p-2 text-center bg-slate-200 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 w-8">#</th>
                        <th className="p-2">A (Produit)</th>
                        <th className="p-2">B (Catégorie)</th>
                        <th className="p-2">C (Région)</th>
                        <th className="p-2">D (Ventes €)</th>
                        <th className="p-2">E (Stock)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2 text-center font-bold bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">2</td>
                        <td className="p-2 font-bold text-slate-900 dark:text-white">Stylo</td>
                        <td className="p-2">Fournitures</td>
                        <td className="p-2">Nord</td>
                        <td className="p-2 font-mono">150</td>
                        <td className="p-2 text-emerald-600 font-bold">Oui</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2 text-center font-bold bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">3</td>
                        <td className="p-2 font-bold text-slate-900 dark:text-white">Imprimante</td>
                        <td className="p-2">Électronique</td>
                        <td className="p-2">Nord</td>
                        <td className="p-2 font-mono">850</td>
                        <td className="p-2 text-emerald-600 font-bold">Oui</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold">
                  Quelle formule Excel permet de compter le nombre de produits de la catégorie "Fournitures" ?
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200">
                    <strong className="text-sky-600 font-sans">A)</strong> =NB.SI(B2:B8; "Fournitures")
                  </div>
                  <div className="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 font-mono text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-between">
                    <span><strong className="text-emerald-600 font-sans">B)</strong> =NB.SI(B3:B8; "Fournitures")</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: Corrections & Astuces */}
            {activeSlide === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                  <span>Correction Détaillée & Astuces du Jury</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">Pédagogie</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">Q72 : Dans Excel, quel est le rôle principal d'un tableau croisé dynamique ?</p>

                {/* Correction Box */}
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>❌ Incorrect. Bonne réponse : D</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Un tableau croisé dynamique (TCD) permet de synthétiser de grandes quantités de données et de les analyser sous différents angles.
                  </p>
                </div>

                {/* Astuce Concours Box */}
                <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-800 dark:text-sky-300 text-xs leading-relaxed flex items-start gap-2">
                  <span className="text-base shrink-0">⚡</span>
                  <div>
                    <strong className="font-bold text-sky-900 dark:text-sky-200">Astuce Concours :</strong> Pensez 'RAP' pour Résumer, Analyser, Présenter. Le TCD est l'outil d'analyse par excellence du jury.
                  </div>
                </div>
              </div>
            )}

            {/* Slider Navigation Arrows & Dots */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1))}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>

              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeSlide === idx ? 'w-6 bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1))}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BAND — styles 100% inline pour éviter tout conflit CSS
          ══════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', padding: '80px 24px' }}>
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
            color: '#e0e7ff',
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
                color: '#6d28d9',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              }}
            >
              <Key style={{ width: '16px', height: '16px', color: '#6d28d9' }} />
              <span style={{ color: '#6d28d9' }}>Activer ma clé d'accès</span>
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
