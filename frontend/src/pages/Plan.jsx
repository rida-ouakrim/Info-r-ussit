import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, GraduationCap, Brain,
  BookOpen, Sparkles, CheckCircle2,
  Compass, Database, Globe, BarChart3,
  Clock, Target, ChevronRight, Zap,
  Award, Check, Filter
} from 'lucide-react';

// ─── Target Exam Date (28 Novembre 2026 à 08:30) ─────────────────────────────
const EXAM_DATE = new Date('2026-11-28T08:30:00');

// ─── CRMEF 7 Modules Data ───────────────────────────────────────────────────
const CRMEF_NODES = [
  {
    id: 'algo_base',
    category: 'INFO',
    num: 1,
    icon: Code2,
    title: 'Algorithmique & Bases de Programmation',
    subtitle: 'La base indispensable pour démarrer',
    weight: '40% du programme',
    categoryLabel: 'Spécialité Informatique',
    priority: 'Très Haute',
    color: {
      tag: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      border: 'border-emerald-500',
      dot: 'bg-emerald-600',
      ring: 'ring-emerald-500/20'
    },
    description: 'Maîtriser la syntaxe algorithmique, les variables, les structures conditionnelles, les boucles et la modularité. Préparer également les bases du Langage C et du Développement Web.',
    topics: [
      'Variables, constantes, types de données & opérateurs (DEV_ALGO 01–04)',
      'Structures conditionnelles (Si/Sinon/Selon) et Boucles (Pour, TantQue, Répéter)',
      'Tableaux 1D et 2D (vecteurs et matrices), Chaînes de caractères',
      'Procédures, fonctions, passage de paramètres et modularité',
      'Bases du Langage C & HTML5 / CSS3 / JavaScript / PHP'
    ],
    actionLink: '/courses',
    actionLabel: 'Réviser les Fiches Algorithmique',
    generatorLink: '/generator?subdomain=DEV_ALGO',
    generatorLabel: 'Générer un Test IA Algo'
  },
  {
    id: 'struct_data',
    category: 'INFO',
    num: 2,
    icon: BarChart3,
    title: 'Structures de Données & Complexité',
    subtitle: 'Le cœur technique de la Spécialité',
    weight: '40% du programme',
    categoryLabel: 'Spécialité Informatique',
    priority: 'Très Haute',
    color: {
      tag: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      border: 'border-emerald-500',
      dot: 'bg-emerald-600',
      ring: 'ring-emerald-500/20'
    },
    description: 'Comprendre comment stocker, organiser et traiter efficacement les données, et calculer la complexité des algorithmes avec la notation Grand-O.',
    topics: [
      'Complexité algorithmique : Notation Grand-O, analyse temporelle et spatiale',
      'Structures linéaires : Piles, Files, Listes chaînées (statiques et dynamiques)',
      'Algorithmes de Tri : Bulle, Sélection, Insertion, Rapide (QuickSort), Fusion',
      'Algorithmes de Recherche : Séquentielle, Dichotomique',
      'Arbres Binaires de Recherche (ABR), Graphes : DFS et BFS, Récursivité'
    ],
    actionLink: '/courses',
    actionLabel: 'Ouvrir les Leçons de Structures',
    generatorLink: '/generator?subdomain=DEV_ALGO',
    generatorLabel: 'Générer QCM IA Structures'
  },
  {
    id: 'sys_net_bd',
    category: 'INFO',
    num: 3,
    icon: Database,
    title: 'Systèmes, Réseaux & Bases de Données',
    subtitle: 'L\'infrastructure informatique',
    weight: '40% du programme',
    categoryLabel: 'Spécialité Informatique',
    priority: 'Haute',
    color: {
      tag: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      border: 'border-emerald-500',
      dot: 'bg-emerald-600',
      ring: 'ring-emerald-500/20'
    },
    description: 'Assimiler le fonctionnement des systèmes d\'exploitation, le modèle OSI/TCP-IP, l\'adressage réseau et la modélisation + interrogation de bases de données SQL.',
    topics: [
      'Systèmes d\'exploitation : processus, threads, ordonnancement, mémoire virtuelle',
      'Architecture de Von Neumann, pipeline, hiérarchie mémoire (RAM, Cache)',
      'Réseaux : modèle OSI & TCP/IP, adressage IPv4, CIDR, sous-réseaux',
      'Protocoles de routage (RIP, OSPF), bases de l\'IPv6',
      'Modélisation MCD/UML, Langage SQL (Jointures, Agrégats, Sous-requêtes)'
    ],
    actionLink: '/courses',
    actionLabel: 'Étudier les Fiches Systèmes/SQL',
    generatorLink: '/generator?subdomain=DEV_SI_BD',
    generatorLabel: 'Générer un Test IA SQL/Réseaux'
  },
  {
    id: 'did_fondements',
    category: 'DIDACTIQUE',
    num: 4,
    icon: GraduationCap,
    title: 'Fondements de la Didactique Info',
    subtitle: 'Comment enseigner l\'informatique',
    weight: '30% du programme',
    categoryLabel: 'Didactique de l\'Informatique',
    priority: 'Très Haute',
    color: {
      tag: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      border: 'border-amber-500',
      dot: 'bg-amber-500',
      ring: 'ring-amber-500/20'
    },
    description: 'Étudier les concepts didactiques majeurs appliqués à l\'enseignement de l\'informatique et à l\'appropriation des savoirs par les élèves.',
    topics: [
      'Triangle didactique, contrat didactique et transposition didactique',
      'Conceptions des apprenants, représentations et obstacles didactiques',
      'Situations-problèmes et situations didactiques en informatique (Brousseau)',
      'Curriculum officiel marocain d\'informatique (programmes collège & lycée)',
      'Démarches d\'investigation et apprentissage actif en classe'
    ],
    actionLink: '/courses',
    actionLabel: 'Réviser les Fiches de Didactique',
    generatorLink: '/generator?subdomain=DID_CONCEPTS',
    generatorLabel: 'Générer QCM IA Didactique'
  },
  {
    id: 'did_planification',
    category: 'DIDACTIQUE',
    num: 5,
    icon: Target,
    title: 'Planification & Évaluation Didactique',
    subtitle: 'Préparer et valider les séances',
    weight: '30% du programme',
    categoryLabel: 'Didactique de l\'Informatique',
    priority: 'Haute',
    color: {
      tag: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      border: 'border-amber-500',
      dot: 'bg-amber-500',
      ring: 'ring-amber-500/20'
    },
    description: 'Apprendre à concevoir une fiche de préparation pédagogique (Janza / Jadada) et à structurer des évaluations formatives et sommatives cohérentes.',
    topics: [
      'PPO (Pédagogie Par Objectifs) et APC (Approche Par Compétences)',
      'Structure d\'une fiche de préparation pédagogique officielle (Janza)',
      'Gestion des phases : Mise en situation, Apprentissage, Évaluation',
      'Types d\'évaluation : Diagnostique, Formative, Sommative',
      'Ressources didactiques, TICE et outils (Scratch, Python en classe)'
    ],
    actionLink: '/courses',
    actionLabel: 'Tester sur les Annales Didactique',
    generatorLink: '/generator?subdomain=DID_CONCEPTS',
    generatorLabel: 'S\'entraîner en Didactique'
  },
  {
    id: 'edu_psycho',
    category: 'SCIENCES_EDU',
    num: 6,
    icon: Brain,
    title: 'Psychologie & Théories de l\'Apprentissage',
    subtitle: 'Les mécanismes cognitifs de l\'élève',
    weight: '30% du programme',
    categoryLabel: 'Sciences de l\'Éducation',
    priority: 'Haute',
    color: {
      tag: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      border: 'border-purple-500',
      dot: 'bg-purple-600',
      ring: 'ring-purple-500/20'
    },
    description: 'Assimiler les grands courants théoriques de la psychologie de l\'éducation qui guident les pratiques pédagogiques actuelles.',
    topics: [
      'Le Béhaviorisme : Stimulus-Réponse, conditionnement classique et opérant',
      'Le Cognitivisme : traitement de l\'information, mémoire de travail, métacognition',
      'Le Constructivisme de Piaget : assimilation, accommodation, stades de développement',
      'Le Socio-constructivisme de Vygotski : Zone Proximale de Développement (ZPD)',
      'Psychologie de l\'adolescent, motivation et gestion de classe'
    ],
    actionLink: '/courses',
    actionLabel: 'Fiches de Sciences de l\'Éducation',
    generatorLink: '/generator?subdomain=SCIENCES_EDU_PSYCHO',
    generatorLabel: 'Générer QCM IA Sciences Édu'
  },
  {
    id: 'edu_system',
    category: 'SCIENCES_EDU',
    num: 7,
    icon: Globe,
    title: 'Système Éducatif & Réformes au Maroc',
    subtitle: 'Le cadre légal et institutionnel',
    weight: '30% du programme',
    categoryLabel: 'Sciences de l\'Éducation',
    priority: 'Haute',
    color: {
      tag: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      border: 'border-purple-500',
      dot: 'bg-purple-600',
      ring: 'ring-purple-500/20'
    },
    description: 'Connaître l\'organisation du système éducatif marocain, les chartes nationales, les réformes éducatives et la déontologie du métier.',
    topics: [
      'Charte Nationale de l\'Éducation et de la Formation (CNEF 2000)',
      'Loi-cadre 51.17 et Vision Stratégique 2015–2030',
      'Feuille de route 2022–2026 pour une école de qualité',
      'Éducation inclusive, égalité des chances, décrochage scolaire',
      'Déontologie du métier d\'enseignant : droits, devoirs et éthique'
    ],
    actionLink: '/courses',
    actionLabel: 'Annales de Sciences de l\'Éducation',
    generatorLink: '/generator?subdomain=SCIENCES_EDU_PSYCHO',
    generatorLabel: 'QCM Système Éducatif'
  }
];

export default function Plan() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Selected module in detail panel (default: first module)
  const [selectedNode, setSelectedNode] = useState(CRMEF_NODES[0]);

  // Category filter: 'ALL' | 'INFO' | 'DIDACTIQUE' | 'SCIENCES_EDU'
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Mastered modules state (localStorage)
  const [masteredModules, setMasteredModules] = useState(() => {
    try {
      const saved = localStorage.getItem('crmef_mastered_modules');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleModuleMastered = (moduleId, e) => {
    if (e) e.stopPropagation();
    setMasteredModules((prev) => {
      const updated = { ...prev, [moduleId]: !prev[moduleId] };
      try {
        localStorage.setItem('crmef_mastered_modules', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const difference = EXAM_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter modules
  const filteredModules = activeCategory === 'ALL'
    ? CRMEF_NODES
    : CRMEF_NODES.filter((m) => m.category === activeCategory);

  const masteredCount = CRMEF_NODES.filter((m) => masteredModules[m.id]).length;
  const progressPercent = Math.round((masteredCount / CRMEF_NODES.length) * 100);

  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto px-2 sm:px-4 relative z-10">

      {/* ─── Top Banner: Compact & Professional Countdown ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/15 dark:text-[#F8C62F] text-[11px] font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Programme Officiel • Concours de Recrutement CRMEF (28 Novembre)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Plan d'Étude & Objectif J-{timeLeft.days} Jours
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Arbre pédagogique officiel structuré en 7 modules fondamentaux : Spécialité Informatique (40%), Didactique (30%) et Sciences de l’Éducation (30%).
            </p>
          </div>

          {/* Compact Countdown Badges */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 self-start lg:self-center">
            <div className="flex flex-col items-center w-13 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-lg sm:text-xl font-black text-[#03594e] dark:text-[#F8C62F] leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Jours</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 font-bold text-sm">:</span>
            <div className="flex flex-col items-center w-13 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200 leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Heures</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 font-bold text-sm">:</span>
            <div className="flex flex-col items-center w-13 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200 leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Min</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 font-bold text-sm">:</span>
            <div className="flex flex-col items-center w-13 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-lg sm:text-xl font-black text-amber-500 leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Sec</span>
            </div>
          </div>
        </div>

        {/* Progress Bar of Mastered Modules */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Progression globale : <strong className="text-[#03594e] dark:text-[#F8C62F]">{masteredCount} sur {CRMEF_NODES.length} modules validés</strong> ({progressPercent}%)
            </span>
          </div>

          <div className="flex-1 max-w-md w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#03594e] to-emerald-500 dark:from-[#F8C62F] dark:to-amber-400 h-full rounded-full transition-all duration-300 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── Filter Pills & Weight Badges ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-[#03594e] dark:text-[#F8C62F] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tous les modules ({CRMEF_NODES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('INFO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'INFO'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Spécialité (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('DIDACTIQUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'DIDACTIQUE'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Didactique (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('SCIENCES_EDU')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'SCIENCES_EDU'
                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sciences Édu (2)
          </button>
        </div>

        {/* Soft, harmonious pastel proportion badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] font-bold">
            Spécialité 40%
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 text-[11px] font-bold">
            Didactique 30%
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50 text-[11px] font-bold">
            Sciences Édu. 30%
          </span>
        </div>
      </div>

      {/* ─── ARBRE PÉDAGOGIQUE PAR DOMAINE (LES 7 MODULES) ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Modules List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" />
              Programme des 7 Modules Fondamentaux
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">Cliquez pour voir les détails</span>
          </div>

          <div className="space-y-3">
            {filteredModules.map((node, idx) => {
              const NodeIcon = node.icon;
              const isSelected = selectedNode?.id === node.id;
              const isMastered = !!masteredModules[node.id];

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => setSelectedNode(node)}
                  className={`bg-white dark:bg-slate-900 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? `border-2 ${node.color.border} ring-2 ${node.color.ring} shadow-sm`
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${node.color.dot} text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                        <NodeIcon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${node.color.tag}`}>
                            {node.weight}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            Module {node.num}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {node.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1">
                          {node.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => toggleModuleMastered(node.id, e)}
                        title={isMastered ? 'Marqué comme maîtrisé' : 'Marquer comme maîtrisé'}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isMastered
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-5 sticky top-20">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className={`${selectedNode.color.dot} px-5 py-4 text-white flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <selectedNode.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/80 uppercase">{selectedNode.categoryLabel}</p>
                      <h3 className="text-sm font-extrabold text-white leading-snug">{selectedNode.title}</h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-md shrink-0">
                    {selectedNode.weight}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedNode.description}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Points clés du programme</h4>
                    <ul className="space-y-2">
                      {selectedNode.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${selectedNode.color.dot.replace('bg-', 'text-')}`} />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button
                      type="button"
                      onClick={() => navigate(selectedNode.actionLink)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#F8C62F]" />
                      <span>{selectedNode.actionLabel}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(selectedNode.generatorLink)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#03594e]/10 dark:bg-[#F8C62F]/15 hover:bg-[#03594e] hover:text-white dark:hover:bg-[#F8C62F] dark:hover:text-slate-900 text-[#03594e] dark:text-[#F8C62F] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{selectedNode.generatorLabel}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
                <Compass className="w-8 h-8 text-[#03594e] dark:text-[#F8C62F] mx-auto animate-pulse" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sélectionnez un module à gauche</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                  Consultez les points clés officiels et accédez directement aux cours et tests QCM.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
