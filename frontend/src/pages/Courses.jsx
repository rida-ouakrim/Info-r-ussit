import React, { useState, useEffect, useMemo, useCallback } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import { cLessons } from '../data/cLessons';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, CheckCircle2, Circle, Search, 
  HelpCircle, Code2, RefreshCw, Clock, 
  ChevronRight, Zap, Play, PlayCircle, Filter, 
  FileText, Star, ChevronDown, ChevronUp, User, Globe, Award, Sparkles, Layers, Video,
  Server, Cpu, Laptop, GraduationCap, Brain, Terminal, Database, Network, LayoutTemplate, ArrowLeft, Users, School
} from 'lucide-react';

const getDomainConfig = (code) => {
  switch (code) {
    case 'DEV':
      return {
        icon: Code2,
        gradient: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500/35',
        iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
        description: 'Algorithmique, structures de données, programmation et développement WEB, bases de données.'
      };
    case 'SYS_RES':
      return {
        icon: Server,
        gradient: 'from-cyan-500/10 to-sky-500/10 hover:border-cyan-500/35',
        iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
        description: 'Systèmes d’exploitation, architecture des ordinateurs et réseaux informatiques.'
      };
    case 'LOG':
      return {
        icon: Laptop,
        gradient: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/35',
        iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
        description: 'Technologies de l’information et de la communication, bureautique et multimédia.'
      };
    case 'DIDACTIQUE':
      return {
        icon: GraduationCap,
        gradient: 'from-purple-500/10 to-indigo-500/10 hover:border-purple-500/35',
        iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
        description: 'Concepts, curricula, approches et démarches didactiques appliqués à l’informatique.'
      };
    case 'SCIENCES_EDU':
      return {
        icon: Brain,
        gradient: 'from-amber-500/10 to-rose-500/10 hover:border-amber-500/35',
        iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
        description: 'Psychologie, sociologie de l’éducation et théories de l’apprentissage.'
      };
    default:
      return {
        icon: BookOpen,
        gradient: 'from-slate-500/10 to-slate-600/10 hover:border-slate-500/35',
        iconBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
        badge: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
        description: 'Module général de préparation au concours.'
      };
  }
};

const getSubdomainConfig = (code) => {
  switch (code) {
    case 'DEV_ALGO':
      return { icon: Code2, desc: 'Algorithmes, pseudo-code, complexité, piles, files, arbres, graphes.' };
    case 'DEV_PROG_WEB':
      return { icon: Globe, desc: 'Programmation Web, HTML, CSS, JavaScript, architectures Web.' };
    case 'DEV_SI_BD':
      return { icon: Database, desc: 'Modélisation, SQL, conception de bases de données.' };
    case 'SYS_OS':
      return { icon: Terminal, desc: 'Gestion des processus, mémoire, système de fichiers, linux.' };
    case 'SYS_ARCHI':
      return { icon: Cpu, desc: 'Architecture de Von Neumann, circuits logiques, microprocesseur.' };
    case 'SYS_NET':
      return { icon: Network, desc: 'Modèle OSI/TCP-IP, routage, adressage IP, protocoles réseau.' };
    case 'LOG_OFFICE':
      return { icon: LayoutTemplate, desc: 'Outils bureautiques, multimédia et ressources numériques pour enseigner.' };
    case 'DID_CONCEPTS':
      return { icon: Library, desc: 'Concepts didactiques fondamentaux, transposition, contrat, représentations.' };
    case 'DID_CURRICULUM':
      return { icon: School, desc: 'Programmes officiels, orientations pédagogiques de l’informatique.' };
    case 'DID_APPROCHES':
      return { icon: User, desc: 'Démarches d’enseignement, évaluation, remédiation et activités pratiques.' };
    case 'EDU_PSYCHO':
      return { icon: Brain, desc: 'Développement cognitif, théories de l’apprentissage (béhaviorisme, etc.).' };
    case 'EDU_SOCIO':
      return { icon: Users, desc: 'Sociologie de l’école, dynamique de groupe, relation enseignant-élève.' };
    default:
      return { icon: BookOpen, desc: 'Concepts et ressources du sous-module.' };
  }
};

// Circular Progress Ring Component (Coursera / Vercel style)
const ProgressRing = ({ percentage = 0, size = 64, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-sky-500 transition-all duration-500 ease-out"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-black text-slate-900 dark:text-white">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

const Courses = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomainCode, setSelectedDomainCode] = useState('');
  const [subdomains, setSubdomains] = useState([]);
  const [selectedSubdomainCode, setSelectedSubdomainCode] = useState('');
  
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [currentStep, setCurrentStep] = useState('domains'); // 'domains', 'subdomains', 'courses'
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCLessonIdx, setSelectedCLessonIdx] = useState(0);
  const [openModuleIds, setOpenModuleIds] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'in_progress', 'favorites'
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'video', 'examples', 'astuces', 'qcm'

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subQuestions, setSubQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [openQcmIds, setOpenQcmIds] = useState({});

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const vMatch = url.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = vMatch ? vMatch[1] : null;
    const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    const listId = listMatch ? listMatch[1] : null;

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}${listId ? `?list=${listId}` : ''}`;
    }
    if (url.includes('youtube.com/embed/')) return url;
    return url;
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDomains(), fetchAllCourses(), fetchStats()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await API.get('domains/');
      const domList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setDomains(domList);
    } catch (err) {
      console.error("fetchDomains error:", err);
      setDomains([]);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await API.get('courses/');
      const courseList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setAllCourses(courseList);
    } catch (err) {
      console.error("fetchAllCourses error:", err);
      setAllCourses([]);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get('courses/stats/');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDomainChange = (code) => {
    setSelectedDomainCode(code);
    const domList = Array.isArray(domains) ? domains : [];
    const dom = domList.find(d => d.code === code);
    if (dom) {
      const subList = Array.isArray(dom.subdomains) ? dom.subdomains : [];
      setSubdomains(subList);
      setCurrentStep('subdomains');
    }
  };

  const handleSubdomainChange = async (code) => {
    setSelectedSubdomainCode(code);
    setCurrentStep('courses');
    setLoading(true);
    await fetchCourses(code);
    setLoading(false);
  };

  const fetchCourses = async (subCode) => {
    try {
      const res = await API.get(`courses/?subdomain=${subCode}`);
      const courseList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setCourses(courseList);
      if (courseList.length > 0) {
        await fetchCourseDetail(courseList[0].id);
      }
      await fetchSubQuestions(subCode);
    } catch (err) {
      console.error("fetchCourses error:", err);
      setCourses([]);
    }
  };

  const isCLanguage = useMemo(() => {
    return selectedCourse?.title?.toLowerCase().includes('langage c') || false;
  }, [selectedCourse]);

  const currentCLesson = useMemo(() => {
    return cLessons[selectedCLessonIdx] || cLessons[0];
  }, [selectedCLessonIdx]);

  const activeCourseData = useMemo(() => {
    if (!selectedCourse) return null;
    if (isCLanguage && currentCLesson) {
      return {
        ...selectedCourse,
        title: `Leçon ${currentCLesson.num < 10 ? '0' + currentCLesson.num : currentCLesson.num} : ${currentCLesson.title}`,
        content: currentCLesson.content,
        examples: currentCLesson.examples,
        astuces: currentCLesson.astuces,
        video_url: currentCLesson.video_url
      };
    }
    return selectedCourse;
  }, [selectedCourse, isCLanguage, currentCLesson]);

  const fetchCourseDetail = async (id) => {
    try {
      const res = await API.get(`courses/${id}/`);
      setSelectedCourse(res.data);
      if (!res.data?.video_url && activeTab === 'video' && !isCLanguage) {
        setActiveTab('content');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubQuestions = async (subCode) => {
    try {
      const res = await API.get(`questions/?subdomain=${subCode}&source_type=past_exam`);
      const qList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setSubQuestions(qList);
      setOpenQcmIds({});
    } catch (err) {
      console.error("fetchSubQuestions error:", err);
      setSubQuestions([]);
    }
  };

  const filterQuestionsForCourse = (questions, course) => {
    if (!Array.isArray(questions) || !course) return [];
    const title = (course.title || '').toLowerCase();

    if (title.includes('01.') || title.includes('introduction')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return (text.includes('algorithme') || text.includes('pseudo-code') || text.includes('organigramme') || text.includes('définition')) &&
          !text.includes('tableau') && !text.includes('matrice') && !text.includes('boucle pour') && !text.includes('tantque') && !text.includes('arbre') && !text.includes('graphe');
      });
    }

    if (title.includes('02.') || title.includes('variable')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return (text.includes('variable') || text.includes('constante') || text.includes('entier') || text.includes('réel') || text.includes('booléen')) &&
          !text.includes('tableau') && !text.includes('boucle') && !text.includes('arbre') && !text.includes('graphe');
      });
    }

    if (title.includes('03.') || title.includes('opérateur')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return (text.includes('opérateur') || text.includes('div') || text.includes('mod') || text.includes('lire') || text.includes('écrire')) &&
          !text.includes('tableau') && !text.includes('arbre') && !text.includes('graphe');
      });
    }

    if (title.includes('04.') || title.includes('condition')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return (text.includes('si ') || text.includes('sinon') || text.includes('selon') || text.includes('condition')) &&
          !text.includes('boucle pour') && !text.includes('tantque') && !text.includes('tableau') && !text.includes('arbre');
      });
    }

    if (title.includes('05.') || title.includes('boucle')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return (text.includes('boucle') || text.includes('pour') || text.includes('tantque') || text.includes('répéter') || text.includes('itérat')) &&
          !text.includes('tableau') && !text.includes('matrice') && !text.includes('arbre') && !text.includes('graphe');
      });
    }

    if (title.includes('06.') || title.includes('tableau')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('tableau') || text.includes('vecteur') || text.includes('matrice') || text.includes(' 1d') || text.includes(' 2d');
      });
    }

    if (title.includes('07.') || title.includes('chaîne') || title.includes('chaine')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('chaîne') || text.includes('chaine') || text.includes('caractère') || text.includes('caractere') || text.includes('string');
      });
    }

    if (title.includes('08.') || title.includes('procédure') || title.includes('fonction')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return (text.includes('fonction') || text.includes('procédure') || text.includes('procedure') || text.includes('paramètre') || text.includes('passage par')) &&
          !text.includes('récurs') && !text.includes('arbre') && !text.includes('graphe');
      });
    }

    if (title.includes('09.') || title.includes('complexité')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('complexité') || text.includes('o(1)') || text.includes('o(n)') || text.includes('o(n^2)') || text.includes('grand o');
      });
    }

    if (title.includes('10.') || title.includes('pile') || title.includes('file')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('pile') || text.includes('file') || text.includes('lifo') || text.includes('fifo') || text.includes('empiler') || text.includes('dépiler') || text.includes('liste chaînée');
      });
    }

    if (title.includes('11.') || title.includes('tri') || title.includes('recherche')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('tri') || text.includes('bulle') || text.includes('sélection') || text.includes('insertion') || text.includes('quicksort') || text.includes('mergesort') || text.includes('dichotom');
      });
    }

    if (title.includes('12.') || title.includes('récursiv')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('récursiv') || text.includes('recursiv') || text.includes('cas de base');
      });
    }

    if (title.includes('13.') || title.includes('arbre')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('arbre') || text.includes('abr') || text.includes('infixe') || text.includes('préfixe') || text.includes('postfixe');
      });
    }

    if (title.includes('14.') || title.includes('graphe')) {
      return questions.filter(q => {
        const text = ((q.question_text || '') + ' ' + (q.explanation || '')).toLowerCase();
        return text.includes('graphe') || text.includes('dfs') || text.includes('bfs') || text.includes('adjacence') || text.includes('dijkstra');
      });
    }

    return questions.slice(0, 5);
  };

  const targetedQuestions = useMemo(() => {
    return filterQuestionsForCourse(subQuestions, selectedCourse);
  }, [subQuestions, selectedCourse]);

  const toggleCourseCompleted = async (id, currentVal) => {
    try {
      const res = await API.post(`courses/${id}/toggle-completed/`, { is_completed: !currentVal });
      setSelectedCourse(prev => prev ? { ...prev, is_completed: res.data.is_completed } : null);
      setCourses(prev => (Array.isArray(prev) ? prev : []).map(c => c.id === id ? { ...c, is_completed: res.data.is_completed } : c));
      setAllCourses(prev => (Array.isArray(prev) ? prev : []).map(c => c.id === id ? { ...c, is_completed: res.data.is_completed } : c));
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionSelect = async (questionId, option) => {
    try {
      const res = await API.post(`questions/${questionId}/attempt/`, { chosen_option: option });
      setUserAnswers(prev => ({ ...prev, [questionId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBookmark = async (questionId) => {
    try {
      const res = await API.post(`bookmarks/${questionId}/toggle/`);
      setSubQuestions(prev => (Array.isArray(prev) ? prev : []).map(q => q.id === questionId ? { ...q, is_bookmarked: res.data.is_bookmarked } : q));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleQcmOpen = (qId) => {
    setOpenQcmIds(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const expandAllQcm = () => {
    const allOpen = {};
    (Array.isArray(subQuestions) ? subQuestions : []).forEach(q => { allOpen[q.id] = true; });
    setOpenQcmIds(allOpen);
  };

  const collapseAllQcm = () => {
    setOpenQcmIds({});
  };

  const toggleModuleOpen = (modId) => {
    setOpenModuleIds(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Keyboard Shortcuts (ArrowLeft & ArrowRight for Lesson Navigation)
  const handleNextLesson = useCallback(() => {
    if (isCLanguage) {
      setSelectedCLessonIdx(prev => Math.min(cLessons.length - 1, prev + 1));
    } else {
      const idx = courses.findIndex(c => c.id === selectedCourse?.id);
      if (idx !== -1 && idx < courses.length - 1) {
        fetchCourseDetail(courses[idx + 1].id);
      }
    }
  }, [isCLanguage, courses, selectedCourse]);

  const handlePrevLesson = useCallback(() => {
    if (isCLanguage) {
      setSelectedCLessonIdx(prev => Math.max(0, prev - 1));
    } else {
      const idx = courses.findIndex(c => c.id === selectedCourse?.id);
      if (idx > 0) {
        fetchCourseDetail(courses[idx - 1].id);
      }
    }
  }, [isCLanguage, courses, selectedCourse]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore key events when user is typing in inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') {
        handleNextLesson();
      } else if (e.key === 'ArrowLeft') {
        handlePrevLesson();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextLesson, handlePrevLesson]);

  // Group Courses into Coursera-style Modules
  const groupedModules = useMemo(() => {
    if (isCLanguage) {
      // Group 50 C lessons into 6 chapters
      const chapters = [
        { id: 'c_mod_1', title: 'Module 1 : Syntaxe de Base, Variables & Opérateurs', start: 0, end: 8 },
        { id: 'c_mod_2', title: 'Module 2 : Structures de Contrôle (if, switch, boucles)', start: 8, end: 17 },
        { id: 'c_mod_3', title: 'Module 3 : Fonctions, Prototypes & Modularité', start: 17, end: 23 },
        { id: 'c_mod_4', title: 'Module 4 : Pointeurs & Allocation Dynamique (malloc)', start: 23, end: 33 },
        { id: 'c_mod_5', title: 'Module 5 : Structures de Données & Listes Chaînées', start: 33, end: 42 },
        { id: 'c_mod_6', title: 'Module 6 : Fichiers, En-têtes (.h) & Compilation', start: 42, end: 50 }
      ];

      return chapters.map(chap => {
        const lessons = cLessons.slice(chap.start, chap.end);
        const completedCount = lessons.filter(l => l.num <= selectedCLessonIdx).length;
        const total = lessons.length;
        const pct = Math.round((completedCount / total) * 100);

        return {
          id: chap.id,
          title: chap.title,
          lessonsCount: total,
          completedCount,
          percentage: pct,
          lessons: lessons.map(les => {
            const lesGlobalIdx = les.num - 1;
            const isActive = lesGlobalIdx === selectedCLessonIdx;
            const isDone = lesGlobalIdx < selectedCLessonIdx;

            return {
              globalIdx: lesGlobalIdx,
              num: les.num,
              title: les.title,
              duration: '10 min',
              type: 'Vidéo',
              isActive,
              isDone
            };
          })
        };
      });
    }

    // Default grouping for other courses
    const allCoursesList = Array.isArray(courses) ? courses : [];
    return [
      {
        id: 'default_mod_1',
        title: selectedSubdomainCode ? `Module Général • ${selectedSubdomainCode}` : 'Module de Cours',
        lessonsCount: allCoursesList.length,
        completedCount: allCoursesList.filter(c => c.is_completed).length,
        percentage: allCoursesList.length > 0 ? Math.round((allCoursesList.filter(c => c.is_completed).length / allCoursesList.length) * 100) : 0,
        lessons: allCoursesList.map((c, idx) => ({
          courseId: c.id,
          num: idx + 1,
          title: c.title,
          duration: '15 min',
          type: c.video_url ? 'Vidéo' : 'Fiche',
          isActive: selectedCourse?.id === c.id,
          isDone: c.is_completed
        }))
      }
    ];
  }, [isCLanguage, selectedCLessonIdx, courses, selectedCourse, selectedSubdomainCode]);

  const currentDomainObj = useMemo(() => {
    return (Array.isArray(domains) ? domains : []).find(d => d.code === selectedDomainCode) || null;
  }, [domains, selectedDomainCode]);

  const currentSubdomainObj = useMemo(() => {
    return (Array.isArray(subdomains) ? subdomains : []).find(s => s.code === selectedSubdomainCode) || null;
  }, [subdomains, selectedSubdomainCode]);

  const renderDomainsView = () => {
    return (
      <motion.div
        key="domains"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="space-y-8"
      >
        <div className="dark-hero glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6" style={{background: 'linear-gradient(to right, #0f172a, #020617, #1e1b4b)', color: '#ffffff'}}>
          <div className="space-y-3 max-w-2xl z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-black tracking-wide">
                PRÉPARATION AUX CONCOURS 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Fiches de Cours Académiques
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Choisissez un grand module informatique ci-dessous pour démarrer vos révisions.
            </p>
          </div>

          <div className="z-10 flex items-center gap-6 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shrink-0">
            <ProgressRing percentage={stats?.percentage || 0} size={72} strokeWidth={7} />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progression Globale</div>
              <div className="text-lg font-black text-white">
                {stats?.completed || 0} / {stats?.total || 0} <span className="text-xs font-medium text-slate-400">validés</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(domains) ? domains : []).map((dom) => {
            const config = getDomainConfig(dom.code);
            const Icon = config.icon;
            
            const domainCourses = allCourses.filter(c => c.domain_code === dom.code);
            const total = domainCourses.length;
            const completed = domainCourses.filter(c => c.is_completed).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const subCount = dom.subdomains?.length || 0;

            return (
              <button
                key={dom.code}
                type="button"
                onClick={() => handleDomainChange(dom.code)}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] text-left cursor-pointer overflow-hidden min-h-[220px]"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="space-y-4 relative z-10 w-full">
                  <div className={`p-3 rounded-2xl w-fit ${config.iconBg} border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {dom.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {dom.description || config.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 w-full space-y-3 relative z-10">
                  {total > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span>Progression</span>
                        <span>{completed}/{total} cours</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-sky-500 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {subCount} {subCount > 1 ? 'sous-modules' : 'sous-module'}
                    </span>
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explorer <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderSubdomainsView = () => {
    const domainObj = (Array.isArray(domains) ? domains : []).find(d => d.code === selectedDomainCode);
    const domainConfig = getDomainConfig(selectedDomainCode);
    
    const domainCourses = allCourses.filter(c => c.domain_code === selectedDomainCode);
    const totalCourses = domainCourses.length;
    const completedCourses = domainCourses.filter(c => c.is_completed).length;
    const domainPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    return (
      <motion.div
        key="subdomains"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span 
              onClick={() => setCurrentStep('domains')} 
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              Accueil
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-45" />
            <span className="text-sky-600 dark:text-sky-400 font-bold">{domainObj?.name}</span>
          </nav>
          
          <button
            type="button"
            onClick={() => setCurrentStep('domains')}
            className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour aux grands modules
          </button>
        </div>

        <div className={`glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${domainConfig.gradient} border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold border ${domainConfig.badge}`}>
                GRAND MODULE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {domainObj?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              {domainObj?.description || domainConfig.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/65 dark:bg-slate-950/80 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shrink-0">
            <ProgressRing percentage={domainPercentage} size={64} strokeWidth={6} />
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avancement du module</div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                {completedCourses} / {totalCourses} <span className="text-xs font-medium text-slate-400">validés</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {(Array.isArray(subdomains) ? subdomains : []).map((sub) => {
            const config = getSubdomainConfig(sub.code);
            const Icon = config.icon;
            
            const subCourses = allCourses.filter(c => c.subdomain === sub.code);
            const total = subCourses.length;
            const completed = subCourses.filter(c => c.is_completed).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <button
                key={sub.code}
                type="button"
                onClick={() => handleSubdomainChange(sub.code)}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] text-left cursor-pointer overflow-hidden min-h-[200px]"
              >
                <div className="space-y-4 w-full">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400">
                      {total} cours
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {sub.description || config.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 w-full space-y-4">
                  {total > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span>Complété à {percentage}%</span>
                        <span>{completed} / {total} cours</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${percentage === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-end w-full">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ouvrir la formation <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderCoursesView = () => {
    return (
      <motion.div
        key="courses"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-1">
            <span onClick={() => setCurrentStep('domains')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Accueil</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
            <span onClick={() => setCurrentStep('subdomains')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">{currentDomainObj?.name || 'Développement'}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
            <span className="text-sky-600 dark:text-sky-400 font-bold">{currentSubdomainObj?.name || 'Sous-domaine'}</span>
            {activeCourseData && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                <span className="text-slate-900 dark:text-slate-200 truncate max-w-[200px]">{activeCourseData.title}</span>
              </>
            )}
          </nav>
          
          <button type="button" onClick={() => setCurrentStep('subdomains')} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour aux sous-modules
          </button>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-5 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><Layers className="w-4 h-4 text-sky-500" /> Sommaire du Parcours</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{isCLanguage ? '50 Leçons' : `${courses.length} Modules`}</span>
                </div>
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher une leçon ou notion..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none" />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {[{ id: 'all', label: 'Toutes' }, { id: 'in_progress', label: 'En cours' }, { id: 'completed', label: 'Terminées' }].map(f => (
                    <button key={f.id} type="button" onClick={() => setStatusFilter(f.id)} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ${statusFilter === f.id ? 'bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>{f.label}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-2 max-h-[650px] overflow-y-auto pr-1">
                {groupedModules.map((mod) => {
                  const hasActiveLesson = mod.lessons.some(l => l.isActive);
                  const isOpen = openModuleIds[mod.id] !== undefined ? openModuleIds[mod.id] : hasActiveLesson;
                  return (
                    <div key={mod.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-950/40 shadow-xs transition-all">
                      <button type="button" onClick={() => toggleModuleOpen(mod.id)} className="w-full p-4 flex items-center justify-between gap-3 text-left bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white whitespace-normal break-words leading-relaxed">{mod.title}</h4>
                            <span className="text-[10px] font-extrabold text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">{mod.completedCount}/{mod.lessonsCount}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden"><div className="bg-sky-500 h-full transition-all duration-300 rounded-full" style={{ width: `${mod.percentage}%` }}></div></div>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-2 space-y-1 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
                          {mod.lessons.map((les) => (
                            <button key={les.num} type="button" onClick={() => { isCLanguage ? setSelectedCLessonIdx(les.globalIdx) : fetchCourseDetail(les.courseId); }} className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-left transition-all ${les.isActive ? 'bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-300 font-bold shadow-2xs' : 'hover:bg-slate-100 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-300'}`}>
                              <div className="flex items-center gap-2.5 min-w-0">{les.isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : les.isActive ? <PlayCircle className="w-4 h-4 text-sky-500 animate-pulse shrink-0" /> : <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />}<span className="whitespace-normal break-words"><strong className="text-slate-400 mr-1.5">#{les.num}</strong>{les.title}</span></div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2"><span className="text-[10px] text-slate-400 font-semibold">{les.duration}</span><span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500">{les.type}</span></div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {activeCourseData ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {isCLanguage ? `Leçon ${currentCLesson.num} / 50` : activeCourseData.subdomain_name}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {activeCourseData.title}
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleCourseCompleted(activeCourseData.id, activeCourseData.is_completed)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
                        activeCourseData.is_completed
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-sky-600 text-white hover:bg-sky-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {activeCourseData.is_completed ? 'Terminé' : 'Valider la leçon'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handlePrevLesson}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-all font-bold text-xs"
                      title="Précédente"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={handleNextLesson}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-all font-bold text-xs"
                      title="Suivante"
                    >
                      →
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                  {[{ id: 'content', label: 'Fiche de Révision', icon: BookOpen, color: 'text-sky-500' }, { id: 'video', label: 'Leçon Vidéo', icon: Video, color: 'text-red-500', badge: activeCourseData.video_url }, { id: 'examples', label: 'Pratique & Exemples', icon: Code2, color: 'text-indigo-500' }, { id: 'astuces', label: 'Astuces & Pièges', icon: Zap, color: 'text-amber-500' }, { id: 'qcm', label: `Quiz Ciblés (${targetedQuestions.length})`, icon: HelpCircle, color: 'text-purple-500' }].map((tab) => {
                    const isActive = activeTab === tab.id; const Icon = tab.icon;
                    return (
                      <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${isActive ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-slate-800 scale-[1.01]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                        <Icon className={`w-4 h-4 ${tab.color}`} /><span>{tab.label}</span>{tab.badge && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                      </button>
                    );
                  })}
                </div>
                {activeTab === 'video' ? (
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3"><div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"><Play className="w-6 h-6 fill-current" /></div><div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Leçon Vidéo HD • {activeCourseData.title}</h3><p className="text-xs text-slate-500 dark:text-slate-400">Explication pas à pas et support de révision (Style Coursera)</p></div></div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Mohamed Chiny & Académie Info</span>
                    </div>
                    {activeCourseData.video_url ? (
                      activeCourseData.video_url.includes('drive.google.com') ? (
                        <div className="space-y-4">
                          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800"><iframe src={activeCourseData.video_url.replace(/\/view(\?.*)?$/, '/preview')} title={activeCourseData.title} className="w-full h-full border-0" allow="autoplay" allowFullScreen></iframe></div>
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">☁️ <strong>Vidéo HD Google Drive :</strong> Lecteur sécurisé sans aucune publicité parasite.</span>
                            <a href={activeCourseData.video_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 font-bold hover:underline shrink-0">Ouvrir dans Google Drive ↗</a>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800"><iframe src={getEmbedUrl(activeCourseData.video_url)} title={activeCourseData.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
                      )
                    ) : (
                      <div className="p-12 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800"><Video className="w-12 h-12 text-slate-400 mx-auto opacity-50" /><h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Aucune vidéo associée à ce module</h4><p className="text-xs text-slate-500 max-w-md mx-auto">Consultez la fiche de révision théorique et les exemples de code ci-dessous.</p></div>
                    )}
                  </div>
                ) : activeTab !== 'qcm' ? (
                  <div className="glass-card p-8 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-2xl min-h-[400px]">
                    {activeTab === 'content' && <MarkdownViewer content={activeCourseData.content} />}
                    {activeTab === 'examples' && <MarkdownViewer content={activeCourseData.examples} />}
                    {activeTab === 'astuces' && <MarkdownViewer content={activeCourseData.astuces} />}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div><h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" /> QCM Ciblés du Module ({targetedQuestions.length})</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cliquez sur une question pour l'ouvrir.</p></div>
                      <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={expandAllQcm} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all">Tout ouvrir</button><button type="button" onClick={collapseAllQcm} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all">Tout fermer</button></div>
                    </div>
                    {targetedQuestions.length === 0 ? <div className="glass-card p-12 rounded-3xl text-center text-slate-500 dark:text-slate-400 text-sm">Aucun QCM ciblé disponible.</div> : (
                      <div className="space-y-3">
                        {targetedQuestions.map((q, idx) => {
                          const answer = userAnswers[q.id]; const isOpen = Boolean(openQcmIds[q.id]);
                          return (
                            <div key={q.id} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs transition-all">
                              <div onClick={() => toggleQcmOpen(q.id)} className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors">
                                <div className="flex items-center gap-3 min-w-0 flex-1"><span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">Q{idx + 1} • {q.exam_year}</span><span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{q.question_number} — <span className="font-normal text-slate-500 dark:text-slate-400">{q.question_text.slice(0, 65)}...</span></span></div>
                                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => toggleBookmark(q.id)} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${q.is_bookmarked ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}><Star className={`w-3.5 h-3.5 ${q.is_bookmarked ? 'fill-current' : ''}`} /></button>{isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}</div>
                              </div>
                              {isOpen && (
                                <div className="p-6 pt-3 space-y-4 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/20">
                                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm border border-slate-200 dark:border-slate-800/80 leading-relaxed"><MarkdownViewer content={q.question_text} /></div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{['A', 'B', 'C', 'D', 'E'].map(optKey => {
                                    const rawText = q[`option_${optKey.toLowerCase()}`]; const isChosen = answer?.chosen_option === optKey; const isCorrect = answer?.is_correct && isChosen;
                                    return <button key={optKey} type="button" onClick={() => handleOptionSelect(q.id, optKey)} className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${isChosen ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-300 font-bold') : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}><strong className="text-sky-600 dark:text-sky-400 mr-2">{optKey})</strong> {rawText || (optKey === 'E' ? 'Aucune des réponses ci-dessus' : '')}</button>
                                  })}</div>
                                  {answer && <div className={`p-4 rounded-xl text-xs space-y-2 ${answer.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'}`}><div className="font-bold">{answer.is_correct ? '✔️ Correct !' : `❌ Incorrect. Bonne réponse : ${answer.correct_option}`}</div><div className="leading-relaxed">{answer.explanation}</div>{q.astuce && <div className="mt-2 text-sky-600 dark:text-sky-300 font-medium">⚡ <strong>Astuce Concours :</strong> {q.astuce}</div>}</div>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-slate-200 dark:border-slate-800/80 shadow-lg">
                  <button type="button" onClick={handlePrevLesson} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2">← Précédente <kbd className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500">←</kbd></button>
                  <div className="hidden sm:block text-xs font-bold text-slate-500 dark:text-slate-400">{isCLanguage ? `Leçon ${currentCLesson.num} / 50` : `Module ${courses.findIndex(c => c.id === selectedCourse?.id) + 1} / ${courses.length}`}</div>
                  <button type="button" onClick={handleNextLesson} className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2">Suivante → <kbd className="text-[10px] px-1.5 py-0.5 bg-sky-800 rounded text-sky-200">→</kbd></button>
                </div>
              </div>
            ) : <div className="glass-card p-12 rounded-3xl text-center text-slate-500 dark:text-slate-400 text-sm">Sélectionnez un module de cours dans le sommaire à gauche.</div>}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-sky-500 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement de la plateforme d'apprentissage...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-slate-900 dark:text-slate-100 font-sans">
      <AnimatePresence mode="wait">
        {currentStep === 'domains' && renderDomainsView()}
        {currentStep === 'subdomains' && renderSubdomainsView()}
        {currentStep === 'courses' && renderCoursesView()}
      </AnimatePresence>
    </div>
  );
};

export default Courses;
