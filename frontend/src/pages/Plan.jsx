import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Server, Laptop, GraduationCap, Brain, 
  ArrowRight, BookOpen, Sparkles, FileText, Award,
  CheckCircle2, Compass, ArrowDown, HelpCircle, AlertCircle
} from 'lucide-react';

export default function Plan() {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);

  // Roadmap data based on: 40% Info, 30% Didactique, 30% Sciences de l'éducation
  const roadmapNodes = [
    {
      id: 'info_base',
      category: 'INFO',
      title: '1. Algorithmique & Bases de Programmation',
      subtitle: 'La base indispensable pour démarrer',
      priority: 'Élevée',
      weight: '40% du programme',
      duration: '7 à 10 jours',
      description: 'Maîtriser la syntaxe, les variables, les structures conditionnelles, les boucles, ainsi que les bases de la programmation en Langage C et Développement Web.',
      topics: [
        'Variables, types de données, opérateurs',
        'Conditions (Si/Sinon) et Boucles (Pour, Tant Que)',
        'Tableaux (1D, 2D) et Chaînes de caractères',
        'Fonctions, procédures et passage de paramètres',
        'Syntaxe de base du Langage C et HTML/CSS/JS'
      ],
      actionLink: '/courses',
      actionLabel: 'Réviser les Fiches Associées',
      generatorLink: '/generator?subdomain=DEV_ALGO',
      generatorLabel: 'Générer un Test IA'
    },
    {
      id: 'info_advanced',
      category: 'INFO',
      title: '2. Structures de Données & Complexité',
      subtitle: 'Le cœur technique de la Spécialité',
      priority: 'Élevée',
      weight: '40% du programme',
      duration: '10 à 12 jours',
      description: 'Comprendre comment stocker, organiser et traiter efficacement les données en calculant la complexité des algorithmes.',
      topics: [
        'Complexité algorithmique (Notation Grand O)',
        'Structures linéaires : Piles, Files, Listes chaînées',
        'Algorithmes de Tri (Bulle, Insertion, Fusion, QuickSort)',
        'Algorithmes de Recherche (Dichotomique)',
        'Structures arborescentes (Arbres Binaires de Recherche)'
      ],
      actionLink: '/courses',
      actionLabel: 'Ouvrir les leçons de Structures',
      generatorLink: '/generator?subdomain=DEV_ALGO',
      generatorLabel: 'Générer QCM IA Algo'
    },
    {
      id: 'info_systems',
      category: 'INFO',
      title: '3. Systèmes, Réseaux & Bases de Données',
      subtitle: 'L\'infrastructure informatique',
      priority: 'Élevée',
      weight: '40% du programme',
      duration: '8 à 10 jours',
      description: 'Assimiler le fonctionnement des systèmes d\'exploitation, le modèle de communication réseau et la modélisation des bases de données SQL.',
      topics: [
        'Systèmes d\'exploitation (Processus, Thread, Mémoire virtuelle)',
        'Réseaux (Modèle OSI & TCP/IP, Adressage IP/Masques)',
        'Bases de Données (Modélisation MCD, Modèle Relationnel)',
        'Langage SQL (Requêtes SELECT, Jointures, Agrégats)',
        'Didactique des bases de données'
      ],
      actionLink: '/courses',
      actionLabel: 'Étudier les Fiches Systèmes/SQL',
      generatorLink: '/generator?subdomain=DEV_SI_BD',
      generatorLabel: 'Générer un Test IA SQL'
    },
    {
      id: 'didactique_base',
      category: 'DIDACTIQUE',
      title: '4. Fondements de la Didactique Info',
      subtitle: 'Comment enseigner l\'informatique',
      priority: 'Moyenne',
      weight: '30% du programme',
      duration: '6 à 8 jours',
      description: 'Étudier les concepts didactiques majeurs appliqués à l\'enseignement de l\'informatique et à l\'appropriation des savoirs par les élèves.',
      topics: [
        'Transposition didactique (Savoir savant → Savoir enseigné)',
        'Contrat didactique et Triangle didactique',
        'Approche par Compétences (APC) et Pédagogie de projet',
        'Situations-Problèmes didactiques et résolution d\'obstacles',
        'Ressources didactiques et outils de programmation (Scratch, Python)'
      ],
      actionLink: '/courses',
      actionLabel: 'Réviser les Fiches de Didactique',
      generatorLink: '/generator?subdomain=DIDACTIQUE_CONCEPTS',
      generatorLabel: 'Générer QCM IA Didactique'
    },
    {
      id: 'didactique_lesson',
      category: 'DIDACTIQUE',
      title: '5. Planification & Évaluation Didactique',
      subtitle: 'Préparer et valider les séances',
      priority: 'Moyenne',
      weight: '30% du programme',
      duration: '5 à 7 jours',
      description: 'Apprendre à concevoir une fiche de préparation pédagogique (fiche de leçon) et à structurer des évaluations formatives et sommatives.',
      topics: [
        'Structure d\'une fiche de préparation pédagogique (Jenza)',
        'Gestion des phases de cours (Mise en situation, Apprentissage, Évaluation)',
        'Types d\'évaluation (Diagnostique, Formative, Sommative)',
        'Grilles de correction et critères d\'évaluation',
        'Didactique pratique et gestion de la classe d\'informatique'
      ],
      actionLink: '/annales?domain=DIDACTIQUE',
      actionLabel: 'Tester sur les Annales Didactique',
      generatorLink: '/generator?subdomain=DIDACTIQUE_CONCEPTS',
      generatorLabel: 'S\'entraîner en Didactique'
    },
    {
      id: 'sciences_psycho',
      category: 'SCIENCES_EDU',
      title: '6. Psychologie & Théories de l\'Apprentissage',
      subtitle: 'Les mécanismes fondamentaux de l\'élève',
      priority: 'Moyenne',
      weight: '30% du programme',
      duration: '6 à 8 jours',
      description: 'Assimiler les grands courants théoriques de la psychologie de l\'éducation qui guident les méthodes d\'apprentissage actuelles.',
      topics: [
        'Le Béhaviorisme (Stimulus-Réponse, Conditionnement)',
        'Le Cognitivisme (Traitement de l\'information, mémoire)',
        'Le Constructivisme de Piaget (Assimilation, Accommodation, Stades)',
        'Le Socio-constructivisme de Vygotski (Zone Proximale de Développement)',
        'Théories de la motivation et styles d\'apprentissage'
      ],
      actionLink: '/courses',
      actionLabel: 'Fiches de Sciences de l\'Éducation',
      generatorLink: '/generator?subdomain=SCIENCES_EDU_PSYCHO',
      generatorLabel: 'Générer QCM IA Sciences Édu'
    },
    {
      id: 'sciences_system',
      category: 'SCIENCES_EDU',
      title: '7. Système Éducatif & Réformes au Maroc',
      subtitle: 'Le cadre légal et institutionnel',
      priority: 'Moyenne',
      weight: '30% du programme',
      duration: '5 à 6 jours',
      description: 'Connaître l\'organisation du ministère, les chartes nationales de l\'éducation et les réformes éducatives majeures en cours au Maroc.',
      topics: [
        'Charte Nationale de l\'Éducation et de la Formation (CNEF)',
        'Loi-cadre 51.17 et Vision Décennale (2015-2030)',
        'Feuille de route 2022-2026 pour une école de qualité',
        'Déontologie du métier d\'enseignant et droits/devoirs',
        'Organisation pédagogique et cycles d\'enseignement au Maroc'
      ],
      actionLink: '/annales?domain=SCIENCES_EDU',
      actionLabel: 'Annales de Sciences de l\'Éducation',
      generatorLink: '/generator?subdomain=SCIENCES_EDU_PSYCHO',
      generatorLabel: 'QCM Système Éducatif'
    }
  ];

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'INFO':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-500/10 dark:bg-blue-950/20',
          text: 'text-blue-600 dark:text-blue-400',
          indicator: 'bg-blue-500',
          gradient: 'from-blue-500 to-indigo-600'
        };
      case 'DIDACTIQUE':
        return {
          border: 'border-purple-500',
          bg: 'bg-purple-500/10 dark:bg-purple-950/20',
          text: 'text-purple-600 dark:text-purple-400',
          indicator: 'bg-purple-500',
          gradient: 'from-purple-500 to-indigo-600'
        };
      case 'SCIENCES_EDU':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-500/10 dark:bg-amber-950/20',
          text: 'text-amber-600 dark:text-amber-400',
          indicator: 'bg-amber-500',
          gradient: 'from-amber-500 to-orange-600'
        };
      default:
        return {
          border: 'border-slate-500',
          bg: 'bg-slate-500/10',
          text: 'text-slate-600',
          indicator: 'bg-slate-500',
          gradient: 'from-slate-500 to-slate-600'
        };
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto px-2">
      {/* Introduction Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-slate-900 dark:via-indigo-950/40 dark:to-purple-950/30 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            Votre plan de vol • Concours 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Plan de Répartition & Arbre de Révision
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
            Pour maximiser vos chances de réussite, suivez cet arbre d'apprentissage structuré et équilibré. Commencez par solidifier la spécialité informatique (40% du coefficient), puis enchaînez avec la didactique de l'informatique (30%) et les sciences de l'éducation (30%).
          </p>
        </div>

        <div className="flex gap-4 items-center shrink-0 bg-white/70 dark:bg-slate-900/80 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm backdrop-blur-md w-full md:w-auto">
          <div className="space-y-2 w-full text-center md:text-left">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Répartition Recommandée</div>
            <div className="flex gap-2 justify-center md:justify-start items-center">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-black">40% Info</span>
              <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-black">30% Didactique</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-black">30% Édu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Tree Roadmap */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" /> Les étapes de votre préparation
            </h2>
            <span className="text-xs font-bold text-slate-400">Cliquez sur un module pour voir les détails</span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[17px] sm:before:left-[21px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {roadmapNodes.map((node, idx) => {
              const colors = getCategoryColor(node.category);
              const isSelected = selectedNode?.id === node.id;

              return (
                <motion.div 
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative group"
                >
                  {/* Node Connector Icon Bubble */}
                  <div className={`absolute -left-[30px] sm:-left-[35px] top-1.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center z-10 transition-transform group-hover:scale-110 shadow-sm cursor-pointer`}
                    onClick={() => handleNodeClick(node)}
                  >
                    {node.category === 'INFO' && <Code2 className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 ${colors.text}`} />}
                    {node.category === 'DIDACTIQUE' && <GraduationCap className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 ${colors.text}`} />}
                    {node.category === 'SCIENCES_EDU' && <Brain className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 ${colors.text}`} />}
                  </div>

                  {/* Node Card */}
                  <div 
                    onClick={() => handleNodeClick(node)}
                    className={`glass-card p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 border-transparent shadow-lg bg-white dark:bg-slate-900' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md'
                    }`}
                  >
                    {/* Corner accent block */}
                    <div className={`absolute top-0 right-0 w-24 h-24 opacity-[0.03] rounded-full blur-xl pointer-events-none ${colors.indicator}`} />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${colors.bg} ${colors.text}`}>
                          {node.category === 'INFO' ? 'Spécialité Info (40%)' : node.category === 'DIDACTIQUE' ? 'Didactique (30%)' : 'Sciences Éduc (30%)'}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {node.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {node.subtitle}
                        </p>
                      </div>
                      
                      <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          ⏱️ {node.duration}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Details Panel */}
        <div className="lg:col-span-5 sticky top-20">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 bg-white dark:bg-slate-900"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${getCategoryColor(selectedNode.category).bg} ${getCategoryColor(selectedNode.category).text}`}>
                      {selectedNode.category} • Poids : {selectedNode.weight}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      Priority : <strong className="text-red-500">{selectedNode.priority}</strong>
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {selectedNode.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Durée conseillée : {selectedNode.duration}
                  </p>
                </div>

                {/* Description */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                  {selectedNode.description}
                </div>

                {/* Topics list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Sujets majeurs à maîtriser</h4>
                  <ul className="space-y-2">
                    {selectedNode.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick actions links */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Recommandations & Actions</h4>
                  
                  <div className="flex flex-col gap-2.5">
                    <button 
                      onClick={() => navigate(selectedNode.actionLink)}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 transition-all"
                    >
                      <BookOpen className="w-4 h-4" /> {selectedNode.actionLabel}
                    </button>

                    <button
                      onClick={() => navigate(selectedNode.generatorLink)}
                      className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/10 flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> {selectedNode.generatorLabel}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
                <Compass className="w-12 h-12 text-slate-400 mx-auto opacity-55 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">Sélectionnez une étape de l'arbre</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Cliquez sur n'importe quel bloc à gauche pour afficher les sous-domaines, la durée d'étude estimée et lancer vos révisions ou vos QCM IA associés.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
