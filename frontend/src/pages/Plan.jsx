import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, GraduationCap, Brain,
  ArrowRight, BookOpen, Sparkles,
  CheckCircle2, Compass, Database,
  Globe, Cpu, BarChart3, Clock, Target,
  ChevronRight, Zap, Calendar, Smartphone,
  CheckSquare, Award, Flame, AlertCircle,
  HelpCircle, X, ChevronDown, Check
} from 'lucide-react';

// ─── Target Exam Date (28 Novembre 2026 à 08:30) ─────────────────────────────
const EXAM_DATE = new Date('2026-11-28T08:30:00');

// ─── Sprint 24 Jours Data ───────────────────────────────────────────────────
const SPRINT_PHASES = [
  {
    id: 'phase_info',
    title: 'Phase 1 • Spécialité Informatique (40%)',
    period: 'J-24 à J-15 (10 Jours)',
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    icon: Code2,
    description: 'Le socle technique le plus lourd du concours. Maîtrise des algorithmes, structures de données, systèmes et bases de données.',
    days: [
      {
        id: 'sprint_d1_2',
        dayLabel: 'Jours 1 & 2 (J-24 / J-23)',
        title: 'Algorithmique & Modularité (Bases & Langage C)',
        tasks: [
          'Syntaxe algorithmique : types primitifs, opérateurs et structures conditionnelles',
          'Boucles fondamentales (Pour, TantQue, Répéter..Jusqu’à) & pièges des compteurs',
          'Tableaux 1D/2D (matrices), chaînes de caractères et manipulation de mémoire',
          'Sous-programmes : Procédures vs Fonctions, passage par valeur vs par adresse (pointeurs C)'
        ],
        link: '/courses',
        linkText: 'Fiches Algorithmique & C',
        qcmLink: '/generator?subdomain=DEV_ALGO'
      },
      {
        id: 'sprint_d3_4',
        dayLabel: 'Jours 3 & 4 (J-22 / J-21)',
        title: 'Complexité Algorithmique, Tris & Recherche',
        tasks: [
          'Notation Grand-O : calcul de complexité temporelle et spatiale au pire et moyen cas',
          'Tris classiques : Tri à bulles, Tri par sélection, Tri par insertion',
          'Tris avancés (Diviser pour régner) : Tri Rapide (QuickSort) & Tri Fusion (MergeSort)',
          'Recherche séquentielle vs Recherche dichotomique (conditions d\'arrêt et complexité)'
        ],
        link: '/courses',
        linkText: 'Leçons Tris & Complexité',
        qcmLink: '/generator?subdomain=DEV_ALGO'
      },
      {
        id: 'sprint_d5_6',
        dayLabel: 'Jours 5 & 6 (J-20 / J-19)',
        title: 'Structures Linéaires & Arborescentes (ABR, Graphes)',
        tasks: [
          'Structures linéaires dynamiques : Piles (LIFO), Files (FIFO), Listes chaînées simples et doubles',
          'Arbres Binaires de Recherche (ABR) : parcours préfixe, infixe, postfixe et hauteur',
          'Notions de Graphes : Matrice d\'adjacence, parcours en largeur (BFS) et profondeur (DFS)',
          'Récursivité : cas de base, pile d\'appels et conversion itérative'
        ],
        link: '/courses',
        linkText: 'Arbres & Graphes',
        qcmLink: '/generator?subdomain=DEV_ALGO'
      },
      {
        id: 'sprint_d7_8',
        dayLabel: 'Jours 7 & 8 (J-18 / J-17)',
        title: 'Systèmes d’Exploitation & Architecture des Ordinateurs',
        tasks: [
          'Architecture de Von Neumann, CPU, registres, cache, bus et pipeline',
          'Systèmes : Gestion des processus, threads, commutation de contexte et synchronisation',
          'Gestion de la mémoire : pagination, segmentation, mémoire virtuelle et défaut de page',
          'Linux & Shell : arborescence, commandes usuelles, permissions (chmod/chown) et tubes/redirections'
        ],
        link: '/courses',
        linkText: 'Systèmes & Linux',
        qcmLink: '/generator?subdomain=SYS_OS'
      },
      {
        id: 'sprint_d9_10',
        dayLabel: 'Jours 9 & 10 (J-16 / J-15)',
        title: 'Réseaux Informatiques & Bases de Données (SQL)',
        tasks: [
          'Modèle OSI (7 couches) vs Modèle TCP/IP (4 couches), encapsulation et protocoles clés',
          'Adressage IPv4, masque de sous-réseau, calcul de plages CIDR, notions de routage',
          'Modélisation relationnelle : MCD (Merise), passage au MLD, clés primaires et étrangères',
          'SQL avancé : Jointures (INNER, LEFT), fonctions d\'agrégation, GROUP BY / HAVING, sous-requêtes'
        ],
        link: '/courses',
        linkText: 'Réseaux & SQL',
        qcmLink: '/generator?subdomain=DEV_SI_BD'
      }
    ]
  },
  {
    id: 'phase_didactique',
    title: 'Phase 2 • Didactique de l’Informatique (30%)',
    period: 'J-14 à J-8 (7 Jours)',
    color: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    icon: GraduationCap,
    description: 'Comment transformer les concepts informatiques purs en objets d\'apprentissage compréhensibles par les élèves du secondaire.',
    days: [
      {
        id: 'sprint_did_1',
        dayLabel: 'Jours 11 & 12 (J-14 / J-13)',
        title: 'Concepts Clés : Triangle, Transposition & Obstacles',
        tasks: [
          'Triangle didactique (Enseignant - Savoir - Apprenant) et relations associées',
          'Transposition didactique : du savoir savant au savoir enseigné puis appris',
          'Contrat didactique, rupture de contrat et effets pervers (Effet Topaze, Jourdain)',
          'Représentations initiales, conceptions alternatives et identification des obstacles épistémologiques'
        ],
        link: '/courses',
        linkText: 'Fiches Théorie Didactique',
        qcmLink: '/generator?subdomain=DID_CONCEPTS'
      },
      {
        id: 'sprint_did_2',
        dayLabel: 'Jours 13 & 14 (J-12 / J-11)',
        title: 'Situations Didactiques & Pédagogie de l’Informatique',
        tasks: [
          'Théorie des Situations Didactiques de Brousseau (Action, Formulation, Validation, Institutionnalisation)',
          'Différence fondamentale entre PPO (Objectifs) et APC (Approche Par Compétences)',
          'Démarche d\'investigation et résolution de problèmes algorithmiques en classe',
          'Curriculum marocain de l\'informatique : programmes du collège et du lycée (Tronc Commun, 1ère/2ème Bac)'
        ],
        link: '/courses',
        linkText: 'Curriculum & Démarches',
        qcmLink: '/generator?subdomain=DID_APPROCHES'
      },
      {
        id: 'sprint_did_3',
        dayLabel: 'Jours 15 & 16 (J-10 / J-9)',
        title: 'Conception de la Fiche Pédagogique (Jadada / Janza)',
        tasks: [
          'En-tête officiel : Niveau, Module, Compétence visée, Prérequis, Durée, Matériel didactique',
          'Découpage des phases de séance : Phase préparatoire, Apprentissage, Synthèse, Évaluation',
          'Formulation rigoureuse des objectifs opérationnels avec verbes d\'action mesurables',
          'Rôles respectifs : Activité de l\'enseignant vs Activités des apprenants et modalité de travail'
        ],
        link: '/courses',
        linkText: 'Modèles de Fiches Pédagogiques',
        qcmLink: '/generator?subdomain=DID_APPROCHES'
      },
      {
        id: 'sprint_did_4',
        dayLabel: 'Jour 17 (J-8)',
        title: 'Évaluations Didactiques & Outils Numériques (TICE)',
        tasks: [
          'Typologie des évaluations : Diagnostique (prérequis), Formative (régulation), Sommative (bilan)',
          'Critères et indicateurs de remédiation pédagogique pour les élèves en difficulté',
          'Intégration des TICE : Utilisation didactique de Scratch, Python, Flowgorithm et plateformes interactives'
        ],
        link: '/courses',
        linkText: 'Évaluation & TICE',
        qcmLink: '/generator?subdomain=DID_CURRICULUM'
      }
    ]
  },
  {
    id: 'phase_sciences_edu',
    title: 'Phase 3 • Sciences de l’Éducation & Système Éducatif (30%)',
    period: 'J-7 à J-4 (4 Jours)',
    color: 'from-violet-600 to-indigo-700',
    borderColor: 'border-violet-500/30',
    badgeBg: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    icon: Brain,
    description: 'Les grands courants psychopédagogiques et le cadre légal/institutionnel du système éducatif marocain.',
    days: [
      {
        id: 'sprint_edu_1',
        dayLabel: 'Jours 18 & 19 (J-7 / J-6)',
        title: 'Psychologie & Théories d’Apprentissage',
        tasks: [
          'Le Béhaviorisme (Watson, Pavlov, Skinner) : conditionnement opérant, renforcement',
          'Le Constructivisme de Jean Piaget : assimilation, accommodation, équilibration et stades cognitifs',
          'Le Socio-constructivisme de Lev Vygotski : Zone Proximale de Développement (ZPD) et médiation',
          'Le Cognitivisme : modèle du traitement de l’information, mémoire de travail et métacognition'
        ],
        link: '/courses',
        linkText: 'Fiches Théories d’Apprentissage',
        qcmLink: '/generator?subdomain=SCIENCES_EDU_PSYCHO'
      },
      {
        id: 'sprint_edu_2',
        dayLabel: 'Jours 20 & 21 (J-5 / J-4)',
        title: 'Système Éducatif Marocain & Textes Officiels',
        tasks: [
          'Charte Nationale de l’Éducation et de la Formation (CNEF)',
          'Vision Stratégique 2015-2030 & Loi-cadre 51.17 : leviers clés et principes fondamentaux',
          'Feuille de Route 2022-2026 : les 3 axes (Élève, Enseignant, Établissement) et Écoles pionnières',
          'Déontologie du métier d\'enseignant : devoirs, droits, éthique professionnelle et vie scolaire'
        ],
        link: '/courses',
        linkText: 'Système Éducatif & Réformes',
        qcmLink: '/generator?subdomain=SCIENCES_EDU_PSYCHO'
      }
    ]
  },
  {
    id: 'phase_annales',
    title: 'Phase 4 • Sprint Final : Annales Blanches & Derniers Réglages',
    period: 'J-3 à J-1 (3 Jours)',
    color: 'from-rose-600 to-red-700',
    borderColor: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    icon: Flame,
    description: 'Simulations en conditions réelles d\'examen pour caler la gestion du temps et éliminer les hésitations.',
    days: [
      {
        id: 'sprint_ann_1',
        dayLabel: 'Jour 22 (J-3)',
        title: 'Simulation Épreuve Spécialité Informatique (Chronométrée)',
        tasks: [
          'Passage complet de l\'épreuve écrite 2024 en temps limité (3 heures sans interruption)',
          'Correction rigoureuse et identification des lacunes persistantes (SQL ou Complexité)',
          'Revue des questions récurrentes d\'algorithmique'
        ],
        link: '/exams',
        linkText: 'Ouvrir Annales Spécialité',
        qcmLink: '/generator?subdomain=DEV_ALGO'
      },
      {
        id: 'sprint_ann_2',
        dayLabel: 'Jour 23 (J-2)',
        title: 'Simulation Épreuve Didactique & Sciences de l’Éducation',
        tasks: [
          'Passage complet de l\'épreuve Didactique 2023/2024',
          'Rédaction chronométrée d\'une fiche pédagogique type (Jadada) sur un thème du Tronc Commun',
          'Vérification des définitions des lois et théories (Piaget, Vygotski, 51.17)'
        ],
        link: '/exams',
        linkText: 'Ouvrir Annales Didactique',
        qcmLink: '/generator?subdomain=DID_CONCEPTS'
      },
      {
        id: 'sprint_ann_3',
        dayLabel: 'Jour 24 (J-1) • Veille du Concours',
        title: 'Dernière Synthèse & Préparation Mentale',
        tasks: [
          'Relecture légère des fiches mémos et cartes mentales sans surcharge mentale',
          'Préparation matérielle : Carte d\'identité nationale (CIN), convocation imprimée, stylos',
          'Sommeil complet et gestion de la confiance : vous avez couvert 100% du programme !'
        ],
        link: '/courses',
        linkText: 'Consulter les Cartes Mentales',
        qcmLink: '/exams'
      }
    ]
  }
];

// ─── CRMEF Roadmap Tree Data ────────────────────────────────────────────────
const CRMEF_NODES = [
  {
    id: 'algo_base',
    category: 'INFO',
    num: 1,
    icon: Code2,
    title: 'Algorithmique & Bases de Programmation',
    subtitle: 'La base indispensable pour démarrer',
    weight: '40% du programme',
    duration: 'Sprint : 4 jours',
    priority: 'Très Haute',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20', badge: 'bg-[#03594e]' },
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
    duration: 'Sprint : 3 jours',
    priority: 'Très Haute',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20', badge: 'bg-[#03594e]' },
    description: 'Comprendre comment stocker, organiser et traiter efficacement les données, et calculer la complexité des algorithmes avec la notation O.',
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
    duration: 'Sprint : 3 jours',
    priority: 'Haute',
    color: { tag: 'bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F]', border: 'border-[#03594e]', dot: 'bg-[#03594e]', ring: 'ring-[#03594e]/20', badge: 'bg-[#03594e]' },
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
    duration: 'Sprint : 4 jours',
    priority: 'Très Haute',
    color: { tag: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', border: 'border-amber-500', dot: 'bg-amber-500', ring: 'ring-amber-500/20', badge: 'bg-amber-500' },
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
    duration: 'Sprint : 3 jours',
    priority: 'Haute',
    color: { tag: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', border: 'border-amber-500', dot: 'bg-amber-500', ring: 'ring-amber-500/20', badge: 'bg-amber-500' },
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
    subtitle: 'Les mécanismes fondamentaux de l\'élève',
    weight: '30% du programme',
    duration: 'Sprint : 2 jours',
    priority: 'Haute',
    color: { tag: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300', border: 'border-violet-500', dot: 'bg-violet-500', ring: 'ring-violet-500/20', badge: 'bg-violet-500' },
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
    duration: 'Sprint : 2 jours',
    priority: 'Haute',
    color: { tag: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300', border: 'border-violet-500', dot: 'bg-violet-500', ring: 'ring-violet-500/20', badge: 'bg-violet-500' },
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

  // Mode View toggle: 'sprint' (Calendrier 24 jours) vs 'tree' (Arbre pédagogique)
  const [viewMode, setViewMode] = useState('sprint');
  const [selectedNode, setSelectedNode] = useState(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  // LocalStorage progress state
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('crmef_sprint_tasks_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

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

  // Toggle task completion
  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      const updated = { ...prev, [taskId]: !prev[taskId] };
      try {
        localStorage.setItem('crmef_sprint_tasks_v2', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Count total tasks and percentage
  const allSprintTasks = SPRINT_PHASES.flatMap(p => p.days);
  const completedCount = allSprintTasks.filter(d => completedTasks[d.id]).length;
  const progressPercent = Math.round((completedCount / allSprintTasks.length) * 100);

  return (
    <div className="space-y-8 py-3 max-w-6xl mx-auto px-2 sm:px-4 relative z-10">

      {/* ─── Top Banner: Countdown to November 28, 2026 ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#03594e] via-[#02433b] to-[#122824] p-5 sm:p-7 text-white shadow-xl border border-emerald-600/30"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F8C62F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F8C62F] text-xs font-black backdrop-blur-md border border-white/10">
              <Flame className="w-3.5 h-3.5 animate-bounce" />
              <span>SPPRINT FINAL • CONCOURS DE TAALIM FIXÉ AU 28 NOVEMBRE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Objectif Réussite CRMEF : J-{timeLeft.days} Jours
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Le programme ci-dessous a été recalibré en <strong>Sprint Intensif de 24 Jours</strong>. Chaque jour compte : couvrez la Spécialité Info (40%), la Didactique (30%) et les Sciences de l’Éducation (30%).
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 min-w-[62px]">
              <span className="text-2xl sm:text-3xl font-black text-[#F8C62F] leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">Jours</span>
            </div>
            <span className="text-xl font-bold text-white/40">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 min-w-[62px]">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">Heures</span>
            </div>
            <span className="text-xl font-bold text-white/40">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 min-w-[62px]">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">Min</span>
            </div>
            <span className="text-xl font-bold text-white/40">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 min-w-[62px]">
              <span className="text-2xl sm:text-3xl font-black text-[#F8C62F] leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">Sec</span>
            </div>
          </div>
        </div>

        {/* Sprint Progress Gauge */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#F8C62F]" />
            <span className="text-xs font-bold text-white">
              Progression du Sprint : {completedCount} / {allSprintTasks.length} étapes validées ({progressPercent}%)
            </span>
          </div>

          <div className="flex-1 max-w-xs bg-black/20 rounded-full h-2.5 p-0.5 border border-white/10 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#F8C62F] to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={() => setShowOfflineModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-all border border-white/10"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#F8C62F]" />
            <span>Mode Mobile Hors-Ligne</span>
          </button>
        </div>
      </motion.div>

      {/* ─── Mode View Switcher: Sprint 24J vs Arbre Pédagogique ────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('sprint')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'sprint'
                ? 'bg-white dark:bg-slate-900 text-[#03594e] dark:text-[#F8C62F] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>🚀 Planning Sprint 24 Jours (Jour par Jour)</span>
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'tree'
                ? 'bg-white dark:bg-slate-900 text-[#03594e] dark:text-[#F8C62F] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🌳 Arbre Pédagogique par Domaine</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg bg-[#03594e] text-white text-xs font-black">40% Info</span>
          <span className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-black">30% Didactique</span>
          <span className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-black">30% Éducation</span>
        </div>
      </div>

      {/* ─── VIEW 1: SPRINT 24 JOURS CHRONOLOGIQUE ───────────────────────── */}
      {viewMode === 'sprint' && (
        <div className="space-y-8">
          {SPRINT_PHASES.map((phase, pIdx) => {
            const PhaseIcon = phase.icon;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pIdx * 0.08 }}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Phase Header */}
                <div className={`p-5 sm:p-6 bg-gradient-to-r ${phase.color} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                      <PhaseIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-white/80">
                        {phase.period}
                      </span>
                      <h2 className="text-lg sm:text-xl font-black">{phase.title}</h2>
                    </div>
                  </div>
                  <p className="text-xs text-white/90 max-w-md sm:text-right font-medium">
                    {phase.description}
                  </p>
                </div>

                {/* Days within this phase */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-3 sm:p-5">
                  {phase.days.map((item) => {
                    const isChecked = !!completedTasks[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-5 rounded-2xl transition-all my-1.5 ${
                          isChecked
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          {/* Checkbox + Title */}
                          <div className="flex items-start gap-3.5 flex-1">
                            <button
                              onClick={() => toggleTask(item.id)}
                              className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                isChecked
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                              }`}
                            >
                              {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>

                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${phase.badgeBg}`}>
                                  {item.dayLabel}
                                </span>
                                {isChecked && (
                                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Validé !
                                  </span>
                                )}
                              </div>

                              <h3 className={`text-sm sm:text-base font-extrabold ${
                                isChecked
                                  ? 'text-slate-500 dark:text-slate-400 line-through'
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                {item.title}
                              </h3>

                              {/* Task list bullets */}
                              <ul className="space-y-1.5 pt-1">
                                {item.tasks.map((task, tIdx) => (
                                  <li key={tIdx} className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 shrink-0" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Action shortcuts */}
                          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 md:pt-0">
                            <button
                              onClick={() => navigate(item.link)}
                              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#F8C62F]" />
                              <span>{item.linkText}</span>
                            </button>

                            <button
                              onClick={() => navigate(item.qcmLink)}
                              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#F8C62F] hover:bg-[#e0b228] text-[#1B1D21] text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#1B1D21]" />
                              <span>Tester en QCM</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── VIEW 2: ARBRE PÉDAGOGIQUE PAR DOMAINE ───────────────────────── */}
      {viewMode === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Tree */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" /> Les 7 Modules Fondamentaux
              </h2>
              <span className="text-xs font-bold text-slate-400">Cliquez sur un module</span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:top-4 before:bottom-4 before:left-[17px] sm:before:left-[21px] before:w-0.5 before:bg-gradient-to-b before:from-[#03594e] before:via-amber-400 before:to-violet-500 before:opacity-30">
              {CRMEF_NODES.map((node, idx) => {
                const NodeIcon = node.icon;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute -left-[30px] sm:-left-[35px] top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center z-10 transition-all group-hover:scale-110 shadow-md border-2 border-white dark:border-slate-900 ${node.color.dot}`}>
                      <NodeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>

                    {/* Node Card */}
                    <div className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? `border-2 ${node.color.border} ring-2 ${node.color.ring} shadow-lg`
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase mb-1.5 ${node.color.tag}`}>
                            {node.weight}
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
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                        </div>
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden"
                >
                  <div className={`${selectedNode.color.dot} px-6 py-4 text-white flex items-center gap-3`}>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <selectedNode.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/70 uppercase">{selectedNode.weight}</p>
                      <h3 className="text-sm font-extrabold text-white leading-snug">{selectedNode.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> {selectedNode.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
                        <Zap className="w-3.5 h-3.5" /> Priorité {selectedNode.priority}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {selectedNode.description}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Points clés du programme</h4>
                      <ul className="space-y-2">
                        {selectedNode.topics.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${selectedNode.color.dot.replace('bg-', 'text-')}`} />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <button
                        onClick={() => navigate(selectedNode.actionLink)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <BookOpen className="w-4 h-4 text-[#F8C62F]" /> {selectedNode.actionLabel}
                      </button>
                      <button
                        onClick={() => navigate(selectedNode.generatorLink)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#F8C62F] hover:bg-[#e0b228] text-[#1B1D21] font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-[#1B1D21]" /> {selectedNode.generatorLabel}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
                  <Compass className="w-8 h-8 text-[#03594e] dark:text-[#F8C62F] mx-auto animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sélectionnez un module à gauche</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                    Consultez les sous-thèmes précis et lancez les révisions ou QCM IA ciblés.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ─── MODAL : COMMENT OUVRIR SUR LE TÉLÉPHONE HORS-LIGNE ────────── */}
      <AnimatePresence>
        {showOfflineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative space-y-5"
            >
              <button
                onClick={() => setShowOfflineModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/10 dark:text-[#F8C62F] flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Réviser sur Mobile Hors-Ligne
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Fonctionne même sans connexion Internet !
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-6 h-6 rounded-full bg-[#03594e] text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <p>Ouvrez cette application sur le navigateur de votre téléphone (<strong>Chrome</strong> sur Android ou <strong>Safari</strong> sur iPhone).</p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-6 h-6 rounded-full bg-[#03594e] text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <p>Sur <strong>Chrome (Android)</strong> : Cliquez sur les 3 points en haut à droite, puis sur <strong>« Installer l’application »</strong> (ou « Ajouter à l'écran d'accueil »).<br />Sur <strong>Safari (iPhone)</strong> : Cliquez sur l'icône Partager (carré avec flèche) puis sur <strong>« Sur l'écran d'accueil »</strong>.</p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <p><strong>C’est tout !</strong> Une icône apparaît sur votre téléphone. Grâce au Service Worker, tous les cours, leçons et plans se chargent immédiatement même sans réseau ni 4G !</p>
                </div>
              </div>

              <button
                onClick={() => setShowOfflineModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs shadow-md transition-all"
              >
                J'ai compris
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
