import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, GraduationCap, Brain,
  ArrowRight, BookOpen, Sparkles,
  CheckCircle2, Compass, Database, Network,
  Server, Globe, Cpu, BarChart3, Clock, Target,
  ChevronRight, Play, Zap
} from 'lucide-react';

// ─── CRMEF Roadmap Data (7 modules) ──────────────────────────────────────────
const CRMEF_NODES = [
  {
    id: 'algo_base',
    category: 'INFO',
    num: 1,
    icon: Code2,
    title: 'Algorithmique & Bases de Programmation',
    subtitle: 'La base indispensable pour démarrer',
    weight: '40% du programme',
    duration: '7 à 10 jours',
    priority: 'Élevée',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20 dark:ring-[#F8C62F]/20', badge: 'bg-[#03594e]' },
    description: 'Maîtriser la syntaxe algorithmique, les variables, les structures conditionnelles, les boucles et la modularité. Préparer également les bases du Langage C et du Développement Web.',
    topics: [
      'Variables, constantes, types de données & opérateurs (DEV_ALGO 01–04)',
      'Structures conditionnelles (Si/Sinon/Selon) et Boucles (Pour, TantQue, Répéter)',
      'Tableaux 1D et 2D (vecteurs et matrices), Chaînes de caractères',
      'Procédures, fonctions, passage de paramètres et modularité',
      'Bases du Langage C & HTML5 / CSS3 / JavaScript / PHP'
    ],
    subdomains: ['DEV_ALGO', 'DEV_PROG_WEB'],
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
    duration: '10 à 12 jours',
    priority: 'Élevée',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20 dark:ring-[#F8C62F]/20', badge: 'bg-[#03594e]' },
    description: 'Comprendre comment stocker, organiser et traiter efficacement les données, et calculer la complexité des algorithmes avec la notation O.',
    topics: [
      'Complexité algorithmique : Notation Grand-O, analyse temporelle et spatiale',
      'Structures linéaires : Piles, Files, Listes chaînées (statiques et dynamiques)',
      'Algorithmes de Tri : Bulle, Sélection, Insertion, Rapide (QuickSort), Fusion',
      'Algorithmes de Recherche : Séquentielle, Dichotomique',
      'Arbres Binaires de Recherche (ABR), Graphes : DFS et BFS, Récursivité'
    ],
    subdomains: ['DEV_ALGO'],
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
    duration: '8 à 10 jours',
    priority: 'Élevée',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20 dark:ring-[#F8C62F]/20', badge: 'bg-[#03594e]' },
    description: 'Assimiler le fonctionnement des systèmes d\'exploitation, le modèle OSI/TCP-IP, l\'adressage réseau et la modélisation + interrogation de bases de données SQL.',
    topics: [
      'Systèmes d\'exploitation : processus, threads, ordonnancement, mémoire virtuelle',
      'Architecture de Von Neumann, pipeline, hiérarchie mémoire (RAM, Cache)',
      'Réseaux : modèle OSI & TCP/IP, adressage IPv4, CIDR, sous-réseaux',
      'Protocoles de routage (RIP, OSPF), bases de l\'IPv6',
      'Modélisation MCD/UML, Langage SQL (Jointures, Agrégats, Sous-requêtes)'
    ],
    subdomains: ['SYS_OS', 'SYS_ARCHI', 'SYS_NET', 'DEV_SI_BD'],
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
    duration: '6 à 8 jours',
    priority: 'Moyenne',
    color: { tag: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', border: 'border-amber-500', dot: 'bg-amber-500', ring: 'ring-amber-500/20', badge: 'bg-amber-500' },
    description: 'Étudier les concepts didactiques majeurs appliqués à l\'enseignement de l\'informatique et à l\'appropriation des savoirs par les élèves.',
    topics: [
      'Triangle didactique, contrat didactique et transposition didactique',
      'Conceptions des apprenants, représentations et obstacles didactiques',
      'Situations-problèmes et situations didactiques en informatique',
      'Curriculum officiel marocain d\'informatique (programmes secondaire)',
      'Démarches d\'investigation et apprentissage actif en classe'
    ],
    subdomains: ['DID_CONCEPTS', 'DID_APPROCHES', 'DID_CURRICULUM'],
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
    duration: '5 à 7 jours',
    priority: 'Moyenne',
    color: { tag: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', border: 'border-amber-500', dot: 'bg-amber-500', ring: 'ring-amber-500/20', badge: 'bg-amber-500' },
    description: 'Apprendre à concevoir une fiche de préparation pédagogique (janza) et à structurer des évaluations formatives et sommatives cohérentes.',
    topics: [
      'PPO (Pédagogie Par Objectifs) et APC (Approche Par Compétences)',
      'Structure d\'une fiche de préparation pédagogique (Janza)',
      'Gestion des phases : Mise en situation, Apprentissage, Évaluation',
      'Types d\'évaluation : Diagnostique, Formative, Sommative',
      'Ressources didactiques, TICE et outils (Scratch, Python en classe)'
    ],
    subdomains: ['DID_APPROCHES', 'DID_CURRICULUM'],
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
    subtitle: 'Les mécanismes fondamentaux de l\'élève',
    weight: '30% du programme',
    duration: '6 à 8 jours',
    priority: 'Moyenne',
    color: { tag: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300', border: 'border-violet-500', dot: 'bg-violet-500', ring: 'ring-violet-500/20', badge: 'bg-violet-500' },
    description: 'Assimiler les grands courants théoriques de la psychologie de l\'éducation et de la sociologie qui guident les pratiques pédagogiques actuelles.',
    topics: [
      'Le Béhaviorisme : Stimulus-Réponse, conditionnement classique et opérant',
      'Le Cognitivisme : traitement de l\'information, mémoire de travail, métacognition',
      'Le Constructivisme de Piaget : assimilation, accommodation, stades de développement',
      'Le Socio-constructivisme de Vygotski : Zone Proximale de Développement (ZPD)',
      'Psychologie du développement de l\'adolescent, motivation et styles d\'apprentissage'
    ],
    subdomains: ['EDU_PSYCHO', 'EDU_SOCIO'],
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
    duration: '5 à 6 jours',
    priority: 'Moyenne',
    color: { tag: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300', border: 'border-violet-500', dot: 'bg-violet-500', ring: 'ring-violet-500/20', badge: 'bg-violet-500' },
    description: 'Connaître l\'organisation du système éducatif marocain, les chartes nationales, les réformes éducatives et la déontologie du métier d\'enseignant.',
    topics: [
      'Charte Nationale de l\'Éducation et de la Formation (CNEF 2000)',
      'Loi-cadre 51.17 et Vision Stratégique 2015–2030',
      'Feuille de route 2022–2026 pour une école de qualité',
      'Sociologie : éducation inclusive, mixité, égalité des chances, décrochage scolaire',
      'Déontologie du métier d\'enseignant : droits, devoirs et éthique professionnelle'
    ],
    subdomains: ['EDU_SOCIO', 'EDU_PSYCHO'],
    actionLink: '/courses',
    actionLabel: 'Annales de Sciences de l\'Éducation',
    generatorLink: '/generator?subdomain=SCIENCES_EDU_PSYCHO',
    generatorLabel: 'QCM Système Éducatif'
  }
];

// ─── State Concours IT Nodes (unchanged) ─────────────────────────────────────
const STATE_NODES = [
  {
    id: 'ds_ml',
    category: 'DATA',
    num: 1,
    icon: Sparkles,
    title: '1. Machine Learning Supervisé & Non Supervisé',
    subtitle: 'Modélisation prédictive & Algorithmes classiques',
    weight: 'Spécialité Data & IA',
    duration: '8 à 10 jours',
    priority: 'Haute',
    color: { tag: 'bg-[#F8C62F]/20 text-[#946e00]', border: 'border-[#F8C62F]', dot: 'bg-[#F8C62F]', ring: 'ring-[#F8C62F]/20', badge: 'bg-[#F8C62F]' },
    description: 'Maîtriser la régression linéaire/logistique, les SVM, Random Forest, XGBoost et K-Means.',
    topics: [
      'Formulation mathématique OLS, Loss Log-Loss, SVM Margin',
      'Pénalités L1 (Lasso) vs L2 (Ridge) et sélection de variables',
      'Arbres de décision, Impureté de Gini et Entropie de Shannon',
      'K-Means, Inertie WCSS, Score de Silhouette et ACP/PCA',
      'Pipelines Scikit-Learn et validation croisée StratifiedKFold'
    ],
    actionLink: '/courses',
    actionLabel: 'Réviser les Fiches Machine Learning',
    generatorLink: '/generator?subdomain=DATA_SCIENCE_IA',
    generatorLabel: 'Générer un QCM IA ML'
  },
  {
    id: 'ds_dl',
    category: 'DATA',
    num: 2,
    icon: Cpu,
    title: '2. Deep Learning, CNN & PyTorch',
    subtitle: 'Réseaux de neurones profonds & Vision 2D/3D',
    weight: 'Spécialité Data & IA',
    duration: '10 à 12 jours',
    priority: 'Haute',
    color: { tag: 'bg-[#F8C62F]/20 text-[#946e00]', border: 'border-[#F8C62F]', dot: 'bg-[#F8C62F]', ring: 'ring-[#F8C62F]/20', badge: 'bg-[#F8C62F]' },
    description: 'Assimiler le MLP, la rétropropagation du gradient, les convolutions Conv2D et PyTorch.',
    topics: [
      'Fonctions d\'activation (ReLU, Leaky ReLU, Softmax)',
      'Formule de sortie Conv2D : O = (W - K + 2P)/S + 1',
      'Optimiseurs SGD Momentum et Adam',
      'Dropout et Batch Normalization pour l\'anti-surapprentissage',
      'Entraînement complet PyTorch avec nn.Module et DataLoader'
    ],
    actionLink: '/courses',
    actionLabel: 'Étudier les Leçons PyTorch & CNN',
    generatorLink: '/generator?subdomain=DATA_SCIENCE_IA',
    generatorLabel: 'Tester QCM Deep Learning'
  },
  {
    id: 'ds_nlp',
    category: 'DATA',
    num: 3,
    icon: Globe,
    title: '3. NLP, Transformers (BERT/GPT) & MLOps',
    subtitle: 'Traitement du langage & Déploiement IA',
    weight: 'Spécialité Data & IA',
    duration: '8 à 10 jours',
    priority: 'Haute',
    color: { tag: 'bg-[#F8C62F]/20 text-[#946e00]', border: 'border-[#F8C62F]', dot: 'bg-[#F8C62F]', ring: 'ring-[#F8C62F]/20', badge: 'bg-[#F8C62F]' },
    description: 'Comprendre l\'Attention Scalée Multi-Têtes, les modèles CamemBERT/GPT et l\'architecture RAG.',
    topics: [
      'TF-IDF, Embeddings denses Word2Vec (Skip-gram, CBOW)',
      'Équation de l\'Attention Scalée : Softmax(QK^T / sqrt(d_k)) V',
      'Architecture RAG avec Base de Données Vectorielle',
      'HuggingFace / Transformers en Python',
      'MLOps : DVC, MLflow, Data Drift vs Concept Drift'
    ],
    actionLink: '/courses',
    actionLabel: 'Consulter les Fiches Transformers & RAG',
    generatorLink: '/generator?subdomain=DATA_SCIENCE_IA',
    generatorLabel: 'Générer QCM IA NLP'
  },
  {
    id: 'info_algo',
    category: 'INFO',
    num: 4,
    icon: Code2,
    title: '4. Complexité Algorithmique & Design Patterns',
    subtitle: 'Socle du Génie Logiciel',
    weight: 'Informatique Générale',
    duration: '7 à 9 jours',
    priority: 'Élevée',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20', badge: 'bg-[#03594e]' },
    description: 'Évaluer la complexité asymptotique et implémenter les Design Patterns GoF.',
    topics: [
      'Complexité spatiale et temporelle (O(1), O(N log N), O(N^2))',
      'Patterns Créationnels (Singleton, Factory, Builder)',
      'Patterns Structurels (Adapter, Decorator, Proxy)',
      'Patterns Comportementaux (Observer, Strategy)',
      'Principes de conception SOLID'
    ],
    actionLink: '/courses',
    actionLabel: 'Voir la Fiche Complexité & Patterns',
    generatorLink: '/generator?subdomain=INFO_GEN_GL',
    generatorLabel: 'QCM Algorithmique & GL'
  },
  {
    id: 'info_dba',
    category: 'INFO',
    num: 5,
    icon: Database,
    title: '5. Administration BDD & SQL Tuning',
    subtitle: 'Gestion des transactions & Optimisation',
    weight: 'Bases de Données',
    duration: '6 à 8 jours',
    priority: 'Élevée',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20', badge: 'bg-[#03594e]' },
    description: 'Maîtriser les propriétés ACID, les niveaux d\'isolation et le tuning de requêtes SQL.',
    topics: [
      'Propriétés ACID (Atomicité, Cohérence, Isolation, Durabilité)',
      'Niveaux d\'isolation (Read Committed, Repeatable Read, Serializable)',
      'Indexation B-Tree vs Hash Index',
      'Analyse des plans d\'exécution avec EXPLAIN ANALYZE',
      'Requêtes analytiques et fonctions de fenêtrage (OVER/RANK)'
    ],
    actionLink: '/courses',
    actionLabel: 'Étudier les Fiches DBA & SQL',
    generatorLink: '/generator?subdomain=DBA_ADMIN',
    generatorLabel: 'S\'entraîner en SQL Tuning'
  }
];

// ─── Category display config ─────────────────────────────────────────────────
const CATEGORY_LABELS = {
  INFO: 'Spécialité Info (40%)',
  DIDACTIQUE: 'Didactique (30%)',
  SCIENCES_EDU: 'Sciences Éduc (30%)',
  DATA: 'Data & IA (40%)',
};

export default function Plan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStateConcours = user?.target_exam && !user.target_exam.toLowerCase().includes('crmef');
  const [selectedNode, setSelectedNode] = useState(null);

  const activeNodes = isStateConcours ? STATE_NODES : CRMEF_NODES;

  return (
    <div className="space-y-7 py-2 max-w-6xl mx-auto px-2 relative z-10">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/10 dark:text-[#F8C62F] text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            {isStateConcours ? "Plan de vol • Concours d'État IT & Data 2026" : "Votre plan de vol • Concours CRMEF 2026"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Plan de Répartition & Arbre de Révision
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Suivez cet arbre d'apprentissage structuré et équilibré pour maximiser vos révisions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {isStateConcours ? (
            <>
              <span className="px-3 py-1 rounded-lg bg-[#F8C62F] text-[#1B1D21] text-xs font-black">40% Data & IA</span>
              <span className="px-3 py-1 rounded-lg bg-[#03594e] text-white text-xs font-black">30% Info</span>
              <span className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black">30% DBA</span>
            </>
          ) : (
            <>
              <span className="px-3 py-1 rounded-lg bg-[#03594e] text-white text-xs font-black">40% Info</span>
              <span className="px-3 py-1 rounded-lg bg-amber-400 text-amber-900 text-xs font-black">30% Didactique</span>
              <span className="px-3 py-1 rounded-lg bg-violet-500 text-white text-xs font-black">30% Édu</span>
            </>
          )}
        </div>
      </div>

      {/* ─── Main Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Visual Tree Roadmap */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" /> Les étapes de votre préparation
            </h2>
            <span className="text-xs font-bold text-slate-400">Cliquez sur un module</span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:top-4 before:bottom-4 before:left-[17px] sm:before:left-[21px] before:w-0.5 before:bg-gradient-to-b before:from-[#03594e] before:via-amber-400 before:to-violet-500 before:opacity-30">
            {activeNodes.map((node, idx) => {
              const NodeIcon = node.icon;
              const isSelected = selectedNode?.id === node.id;
              const prevCat = idx > 0 ? activeNodes[idx - 1].category : null;
              const showSeparator = prevCat && prevCat !== node.category;

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative group"
                >
                  {/* Category separator */}
                  {showSeparator && (
                    <div className="flex items-center gap-2 mb-4 -ml-6 sm:-ml-8">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${node.color.tag}`}>
                        {CATEGORY_LABELS[node.category]}
                      </span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>
                  )}

                  {/* Timeline dot */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`absolute -left-[30px] sm:-left-[35px] top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center z-10 transition-all group-hover:scale-110 shadow-md cursor-pointer border-2 border-white dark:border-slate-900 ${node.color.dot}`}
                  >
                    <NodeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>

                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? `border-2 ${node.color.border} ring-2 ${node.color.ring} shadow-lg`
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${node.color.dot}`} />
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {/* Category tag */}
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase mb-1.5 ${node.color.tag}`}>
                          {CATEGORY_LABELS[node.category]}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#03594e] dark:group-hover:text-[#F8C62F] transition-colors leading-snug">
                          {node.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          {node.subtitle}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {node.duration}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-all ${isSelected ? `${node.color.dot.replace('bg-', 'text-')} translate-x-0.5` : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-500 group-hover:translate-x-0.5'}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="lg:col-span-5 sticky top-20">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden"
              >
                {/* Card header colored strip */}
                <div className={`${selectedNode.color.dot} px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <selectedNode.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                        {CATEGORY_LABELS[selectedNode.category]} • {selectedNode.weight}
                      </p>
                      <h3 className="text-sm font-extrabold text-white leading-snug truncate">
                        {selectedNode.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Meta info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {selectedNode.duration}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
                      <Zap className="w-3.5 h-3.5" /> Priorité {selectedNode.priority}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedNode.description}
                  </div>

                  {/* Topics */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Sujets majeurs à maîtriser
                    </h4>
                    <ul className="space-y-2">
                      {selectedNode.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${selectedNode.color.dot.replace('bg-', 'text-')}`} />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <button
                      onClick={() => navigate(selectedNode.actionLink)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md"
                    >
                      <BookOpen className="w-4 h-4 text-[#F8C62F]" /> {selectedNode.actionLabel}
                    </button>
                    <button
                      onClick={() => navigate(selectedNode.generatorLink)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#F8C62F] hover:bg-[#e0b228] text-[#1B1D21] font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-[#1B1D21]" /> {selectedNode.generatorLabel}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#03594e]/10 dark:bg-[#F8C62F]/10 flex items-center justify-center mx-auto">
                  <Compass className="w-7 h-7 text-[#03594e] dark:text-[#F8C62F] animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Sélectionnez une étape de l'arbre
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
                  Cliquez sur n'importe quel module à gauche pour afficher les sous-thèmes à maîtriser et lancer vos révisions ou vos QCM IA associés.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]">40% Info</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">30% Didactique</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">30% Édu</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
