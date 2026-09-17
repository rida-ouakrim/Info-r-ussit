import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import MarkdownViewer from '../components/MarkdownViewer';
import ReferenceTextModal, { hasReferenceText } from '../components/ReferenceTextModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { cLessons } from '../data/cLessons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CheckCircle2, Circle, Search,
  HelpCircle, Code2, RefreshCw, Clock,
  ChevronRight, Zap, Play, PlayCircle, Filter,
  FileText, Star, ChevronDown, ChevronUp, User, Globe, Award, Sparkles, Layers, Video,
  Server, Cpu, Laptop, GraduationCap, Brain, Terminal, Database, Network, LayoutTemplate, ArrowLeft, Users, School, Library,
  Save, Trash2, Copy, Download, Check, ChevronLeft, Highlighter, X, Eraser, BarChart3, ShieldCheck, Building2, Columns, Minus, MessageSquare, Send, Bot
} from 'lucide-react';

const getDomainConfig = (code) => {
  switch (code) {
    case 'CONCOURS_ETAT':
      return {
        icon: Sparkles,
        gradient: 'from-amber-500/10 via-purple-500/10 to-indigo-500/10',
        iconBg: 'bg-[#F8C62F]/15 text-[#946e00]',
        badge: 'bg-[#F8C62F]/20 text-[#1B1D21] border-[#F8C62F]/40',
        topBorder: 'border-t-4 border-t-[#F8C62F]',
        description: 'Préparation aux concours de la fonction publique (Ministères, ORMVA, ANCFCC, DGI, CDG) - Filières IT, Data & IA.'
      };
    case 'DEV':
      return {
        icon: Code2,
        gradient: 'from-emerald-500/10 to-teal-500/10',
        iconBg: 'bg-[#03594e]/10 text-[#03594e]',
        badge: 'bg-[#03594e]/10 text-[#03594e] border-[#03594e]/20',
        topBorder: 'border-t-4 border-t-[#03594e]',
        description: 'Algorithmique, structures de données, programmation et développement WEB, bases de données.'
      };
    case 'SYS_RES':
      return {
        icon: Server,
        gradient: 'from-emerald-500/10 to-teal-500/10',
        iconBg: 'bg-[#03594e]/10 text-[#03594e]',
        badge: 'bg-[#03594e]/10 text-[#03594e] border-[#03594e]/20',
        topBorder: 'border-t-4 border-t-[#03594e]',
        description: 'Systèmes d’exploitation, architecture des ordinateurs et réseaux informatiques.'
      };
    case 'LOG':
      return {
        icon: Laptop,
        gradient: 'from-emerald-500/10 to-teal-500/10',
        iconBg: 'bg-[#03594e]/10 text-[#03594e]',
        badge: 'bg-[#03594e]/10 text-[#03594e] border-[#03594e]/20',
        topBorder: 'border-t-4 border-t-[#03594e]',
        description: 'Technologies de l’information et de la communication, bureautique et multimédia.'
      };
    case 'DIDACTIQUE':
      return {
        icon: GraduationCap,
        gradient: 'from-purple-500/10 to-indigo-500/10',
        iconBg: 'bg-[#03594e]/10 text-[#03594e]',
        badge: 'bg-[#03594e]/10 text-[#03594e] border-[#03594e]/20',
        topBorder: 'border-t-4 border-t-[#03594e]',
        description: 'Concepts, curricula, approches et démarches didactiques appliqués à l’informatique.'
      };
    case 'SCIENCES_EDU':
      return {
        icon: Brain,
        gradient: 'from-amber-500/10 to-rose-500/10',
        iconBg: 'bg-[#F8C62F]/15 text-[#946e00]',
        badge: 'bg-[#F8C62F]/20 text-[#1B1D21] border-[#F8C62F]/40',
        topBorder: 'border-t-4 border-t-[#F8C62F]',
        description: 'Psychologie, sociologie de l’éducation et théories de l’apprentissage.'
      };
    default:
      return {
        icon: BookOpen,
        gradient: 'from-slate-500/10 to-slate-600/10',
        iconBg: 'bg-[#03594e]/10 text-[#03594e]',
        badge: 'bg-[#03594e]/10 text-[#03594e] border-[#03594e]/20',
        topBorder: 'border-t-4 border-t-[#03594e]',
        description: 'Module général de préparation au concours.'
      };
  }
};

const getSubdomainConfig = (code) => {
  switch (code) {
    case 'DATA_SCIENCE_IA':
      return { icon: Brain, desc: 'Machine Learning, Deep Learning (PyTorch), NLP, Computer Vision, MLOps.' };
    case 'DATA_ENG':
      return { icon: Cpu, desc: 'Architectures Big Data, Apache Spark, Hadoop, Pipelines ETL, Kafka, Airflow.' };
    case 'DATA_ANALYTICS':
      return { icon: BarChart3, desc: 'SQL Avancé, PowerBI, Tableau, Modélisation décisionnelle (Étoile/Flocon).' };
    case 'DBA_ADMIN':
      return { icon: Database, desc: 'PostgreSQL, Oracle DB, Tuning de requêtes, Intégrité ACID, Sauvegardes & HA.' };
    case 'INFO_GEN_GL':
      return { icon: Code2, desc: 'Algorithmique & Complexité (Big-O), Design Patterns, Architecture Logicielle, POO.' };
    case 'SYS_CLOUD_DEV':
      return { icon: Server, desc: 'Administration Linux, Docker, Kubernetes, CI/CD, Cloud AWS/Azure, Virtualisation.' };
    case 'CYBERSEC':
      return { icon: ShieldCheck, desc: 'Cryptographie (RSA, AES), OWASP Top 10, Pentesting, ISO 27001, Sécurité SI.' };
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
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800 fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-[#03594e] dark:text-[#F8C62F] fill-none transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-black text-slate-800 dark:text-white">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

// HighlightedMarkdown : Declarative React Highlighted Markdown component
const HighlightedMarkdown = React.memo(({ content, highlights, forceLtr = false, forceRtl = false }) => {
  return <MarkdownViewer content={content} highlights={highlights} forceLtr={forceLtr} forceRtl={forceRtl} />;
});

const domainTranslations = {
  SCIENCES_EDU: {
    name_fr: "Sciences de l'éducation",
    name_ar: "علوم التربية",
    desc_fr: "Psychologie de l'éducation (développement de l'enfant/adolescent, théories d'apprentissage), Sociologie de l'éducation.",
    desc_ar: "علم النفس التربوي (النمو المعرفي، نظريات التعلم)، وعلم الاجتماع التربوي والمنهاج الدراسي."
  },
  DIDACTIQUE: {
    name_fr: "Didactique de l'informatique",
    name_ar: "ديداكتيك المعلوماتية",
    desc_fr: "Concepts, curricula, approches et démarches didactiques appliqués à l'informatique.",
    desc_ar: "المفاهيم الأساسية، النقل الديداكتيكي، المنهاج الدراسي والنهوج البيداغوجية للتدريس."
  },
  DEV: {
    name_fr: "Développement",
    name_ar: "البرمجة والتطوير",
    desc_fr: "Algorithmique, structures de données, programmation et développement WEB, bases de données.",
    desc_ar: "الخوارزميات، البرمجة والتطوير، تطوير الويب، وقواعد البيانات."
  },
  SYS_RES: {
    name_fr: "Systèmes et Réseaux",
    name_ar: "الأنظمة والشبكات",
    desc_fr: "Systèmes d'exploitation, architecture des ordinateurs et réseaux informatiques.",
    desc_ar: "أنظمة التشغيل، بنية الحاسوب، والشبكات المعلوماتية."
  },
  LOG: {
    name_fr: "Logiciels & TICE",
    name_ar: "المكتبيات وتكنولوجيا التعليم",
    desc_fr: "Technologies de l'information et de la communication, bureautique et multimédia.",
    desc_ar: "تكنولوجيا المعلومات والاتصال، المكتبيات والوسائط المتعددة."
  },
  CONCOURS_ETAT: {
    name_fr: "Concours de l'État (IT, Data & IA)",
    name_ar: "مباريات الدولة (IT, Data & IA)",
    desc_fr: "Préparation aux concours de la fonction publique (Ministères, ORMVA, ANCFCC, DGI, CDG) - Filières IT, Data & IA.",
    desc_ar: "تحضير مباريات الوظيفة العمومية - تخصصات البيانات، الذكاء الاصطناعي والشبكات."
  }
};

const subdomainTranslations = {
  EDU_PSYCHO: {
    name_fr: "Psychologie de l'éducation",
    name_ar: "علم النفس التربوي",
    desc_fr: "Développement cognitif, théories de l'apprentissage (béhaviorisme, constructivisme, socio-constructivisme).",
    desc_ar: "النمو المعرفي، ونظريات التعلم (السلوكية، البنائية، السوسيو-بنائية، الجشطالت والتحليل النفسي)."
  },
  EDU_SOCIO: {
    name_fr: "Sociologie de l'éducation",
    name_ar: "علم الاجتماع التربوي",
    desc_fr: "Sociologie de l'école, climat scolaire, dynamique de groupe et éthique professionnelle.",
    desc_ar: "علم الاجتماع التربوي، دينامية الجماعة، الحياة المدرسية، والمواطنة وأخلاقيات المهنة."
  },
  DID_CONCEPTS: {
    name_fr: "Concepts fondamentaux en didactique",
    name_ar: "المفاهيم الأساسية في الديداكتيك",
    desc_fr: "Concepts didactiques fondamentaux, transposition, contrat, représentations.",
    desc_ar: "المثلث الديداكتيكي، النقل الديداكتيكي، العقد الديداكتيكي، وتمثلات المتعلمين."
  },
  DID_CURRICULUM: {
    name_fr: "Curriculum et ressources didactiques",
    name_ar: "المنهاج والدعامات الديداكتيكية",
    desc_fr: "Programmes officiels, orientations pédagogiques de l'informatique.",
    desc_ar: "المنهاج الدراسي المغربي للمعلوماتية، التخطيط والدعامات الديداكتيكية."
  },
  DID_APPROCHES: {
    name_fr: "Approches et démarches didactiques",
    name_ar: "النهوج والتدريس الفعال",
    desc_fr: "Démarches d'enseignement, évaluation, remédiation et activités pratiques.",
    desc_ar: "البيداغوجيات الحديثة، التدريس بالكفايات، حل المشكلات والتقويم."
  }
};

const courseArabicTitles = {
  19: "الديداكتيك العامة: المثلث والنقل الديداكتيكي والعقد الديداكتيكي",
  20: "تمثلات المتعلمين والعوائق الديداكتيكية في المعلوماتية",
  21: "الوضعية المشكلة والوضعيات الديداكتيكية في المعلوماتية",
  22: "المنهاج الرسمي للمعلوماتية في السلك الثانوي المغربي",
  23: "تخطيط الموارد الديداكتيكية وتكنولوجيا التعليم (TICE)",
  24: "التدريس بالأهداف (PPO) والتدريس بالكفايات (APC)",
  25: "نهج التقصي والتعلم النشط في الفصل الدراسي",
  26: "نظريات التعلم وعلم النفس التربوي (السلوكية، البنائية، السوسيو-بنائية)",
  27: "علم نفس نمو المراهق والإدراك",
  28: "علم الاجتماع التربوي، المناخ المدرسي ودينامية الجماعة",
  29: "التربية الدامجة، تكافؤ الفرص وأخلاقيات المهنة"
};

const getLocalizedDomainName = (dom, lang) => {
  if (!dom) return '';
  if (dom.code === 'SCIENCES_EDU' && lang === 'ar' && domainTranslations.SCIENCES_EDU?.name_ar) {
    return domainTranslations.SCIENCES_EDU.name_ar;
  }
  return dom.name;
};

const getLocalizedDomainDesc = (dom, lang) => {
  if (!dom) return '';
  const config = getDomainConfig(dom.code);
  if (dom.code === 'SCIENCES_EDU' && lang === 'ar' && domainTranslations.SCIENCES_EDU?.desc_ar) {
    return domainTranslations.SCIENCES_EDU.desc_ar;
  }
  return dom.description || config.description;
};

const getLocalizedSubdomainName = (sub, lang) => {
  if (!sub) return '';
  if (sub.code?.startsWith('DID_') || sub.domain === 'DIDACTIQUE') {
    return sub.name;
  }
  if (lang === 'ar' && subdomainTranslations[sub.code]?.name_ar) {
    return subdomainTranslations[sub.code].name_ar;
  }
  return sub.name;
};

const getLocalizedSubdomainDesc = (sub, lang) => {
  if (!sub) return '';
  const config = getSubdomainConfig(sub.code);
  if (sub.code?.startsWith('DID_') || sub.domain === 'DIDACTIQUE') {
    return sub.description || config.desc;
  }
  if (lang === 'ar' && subdomainTranslations[sub.code]?.desc_ar) {
    return subdomainTranslations[sub.code].desc_ar;
  }
  return sub.description || config.desc;
};

const getLocalizedCourseTitle = (c, lang) => {
  if (!c) return '';
  if (c.domain_code === 'DIDACTIQUE' || c.subdomain_code?.startsWith('DID_')) {
    return c.title;
  }
  if (lang === 'ar') {
    if (c.title_ar) return c.title_ar;
    if (courseArabicTitles[c.id]) return courseArabicTitles[c.id];
  }
  return c.title;
};

const Courses = () => {
  const { user } = useAuth();
  const [prepLang, setPrepLang] = useState(() => {
    try {
      return localStorage.getItem('user_prep_lang') || 'fr';
    } catch (e) {
      return 'fr';
    }
  });

  const handleSetPrepLang = (lang) => {
    setPrepLang(lang);
    setCourseLang(lang);
    try {
      localStorage.setItem('user_prep_lang', lang);
    } catch (e) { }
  };
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
  const [openQcmIds, setOpenQcmIds] = useState({});
  const [selectedRefQuestion, setSelectedRefQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'in_progress', 'favorites'
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'video', 'examples', 'astuces', 'qcm'
  const [courseLang, setCourseLang] = useState('fr'); // 'ar', 'fr'
  const [qcmLangFilter, setQcmLangFilter] = useState('all'); // 'all', 'ar', 'fr'
  const [adminTrackFilter, setAdminTrackFilter] = useState('all'); // 'all', 'crmef', 'concours_etat'
  const [isNoteChatbotOpen, setIsNoteChatbotOpen] = useState(false);
  const [isVideoAiOpen, setIsVideoAiOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: 'Bonjour ! Je suis votre Assistant IA. Posez-moi vos questions à tout moment pendant le visionnage de la vidéo !' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const aiChatRef = useRef(null);

  const handleSendVideoAiQuestion = async (customText) => {
    const query = customText || aiInput;
    if (!query || !query.trim() || aiLoading) return;

    const userMsg = { sender: 'user', text: query.trim() };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await API.post('ai/chat/', {
        message: query.trim(),
        course_id: activeCourseData?.id,
        chat_history: aiMessages
      });
      setAiMessages(prev => [...prev, { sender: 'bot', text: res.data.response || res.data.message || res.data.reply || 'Voici la réponse à votre question.' }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { sender: 'bot', text: 'Désolé, une erreur s’est produite lors de la connexion à l’assistant IA.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiMessages, aiLoading]);

  const getFilteredDomains = () => {
    const list = (Array.isArray(domains) ? domains : []).filter(Boolean);

    // For Admins (staff / superuser): filter by adminTrackFilter switcher
    if (user?.is_staff || user?.is_superuser) {
      if (adminTrackFilter === 'crmef') {
        return list.filter(d => d?.code !== 'CONCOURS_ETAT');
      }
      if (adminTrackFilter === 'concours_etat') {
        return list.filter(d => d?.code === 'CONCOURS_ETAT');
      }
      return list;
    }

    // For Candidates: filter by user.target_exam
    const target = (user?.target_exam || '').toLowerCase();
    if (target.includes('concours_etat') || target === 'concours_etat') {
      return list.filter(d => d?.code === 'CONCOURS_ETAT');
    }
    if (target.includes('crmef') || target.includes('enseignement')) {
      return list.filter(d => d?.code !== 'CONCOURS_ETAT');
    }

    return list;
  };

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subQuestions, setSubQuestions] = useState([]);
  // User identification key for strictly isolated highlights & notes
  const userKey = user?.id ? `u_${user.id}` : (user?.email ? `u_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'u_guest');

  const [notes, setNotes] = useState({});
  const [noteSaveStatus, setNoteSaveStatus] = useState('');
  const [copiedNote, setCopiedNote] = useState(false);

  // ── Highlight, Video Progress & Timestamps state (PER USER ISOLATED) ─────
  const [highlights, setHighlights] = useState({});
  const [highlightToolbar, setHighlightToolbar] = useState(null); // { x, y, text, range }
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [videoTimestamps, setVideoTimestamps] = useState({});

  // Reload notes, highlights, video progress & timestamps when user logs in / switches
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(`user_course_notes_${userKey}`);
      setNotes(savedNotes ? JSON.parse(savedNotes) : {});
    } catch (e) { setNotes({}); }

    try {
      const savedHl = localStorage.getItem(`course_highlights_${userKey}`);
      if (savedHl) {
        const parsed = JSON.parse(savedHl);
        const cleanedMap = {};
        for (const [k, list] of Object.entries(parsed)) {
          if (Array.isArray(list)) {
            cleanedMap[k] = list.filter(h => h && typeof h.text === 'string' && h.text.trim().length >= 2 && h.text.trim().length <= 150);
          }
        }
        setHighlights(cleanedMap);
      } else {
        setHighlights({});
      }
    } catch (e) { setHighlights({}); }

    try {
      const savedVp = localStorage.getItem(`user_video_progress_${userKey}`);
      setVideoProgress(savedVp ? JSON.parse(savedVp) : {});
    } catch (e) { setVideoProgress({}); }

    try {
      const savedVt = localStorage.getItem(`user_video_timestamps_${userKey}`);
      setVideoTimestamps(savedVt ? JSON.parse(savedVt) : {});
    } catch (e) { setVideoTimestamps({}); }
  }, [userKey]);

  const handleSaveVideoProgress = (courseId, percentage) => {
    if (!courseId) return;
    const pct = Math.min(100, Math.max(0, percentage));
    setVideoProgress(prev => {
      const updated = { ...prev, [courseId]: pct };
      try {
        localStorage.setItem(`user_video_progress_${userKey}`, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });

    if (pct >= 100 && selectedCourse && !selectedCourse.is_completed) {
      toggleCourseCompleted(courseId, false);
    }
  };

  const handleSaveTimestamp = (courseId, seconds) => {
    if (!courseId) return;
    const sec = Math.max(0, Math.floor(seconds));
    setVideoTimestamps(prev => {
      const updated = { ...prev, [courseId]: sec };
      try {
        localStorage.setItem(`user_video_timestamps_${userKey}`, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };



  const HIGHLIGHT_COLORS = [
    { id: 'yellow', label: 'Jaune', bg: '#fef08a', text: '#78350f' },
    { id: 'green', label: 'Vert', bg: '#bbf7d0', text: '#14532d' },
    { id: 'blue', label: 'Bleu', bg: '#bae6fd', text: '#0c4a6e' },
    { id: 'pink', label: 'Rose', bg: '#fbcfe8', text: '#831843' },
    { id: 'orange', label: 'Orange', bg: '#fed7aa', text: '#7c2d12' },
  ];


  // Tab scroll navigation state
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollArrows = useCallback(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 4);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScrollArrows();
    const el = tabsContainerRef.current;
    if (el) el.addEventListener('scroll', checkScrollArrows);
    window.addEventListener('resize', checkScrollArrows);
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollArrows);
      window.removeEventListener('resize', checkScrollArrows);
    };
  }, [checkScrollArrows, activeTab, currentStep]);

  const scrollTabs = useCallback((dir) => {
    const el = tabsContainerRef.current;
    if (el) el.scrollBy({ left: dir * 200, behavior: 'smooth' });
  }, []);

  // Helper: extract Google Drive file ID from any Drive URL
  const getDriveFileId = (url) => {
    if (!url) return null;
    if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
      const match = url.match(/(?:file\/d\/|id=)([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  // Helper: returns proxy URL — backend streams the Drive video to avoid CORS/CSP issues
  const getDriveDirectUrl = (fileId) =>
    `/api/proxy/drive-video/?id=${fileId}`;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    // Google Drive → direct stream URL (used with <video> tag, not iframe)
    const driveId = getDriveFileId(url);
    if (driveId) return getDriveDirectUrl(driveId);

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

  const getVideoEmbedUrlWithTimestamp = (url, courseId) => {
    if (!url) return '';
    const savedSec = videoTimestamps[courseId] || 0;

    // Google Drive → direct stream (timestamp handled via HTML5 video ref, not URL)
    const driveId = getDriveFileId(url);
    if (driveId) return getDriveDirectUrl(driveId);

    const embedUrl = getEmbedUrl(url);
    if (savedSec > 0 && embedUrl) {
      const sep = embedUrl.includes('?') ? '&' : '?';
      return `${embedUrl}${sep}start=${savedSec}`;
    }
    return embedUrl;
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [domList] = await Promise.all([fetchDomains(), fetchAllCourses(), fetchStats()]);

      // Candidate Auto-Direct: open targeted track (e.g. Data Scientist & IA) directly
      if (user && !user.is_staff && !user.is_superuser) {
        const target = (user.target_exam || '').toUpperCase().trim();
        const knownSubdomainCodes = ['DATA_SCIENCE_IA', 'DATA_ENG', 'DATA_ANALYTICS', 'DBA_ADMIN', 'INFO_GEN_GL', 'SYS_CLOUD_DEV', 'CYBERSEC'];

        if (knownSubdomainCodes.includes(target)) {
          const dom = (domList || []).find(d => d.code === 'CONCOURS_ETAT');
          if (dom) {
            setSelectedDomainCode('CONCOURS_ETAT');
            setSubdomains(dom.subdomains || []);
            setSelectedSubdomainCode(target);
            await fetchCourses(target);
            setCurrentStep('courses_list');
          }
        }
      }

      setLoading(false);
    };
    if (user !== undefined) {
      init();
    }
  }, [user]);

  const fetchDomains = async () => {
    try {
      const res = await API.get('domains/');
      const domList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setDomains(domList);
      return domList;
    } catch (err) {
      console.error("fetchDomains error:", err);
      setDomains([]);
      return [];
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
    setCurrentStep('courses_list');
    setLoading(true);
    await fetchCourses(code);
    setLoading(false);
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    const isSciencesEdu = course.domain_code === 'SCIENCES_EDU' || 
                          course.subdomain_code?.startsWith('EDU_');
    const defaultLang = isSciencesEdu ? prepLang : 'fr';
    setCourseLang(defaultLang);
    setQcmLangFilter(defaultLang);
    setIsVideoLoading(false); // Reset loading state for new course
    if (course.video_url) {
      setActiveTab('video');
    } else {
      setActiveTab('content');
    }
    setLoading(true);
    await fetchCourseDetail(course.id);
    setCurrentStep('course_detail');
    setLoading(false);
  };

  const fetchCourses = async (subCode) => {
    try {
      const res = await API.get(`courses/?subdomain=${subCode}`);
      const courseList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setCourses(courseList);
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



  const currentNoteKey = useMemo(() => {
    if (!selectedCourse) return '';
    if (isCLanguage && currentCLesson) {
      return `${userKey}_note_c_lesson_${currentCLesson.num}`;
    }
    return `${userKey}_note_course_${selectedCourse.id}`;
  }, [selectedCourse, isCLanguage, currentCLesson, userKey]);

  const currentHighlightKey = useMemo(() => {
    if (!selectedCourse) return '';
    if (isCLanguage && currentCLesson) return `${userKey}_hl_c_${currentCLesson.num}`;
    return `${userKey}_hl_course_${selectedCourse.id}`;
  }, [selectedCourse, isCLanguage, currentCLesson, userKey]);

  const currentHighlights = useMemo(() => {
    return highlights[currentHighlightKey] || [];
  }, [highlights, currentHighlightKey]);

  const saveHighlights = useCallback((key, list) => {
    setHighlights(prev => {
      const updated = { ...prev, [key]: list };
      try { localStorage.setItem(`course_highlights_${userKey}`, JSON.stringify(updated)); } catch (e) { }
      return updated;
    });
  }, [userKey]);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) { setHighlightToolbar(null); return; }
    const rawText = selection.toString();
    const text = rawText.replace(/\s+/g, ' ').trim();
    if (!text || text.length < 2) { setHighlightToolbar(null); return; }

    const container = contentRef.current;
    if (!container || !container.contains(selection.anchorNode)) {
      setHighlightToolbar(null);
      return;
    }

    let node = selection.anchorNode;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    const lineEl = node ? node.closest('[data-line-idx]') : null;
    const lineIdx = lineEl ? parseInt(lineEl.getAttribute('data-line-idx'), 10) : null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setHighlightToolbar({ x: rect.left + rect.width / 2, y: rect.top - 8, text, lineIdx });
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('touchend', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    };
  }, [handleTextSelection]);

  const stripArabicDiacritics = (str) => {
    if (!str) return '';
    return str.replace(/[\u064B-\u065F\u0640]/g, '');
  };

  const normalizeForMatch = (str) => {
    if (!str) return '';
    return stripArabicDiacritics(str).trim().toLowerCase().replace(/\s+/g, ' ');
  };

  const removeHighlightForText = useCallback(() => {
    if (!highlightToolbar || !currentHighlightKey) return;
    const { text } = highlightToolbar;
    const normT = normalizeForMatch(text);

    const filtered = currentHighlights.filter(h => {
      const normH = normalizeForMatch(h.text);
      if (normH && normT && (normH === normT || normH.includes(normT) || normT.includes(normH))) {
        return false;
      }
      return true;
    });

    saveHighlights(currentHighlightKey, filtered);
    setHighlightToolbar(null);
    window.getSelection()?.removeAllRanges();
  }, [highlightToolbar, currentHighlightKey, currentHighlights, saveHighlights]);

  const applyHighlight = useCallback((colorId) => {
    if (!highlightToolbar || !currentHighlightKey) return;
    const { text, lineIdx } = highlightToolbar;
    if (!text) return;

    const normT = normalizeForMatch(text);

    const filtered = currentHighlights.filter(h => {
      if (h.lineIdx === lineIdx) {
        const normH = normalizeForMatch(h.text);
        if (normH && normT && (normH === normT || normH.includes(normT) || normT.includes(normH))) {
          return false;
        }
      }
      return true;
    });

    const newEntry = { id: Date.now(), lineIdx, text, colorId };
    saveHighlights(currentHighlightKey, [...filtered, newEntry]);
    setHighlightToolbar(null);
    window.getSelection()?.removeAllRanges();
  }, [highlightToolbar, currentHighlightKey, currentHighlights, saveHighlights]);

  const removeHighlight = useCallback((id) => {
    const updated = currentHighlights.filter(h => h.id !== id);
    saveHighlights(currentHighlightKey, updated);
  }, [currentHighlights, currentHighlightKey, saveHighlights]);

  const clearAllHighlights = useCallback(() => {
    if (!currentHighlightKey) return;
    saveHighlights(currentHighlightKey, []);
  }, [currentHighlightKey, saveHighlights]);

  const handleNoteChange = (text) => {
    if (!currentNoteKey) return;
    const updated = { ...notes, [currentNoteKey]: text };
    setNotes(updated);
    setNoteSaveStatus('Sauvegarde...');
    try {
      localStorage.setItem(`user_course_notes_${userKey}`, JSON.stringify(updated));
      setTimeout(() => setNoteSaveStatus('Sauvegardé ✓'), 400);
    } catch (e) {
      console.error('Save note error:', e);
    }
  };

  const handleClearNote = () => {
    if (!currentNoteKey) return;
    if (window.confirm('Voulez-vous vraiment effacer vos notes pour ce cours ?')) {
      const updated = { ...notes };
      delete updated[currentNoteKey];
      setNotes(updated);
      try {
        localStorage.setItem(`user_course_notes_${userKey}`, JSON.stringify(updated));
      } catch (e) { }
    }
  };

  const handleCopyNote = () => {
    const text = notes[currentNoteKey] || '';
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleDownloadNote = () => {
    const text = notes[currentNoteKey] || '';
    if (!text) return;
    const title = activeCourseData?.title || 'note';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Notes_${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Detect if this is a bilingual course (ONLY Sciences de l'éducation requires Arabic/bilingual toggle)
  const isBilingualCourse = useMemo(() => {
    const dCode = activeCourseData?.domain_code || selectedCourse?.subdomain?.domain?.code || selectedDomainCode;
    const sCode = activeCourseData?.subdomain_code || selectedSubdomainCode;
    return dCode === 'SCIENCES_EDU' || (sCode && sCode.startsWith('EDU_'));
  }, [activeCourseData, selectedCourse, selectedDomainCode, selectedSubdomainCode]);

  // Force courseLang to 'fr' for all Specialty & Didactique courses
  useEffect(() => {
    if (!isBilingualCourse) {
      setCourseLang('fr');
    }
  }, [isBilingualCourse, selectedCourse]);

  // Get the content to display based on selected language
  const getDisplayContent = useCallback((field) => {
    if (!activeCourseData) return '';
    // Didactique courses are French-only
    if (isDidactiqueCourse) {
      if (field === 'content') return activeCourseData.content_fr || activeCourseData.content || '';
      if (field === 'examples') return activeCourseData.examples_fr || activeCourseData.examples || '';
      if (field === 'astuces') return activeCourseData.astuces_fr || activeCourseData.astuces || '';
    }
    // For bilingual courses, use language-specific content
    if (isBilingualCourse) {
      if (courseLang === 'ar') {
        if (field === 'content') return activeCourseData.content_ar || activeCourseData.content || '';
        if (field === 'examples') return activeCourseData.examples_ar || activeCourseData.examples || '';
        if (field === 'astuces') return activeCourseData.astuces_ar || activeCourseData.astuces || '';
      }
      if (courseLang === 'fr') {
        if (field === 'content') return activeCourseData.content_fr || activeCourseData.content || '';
        if (field === 'examples') return activeCourseData.examples_fr || activeCourseData.examples || '';
        if (field === 'astuces') return activeCourseData.astuces_fr || activeCourseData.astuces || '';
      }
    }
    return activeCourseData[field] || '';
  }, [activeCourseData, isBilingualCourse, isDidactiqueCourse, courseLang]);

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

    return [];
  };

  const isArabicQ = (q) => {
    if (!q) return false;
    const text = (q.question_text || '') + ' ' + (q.option_a || '');
    const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
    return arabicCount > 10;
  };

  const targetedQuestions = useMemo(() => {
    let questions = isCLanguage
      ? filterQuestionsForCourse(subQuestions, activeCourseData)
      : subQuestions.filter(q => q.course === selectedCourse?.id);

    // Only show real past exam questions (not AI-generated ones)
    questions = questions.filter(q => !q.source_type || q.source_type === 'past_exam');

    // Apply language filter for bilingual courses
    if (isBilingualCourse) {
      const activeFilter = (qcmLangFilter && qcmLangFilter !== 'all') ? qcmLangFilter : courseLang;
      if (activeFilter === 'ar' || activeFilter === 'fr') {
        questions = questions.filter(q => {
          const isAr = isArabicQ(q);
          return activeFilter === 'ar' ? isAr : !isAr;
        });
      }
    }

    // Sort by year desc then question_number
    questions.sort((a, b) => {
      if ((b.exam_year || 0) !== (a.exam_year || 0)) return (b.exam_year || 0) - (a.exam_year || 0);
      return (a.question_number || '').localeCompare(b.question_number || '', undefined, { numeric: true });
    });

    return questions;
  }, [subQuestions, activeCourseData, isCLanguage, selectedCourse, isBilingualCourse, qcmLangFilter, courseLang]);

  // Helper: get a clean display label for a question (no internal developer codes)
  const getQuestionLabel = (q, idx) => {
    const isAr = isArabicQ(q) || courseLang === 'ar';
    const qNumStr = (idx + 1 < 10 ? '0' : '') + (idx + 1);
    const num = isAr ? `سؤال ${qNumStr}` : `Question ${qNumStr}`;
    return { year: null, num };
  };

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

  // ── Automatic Background Video Watch & Timestamp Tracker ──────────────────
  useEffect(() => {
    if (activeTab !== 'video' || !activeCourseData?.id || !activeCourseData?.video_url) {
      return;
    }

    const courseId = activeCourseData.id;

    // Automatically record exact timestamp (seconds) and progress every 3 seconds
    const interval = setInterval(() => {
      // 1. Save timestamp seconds
      setVideoTimestamps(prev => {
        const currentSec = prev[courseId] || 0;
        const nextSec = currentSec + 3;
        const updated = { ...prev, [courseId]: nextSec };
        try {
          localStorage.setItem(`user_video_timestamps_${userKey}`, JSON.stringify(updated));
        } catch (e) { }
        return updated;
      });

      // 2. Save watch progress percentage
      setVideoProgress(prev => {
        const currentPct = prev[courseId] || 0;
        if (currentPct >= 100) return prev;

        const nextPct = Math.min(100, currentPct + 1);
        const updated = { ...prev, [courseId]: nextPct };
        try {
          localStorage.setItem(`user_video_progress_${userKey}`, JSON.stringify(updated));
        } catch (e) { }

        if (nextPct >= 100 && selectedCourse && !selectedCourse.is_completed) {
          toggleCourseCompleted(courseId, false);
        }
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab, activeCourseData, userKey, selectedCourse]);

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
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/10 dark:text-[#F8C62F] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              PRÉPARATION AUX CONCOURS 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fiches de Cours Académiques
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Choisissez un grand module informatique ci-dessous pour démarrer vos révisions.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0 shadow-sm">
            <ProgressRing percentage={stats?.percentage || 0} size={54} strokeWidth={5} />
            <div>
              <div className="text-[11px] font-bold text-[#03594e] dark:text-[#F8C62F] uppercase tracking-wider">
                Progression Globale
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {stats?.completed || 0} / {stats?.total || 0} <span className="text-xs font-normal text-slate-400">validés</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Switcher Bar */}
        {(user?.is_staff || user?.is_superuser) && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Mode Administrateur : Filtre des Domaines & Parcours</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-950/90 p-1 rounded-xl border border-amber-500/20 shadow-xs flex-wrap">
              <button
                type="button"
                onClick={() => setAdminTrackFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${adminTrackFilter === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Globe className="w-3.5 h-3.5" /> Tout Afficher
              </button>
              <button
                type="button"
                onClick={() => setAdminTrackFilter('crmef')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${adminTrackFilter === 'crmef'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> CRMEF Enseignement
              </button>
              <button
                type="button"
                onClick={() => setAdminTrackFilter('concours_etat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${adminTrackFilter === 'concours_etat'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Concours de l'État (IT/Data)
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredDomains().map((dom) => {
            const config = getDomainConfig(dom.code);
            const Icon = config.icon;
            const isSE = dom.code === 'SCIENCES_EDU';

            const domainCourses = allCourses.filter(c => c.domain_code === dom.code);
            const total = domainCourses.length;
            const completed = domainCourses.filter(c => c.is_completed).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const subCount = dom.subdomains?.length || 0;

            return (
              <div
                key={dom.code}
                role="button"
                tabIndex={0}
                onClick={() => handleDomainChange(dom.code)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDomainChange(dom.code); }}
                className="group relative flex flex-col justify-between p-0 rounded-2xl overflow-hidden text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl select-none"
                style={{ boxShadow: '0 4px 20px rgba(3,89,78,0.08)', border: '1px solid #d4ede9', background: '#ffffff', minHeight: 220 }}
              >
                {/* Colored top accent bar */}
                <div style={{ height: 4, background: 'linear-gradient(90deg,#03594e,#F8C62F)' }} className="w-full shrink-0" />
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(3,89,78,0.03) 0%, rgba(248,198,47,0.04) 100%)' }} />

                <div className="flex flex-col flex-1 p-6 space-y-4 relative z-10 w-full">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(3,89,78,0.08)', border: '1px solid rgba(3,89,78,0.15)' }}>
                      <Icon className="w-6 h-6" style={{ color: '#03594e' }} />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full" style={{ background: 'rgba(248,198,47,0.15)', color: '#946e00', border: '1px solid rgba(248,198,47,0.3)' }}>
                      {subCount} {subCount > 1 ? (isSE && prepLang === 'ar' ? 'فروع' : 'filières') : (isSE && prepLang === 'ar' ? 'فرع' : 'filière')}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-extrabold leading-snug group-hover:text-[#03594e] transition-colors" style={{ color: '#1a2e2a' }}>
                      {isSE ? getLocalizedDomainName(dom, prepLang) : dom.name}
                    </h3>
                    <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: '#6b8c87' }}>
                      {isSE ? getLocalizedDomainDesc(dom, prepLang) : (dom.description || config.description)}
                    </p>
                  </div>

                  {total > 0 && (
                    <div className="space-y-1.5 pt-4" style={{ borderTop: '1px solid #e8f5f3' }}>
                      <div className="flex items-center justify-between" style={{ fontSize: 10, fontWeight: 700, color: '#6b8c87' }}>
                        <span>{isSE && prepLang === 'ar' ? 'نسبة الإنجاز' : 'Progression'}</span>
                        <span style={{ color: '#03594e' }}>{completed}/{total} {isSE && prepLang === 'ar' ? 'دروس' : 'cours'}</span>
                      </div>
                      <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: '#e8f5f3' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percentage}%`, background: percentage === 100 ? '#03594e' : 'linear-gradient(90deg,#03594e,#F8C62F)' }} />
                      </div>
                    </div>
                  )}

                  {/* Language Selector ONLY on Sciences de l'éducation Card */}
                  {isSE && (
                    <div className="flex items-center justify-between pt-2.5 mt-1" style={{ borderTop: '1px solid #f0f7f6' }} onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] font-extrabold" style={{ color: '#6b8c87' }}>
                        {prepLang === 'ar' ? 'لغة التحضير :' : 'Langue :'}
                      </span>
                      <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: '#f0f7f6', border: '1px solid #d4ede9' }}>
                        <button
                          type="button"
                          onClick={() => handleSetPrepLang('fr')}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${prepLang === 'fr'
                            ? 'bg-[#03594e] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          🇫🇷 FR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPrepLang('ar')}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${prepLang === 'ar'
                            ? 'bg-[#03594e] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          🇲🇦 عربي
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    <span className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: '#03594e' }}>
                      {isSE && prepLang === 'ar' ? 'استكشاف الدروس' : 'Explorer'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
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

    const getFilteredSubdomains = () => {
      const list = Array.isArray(subdomains) ? subdomains : [];
      if (user?.is_staff || user?.is_superuser) return list;

      const target = (user?.target_exam || '').toUpperCase().trim();
      const match = list.find(s => s.code === target);
      if (match) return [match];
      return list;
    };

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
            <span className="text-[#03594e] font-extrabold">{getLocalizedDomainName(domainObj, prepLang)}</span>
          </nav>

          <button
            type="button"
            onClick={() => setCurrentStep('domains')}
            className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour aux grands modules
          </button>
        </div>

        {/* Compact Header for Subdomain View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/10 dark:text-[#F8C62F] text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              {(selectedDomainCode === 'DIDACTIQUE' || selectedDomainCode === 'DEV' || selectedDomainCode === 'SYS_RES' || selectedDomainCode === 'LOG') ? 'GRAND MODULE' : (prepLang === 'ar' ? 'الوحدة الكبرى' : 'GRAND MODULE')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getLocalizedDomainName(domainObj, prepLang)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              {getLocalizedDomainDesc(domainObj, prepLang)}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0 shadow-sm">
            <ProgressRing percentage={domainPercentage} size={54} strokeWidth={5} />
            <div>
              <div className="text-[11px] font-bold text-[#03594e] dark:text-[#F8C62F] uppercase tracking-wider">Avancement du Module</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {completedCourses} / {totalCourses} <span className="text-xs font-normal text-slate-400">validés</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {getFilteredSubdomains().map((sub) => {
            const config = getSubdomainConfig(sub.code);
            const Icon = config.icon;

            const subCourses = allCourses.filter(c => c.subdomain === sub.id || c.subdomain_code === sub.code || c.subdomain === sub.code);
            const total = subCourses.length;
            const completed = subCourses.filter(c => c.is_completed).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={sub.code}
                role="button"
                tabIndex={0}
                onClick={() => handleSubdomainChange(sub.code)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSubdomainChange(sub.code); }}
                className="group relative flex flex-col text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-2xl overflow-hidden select-none"
                style={{ boxShadow: '0 4px 20px rgba(3,89,78,0.08)', border: '1px solid #d4ede9', background: '#ffffff', minHeight: 200 }}
              >
                {/* Top accent */}
                <div style={{ height: 4, background: 'linear-gradient(90deg,#03594e,#046a5d,#F8C62F)' }} className="w-full shrink-0" />

                <div className="flex flex-col flex-1 p-6 space-y-4 relative z-10 w-full">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(3,89,78,0.08)', border: '1px solid rgba(3,89,78,0.15)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#03594e' }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black" style={{ color: '#03594e' }}>{total}</div>
                      <div className="text-[10px]" style={{ color: '#6b8c87' }}>{(selectedDomainCode === 'DIDACTIQUE' || sub.code?.startsWith('DID_')) ? 'fiches' : (prepLang === 'ar' ? 'دروس' : 'fiches')}</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-extrabold leading-snug group-hover:text-[#03594e] transition-colors" style={{ color: '#1a2e2a' }}>
                      {getLocalizedSubdomainName(sub, prepLang)}
                    </h3>
                    <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: '#6b8c87' }}>
                      {getLocalizedSubdomainDesc(sub, prepLang)}
                    </p>
                  </div>

                  {total > 0 && (
                    <div className="space-y-1.5 pt-3" style={{ borderTop: '1px solid #e8f5f3' }}>
                      <div className="flex items-center justify-between" style={{ fontSize: 10, fontWeight: 700 }}>
                        <span style={{ color: '#6b8c87' }}>{percentage}% complété</span>
                        <span style={{ color: '#03594e' }}>{completed}/{total}</span>
                      </div>
                      <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: '#e8f5f3' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percentage}%`, background: percentage === 100 ? '#03594e' : 'linear-gradient(90deg,#03594e,#F8C62F)' }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,198,47,0.12)', color: '#946e00', border: '1px solid rgba(248,198,47,0.25)' }}>
                      Filière
                    </span>
                    <span className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: '#03594e' }}>
                      Ouvrir <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const [courseTypeFilter, setCourseTypeFilter] = useState('all'); // 'all', 'fiches', 'videos'

  const renderCoursesListView = () => {
    const domainObj = (Array.isArray(domains) ? domains : []).find(d => d.code === selectedDomainCode);
    const subdomainObj = (Array.isArray(subdomains) ? subdomains : []).find(s => s.code === selectedSubdomainCode);
    const domainConfig = getDomainConfig(selectedDomainCode);

    const allList = Array.isArray(courses) ? courses : [];

    // Sort fiches in strict pedagogical order: OSI / Architecture first -> Adressage second -> Routage third
    const fichesList = allList
      .filter(c => !c.video_url)
      .sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();

        const getPriority = (t) => {
          if (t.includes('osi') || t.includes('couche') || t.includes('architecture')) return 1;
          if (t.includes('adressage') || t.includes('ipv4') || t.includes('cidr')) return 2;
          if (t.includes('routage') || t.includes('rip') || t.includes('ospf') || t.includes('ipv6')) return 3;
          return 4;
        };

        return getPriority(titleA) - getPriority(titleB);
      });

    const videosList = allList
      .filter(c => Boolean(c.video_url))
      .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

    const renderCard = (c) => {
      const isC = c.title?.toLowerCase().includes('langage c') || false;
      const isDone = c.is_completed;
      let progressText = "";
      let pct = 0;

      if (isC) {
        pct = Math.round(((selectedCLessonIdx + 1) / 50) * 100);
        progressText = `${selectedCLessonIdx + 1} / 50 leçons lues`;
      } else if (c.video_url && videoProgress[c.id] != null) {
        pct = videoProgress[c.id];
        progressText = pct === 100 ? "Visionnage complété ✓" : `Visionné à ${pct}%`;
      } else {
        pct = isDone ? 100 : 0;
        progressText = isDone ? "Révision complétée ✓" : "Non commencée";
      }

      const TypeIcon = isC ? Layers : c.video_url ? Video : BookOpen;
      const badgeStyle = isC
        ? { background: 'rgba(124,58,237,0.1)', color: '#6d28d9', border: '1px solid rgba(124,58,237,0.2)' }
        : c.video_url
          ? { background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }
          : { background: 'rgba(3,89,78,0.08)', color: '#03594e', border: '1px solid rgba(3,89,78,0.2)' };
      const badgeLabel = isC ? 'FORMATION PROGRESSIVE' : c.video_url ? 'VIDÉO & FICHE' : 'FICHE DE RÉVISION';

      return (
        <button
          key={c.id}
          type="button"
          onClick={() => handleCourseSelect(c)}
          className="group relative flex flex-col text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(3,89,78,0.07)', border: isDone ? '1px solid rgba(3,89,78,0.3)' : '1px solid #d4ede9', background: '#ffffff' }}
        >
          {/* Top colored strip */}
          <div style={{ height: 4, background: isDone ? '#03594e' : isC ? '#7c3aed' : c.video_url ? '#dc2626' : 'linear-gradient(90deg,#03594e,#F8C62F)' }} className="w-full shrink-0" />

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(3,89,78,0.02) 0%, rgba(248,198,47,0.03) 100%)' }} />

          <div className="flex flex-col flex-1 p-5 gap-3 relative z-10">
            {/* Badge row */}
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide" style={badgeStyle}>
                <TypeIcon className="w-3 h-3" />
                {badgeLabel}
              </span>
              {isDone
                ? <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#03594e' }}><CheckCircle2 className="w-4 h-4" /> Fait</div>
                : <Circle className="w-4 h-4" style={{ color: '#c8e6e2' }} />
              }
            </div>

            {/* Title */}
            <h3 className="text-sm font-extrabold leading-snug flex-1 group-hover:text-[#03594e] transition-colors" style={{ color: '#1a2e2a' }}>
              {getLocalizedCourseTitle(c, prepLang)}
            </h3>

            {/* Progress & CTA */}
            <div className="space-y-2.5 pt-3" style={{ borderTop: '1px solid #e8f5f3' }}>
              <div className="flex items-center justify-between" style={{ fontSize: 10, fontWeight: 700 }}>
                <span style={{ color: '#6b8c87' }}>{progressText}</span>
                <span style={{ color: isDone ? '#03594e' : '#94a3b8' }}>{pct}%</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: '#e8f5f3' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct === 100 ? '#03594e' : 'linear-gradient(90deg,#03594e,#F8C62F)' }} />
              </div>
              <div className="flex items-center justify-end pt-0.5">
                <span className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: '#03594e' }}>
                  {isC ? 'Ouvrir les leçons' : c.video_url ? 'Regarder & réviser' : 'Ouvrir la fiche'} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </button>
      );
    };

    return (
      <motion.div
        key="courses_list"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-1">
            <span onClick={() => setCurrentStep('domains')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shrink-0">Accueil</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
            <span onClick={() => setCurrentStep('subdomains')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shrink-0">{getLocalizedDomainName(domainObj, prepLang) || 'Développement'}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
            <span className="text-[#03594e] font-extrabold shrink-0">{getLocalizedSubdomainName(subdomainObj, prepLang) || 'Sous-domaine'}</span>
          </nav>

          <button type="button" onClick={() => setCurrentStep('subdomains')} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour aux sous-modules
          </button>
        </div>

        {/* Compact Header for Courses List View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/10 dark:text-[#F8C62F] text-xs font-bold uppercase tracking-wider">
              {getLocalizedDomainName(domainObj, prepLang)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getLocalizedSubdomainName(subdomainObj, prepLang)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {getLocalizedSubdomainDesc(subdomainObj, prepLang) || 'Retrouvez les fiches de cours académiques et les explications vidéos structurées.'}
            </p>
          </div>

          {/* Filter Tabs (Clean Segmented Control) */}
          {videosList.length > 0 && fichesList.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCourseTypeFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${courseTypeFilter === 'all'
                  ? 'bg-[#03594e] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                Tout ({allList.length})
              </button>
              <button
                type="button"
                onClick={() => setCourseTypeFilter('fiches')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${courseTypeFilter === 'fiches'
                  ? 'bg-[#03594e] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#F8C62F]" /> Fiches ({fichesList.length})
              </button>
              <button
                type="button"
                onClick={() => setCourseTypeFilter('videos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${courseTypeFilter === 'videos'
                  ? 'bg-[#03594e] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Video className="w-3.5 h-3.5 text-[#F8C62F]" /> Vidéos ({videosList.length})
              </button>
            </div>
          )}
        </div>

        {/* Section 1: Fiches de révision théoriques */}
        {(courseTypeFilter === 'all' || courseTypeFilter === 'fiches') && fichesList.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '2px solid #e8f5f3' }}>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(3,89,78,0.08)', border: '1px solid rgba(3,89,78,0.15)' }}>
                <BookOpen className="w-4 h-4" style={{ color: '#03594e' }} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold" style={{ color: '#1a2e2a' }}>
                  Fiches de Révision Théoriques
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(248,198,47,0.15)', color: '#946e00', border: '1px solid rgba(248,198,47,0.3)' }}>{fichesList.length}</span>
                </h3>
                <p className="text-[11px]" style={{ color: '#6b8c87' }}>Synthèses de cours, concepts clés et définitions académiques</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {fichesList.map(renderCard)}
            </div>
          </div>
        )}

        {/* Section 2: Cours Vidéos en Darija */}
        {(courseTypeFilter === 'all' || courseTypeFilter === 'videos') && videosList.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '2px solid #fde8e8' }}>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <Video className="w-4 h-4" style={{ color: '#dc2626' }} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold" style={{ color: '#1a2e2a' }}>
                  Cours Vidéos de Révision (Darija)
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>{videosList.length}</span>
                </h3>
                <p className="text-[11px]" style={{ color: '#6b8c87' }}>Vidéos explicatives pas-à-pas intégrées avec fiches associées</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {videosList.map(renderCard)}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderCourseContentPanel = () => {
    if (!activeCourseData) return null;

    return (
      <div className="space-y-6 w-full">
        {/* Scrollable Tab Bar with Arrow Navigation for PC */}
        <div className="relative flex items-center gap-0 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800" dir={isBilingualCourse && courseLang === 'ar' ? 'rtl' : 'ltr'}>
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => scrollTabs(-1)}
              className="absolute left-0 z-10 flex items-center justify-center w-8 h-full bg-gradient-to-r from-slate-100 via-slate-100/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 dark:to-transparent rounded-l-2xl transition-opacity"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          )}

          {/* Scrollable Tabs */}
          <div
            ref={tabsContainerRef}
            dir={isBilingualCourse && courseLang === 'ar' ? 'rtl' : 'ltr'}
            className="flex items-center gap-2 p-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent w-full"
            style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
          >
            {[
              { id: 'content', label: courseLang === 'ar' ? 'بطاقة المراجعة' : 'Fiche de Révision', icon: BookOpen, color: 'text-sky-500' },
              { id: 'video', label: courseLang === 'ar' ? 'درس فيديو' : 'Leçon Vidéo', icon: Video, color: 'text-red-500', badge: activeCourseData.video_url },
              { id: 'examples', label: courseLang === 'ar' ? 'تطبيقات وأمثلة' : 'Pratique & Exemples', icon: Code2, color: 'text-indigo-500' },
              { id: 'astuces', label: courseLang === 'ar' ? 'نصائح وفخاخ' : 'Astuces & Pièges', icon: Zap, color: 'text-amber-500' },
              { id: 'notes', label: courseLang === 'ar' ? 'ملاحظاتي' : 'Mes Notes', icon: FileText, color: 'text-emerald-500', badge: Boolean(notes[currentNoteKey]?.trim()) },
              { id: 'qcm', label: courseLang === 'ar' ? `أسئلة موجهة (${targetedQuestions.length})` : `Quiz Ciblés (${targetedQuestions.length})`, icon: HelpCircle, color: 'text-purple-500' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${isActive
                    ? 'bg-[#03594e] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#03594e] hover:bg-[#e6f5f3]'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F8C62F]' : tab.color}`} />
                  <span>{tab.label}</span>
                  {tab.badge && <span className="w-2 h-2 rounded-full bg-[#F8C62F] animate-pulse"></span>}
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => scrollTabs(1)}
              className="absolute right-0 z-10 flex items-center justify-center w-8 h-full bg-gradient-to-l from-slate-100 via-slate-100/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 dark:to-transparent rounded-r-2xl transition-opacity"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          )}
        </div>

        {activeTab === 'video' ? (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leçon Vidéo HD • {activeCourseData.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Explication pas à pas et support de révision (Style Coursera)</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                  Mohamed Chiny & Académie Info
                </span>
                <button
                  type="button"
                  onClick={() => setIsNoteChatbotOpen(!isNoteChatbotOpen)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Ouvrir le bloc-notes personnel"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Prendre des notes</span>
                  {notes[currentNoteKey]?.trim() && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>

            {activeCourseData.video_url ? (
              <div className="space-y-4">
                {/* Full-width 100% HD Video Player */}
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
                  {/* Native HTML5 video: MP4, Google Drive, or any direct video file */}
                  {activeCourseData.video_url.endsWith('.mp4') ||
                   activeCourseData.video_url.includes('/media/') ||
                   getDriveFileId(activeCourseData.video_url) ? (
                    <>
                      {/* Loading overlay */}
                      {isVideoLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/95 gap-4">
                          <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-red-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-5 h-5 text-red-400 fill-current" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-white text-sm font-bold">Chargement de la vidéo...</p>
                            <p className="text-slate-400 text-xs mt-1">Connexion au serveur en cours</p>
                          </div>
                        </div>
                      )}
                      <video
                        ref={videoRef}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain bg-black"
                        src={getDriveFileId(activeCourseData.video_url)
                          ? getDriveDirectUrl(getDriveFileId(activeCourseData.video_url))
                          : activeCourseData.video_url}
                        onLoadStart={() => setIsVideoLoading(true)}
                        onLoadedMetadata={(e) => {
                          setIsVideoLoading(false);
                          const savedSec = videoTimestamps[activeCourseData.id] || 0;
                          if (savedSec > 0 && e.target.duration && savedSec < e.target.duration) {
                            e.target.currentTime = savedSec;
                          }
                        }}
                        onCanPlay={() => setIsVideoLoading(false)}
                        onError={() => setIsVideoLoading(false)}
                        onTimeUpdate={(e) => {
                          const currentSec = Math.floor(e.target.currentTime);
                          if (currentSec > 0) {
                            handleSaveTimestamp(activeCourseData.id, currentSec);
                          }
                        }}
                        onEnded={() => {
                          handleSaveVideoProgress(activeCourseData.id, 100);
                        }}
                      />
                    </>
                  ) : (
                    /* YouTube or other embeds */
                    <iframe
                      key={`video_player_${activeCourseData.id}_${videoTimestamps[activeCourseData.id] || 0}`}
                      src={getVideoEmbedUrlWithTimestamp(activeCourseData.video_url, activeCourseData.id)}
                      title={activeCourseData.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <Video className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Aucune vidéo associée à ce module</h4>
              </div>
            )}
          </div>
        ) : activeTab === 'notes' ? (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Mes Notes Personnelles
                    {noteSaveStatus && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {noteSaveStatus}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeCourseData?.title} • Enregistrement automatique local
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyNote}
                  disabled={!notes[currentNoteKey]}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNote ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadNote}
                  disabled={!notes[currentNoteKey]}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter (.txt)</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearNote}
                  disabled={!notes[currentNoteKey]}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={notes[currentNoteKey] || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Prenez vos notes personnelles ici pour cette leçon (astuces, résumés, formules, questions à revoir)... Elles sont enregistrées automatiquement !"
                  rows={12}
                  className="w-full p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                />
              </div>

              {notes[currentNoteKey]?.trim() && (
                <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Aperçu rendu de vos notes (Markdown)
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                    <MarkdownViewer content={notes[currentNoteKey]} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab !== 'qcm' ? (
          <>
            {/* Highlight Toolbar (floating) */}
            {highlightToolbar && activeTab === 'content' && (
              <div
                className="fixed z-[9999] transform -translate-x-1/2 -translate-y-full pointer-events-auto select-none"
                style={{ left: highlightToolbar.x, top: highlightToolbar.y }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/95 dark:bg-slate-950 border border-slate-700 shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] text-slate-400 font-bold px-1.5 shrink-0 flex items-center gap-1">
                    <Highlighter className="w-3 h-3 text-amber-400" /> Surligner
                  </span>
                  {HIGHLIGHT_COLORS.map(color => (
                    <button
                      key={color.id}
                      type="button"
                      title={`Surligner en ${color.label}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHighlight(color.id)}
                      className="w-6 h-6 rounded-full border-2 border-white/20 hover:scale-125 transition-transform shadow-sm cursor-pointer"
                      style={{ backgroundColor: color.bg }}
                    />
                  ))}
                  {/* Eraser button: Sans couleur */}
                  <div className="w-px h-4 bg-slate-700 mx-0.5" />
                  <button
                    type="button"
                    title="Sans couleur (Effacer le surlignage)"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => removeHighlightForText()}
                    className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-red-500/80 text-slate-200 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-700"
                  >
                    <Eraser className="w-3 h-3 text-amber-400" />
                    <span>Sans couleur</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setHighlightToolbar(null)}
                    className="ml-0.5 text-slate-500 hover:text-white transition-colors p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Arrow pointing down */}
                <div className="flex justify-center">
                  <div className="w-2 h-2 bg-slate-900/95 border-r border-b border-slate-700 rotate-45 -mt-1" />
                </div>
              </div>
            )}

            <div className="glass-card p-8 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-2xl min-h-[400px]">
              {/* Language selector for bilingual courses */}
              {isBilingualCourse && activeTab === 'content' && (
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">Langue</span>
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setCourseLang('fr')}
                      className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${courseLang === 'fr'
                        ? 'bg-white dark:bg-slate-950 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                      <span className="text-sm">🇫🇷</span>
                      <span>Français</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseLang('ar')}
                      className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${courseLang === 'ar'
                        ? 'bg-white dark:bg-slate-950 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                      <span className="text-sm">🇲🇦</span>
                      <span>عربي</span>
                    </button>
                  </div>
                </div>
              )}



              <div
                ref={contentRef}
                dir={isBilingualCourse && courseLang === 'ar' ? 'rtl' : 'ltr'}
                className="highlight-content"
              >
                {activeTab === 'content' && <HighlightedMarkdown content={getDisplayContent('content')} highlights={currentHighlights} colors={HIGHLIGHT_COLORS} forceLtr={isDidactiqueCourse || courseLang === 'fr'} forceRtl={isBilingualCourse && courseLang === 'ar'} />}
                {activeTab === 'examples' && <MarkdownViewer content={getDisplayContent('examples')} forceLtr={isDidactiqueCourse || courseLang === 'fr'} forceRtl={isBilingualCourse && courseLang === 'ar'} />}
                {activeTab === 'astuces' && <MarkdownViewer content={getDisplayContent('astuces')} forceLtr={isDidactiqueCourse || courseLang === 'fr'} forceRtl={isBilingualCourse && courseLang === 'ar'} />}
              </div>
            </div>
          </>
        ) : (

          <div className="space-y-6">
            {/* QCM Header */}
            <div className="glass-card p-5 rounded-2xl flex flex-col gap-4" dir={courseLang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#03594e] dark:text-[#F8C62F]" />
                    {courseLang === 'ar' ? 'أسئلة المباراة المستهدفة' : 'Questions du Concours Traitées'}
                    <span className="mx-1 px-2.5 py-0.5 rounded-full bg-[#03594e]/10 text-[#03594e] dark:bg-[#F8C62F]/15 dark:text-[#F8C62F] text-[11px] font-extrabold border border-[#03594e]/20">
                      {targetedQuestions.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {courseLang === 'ar'
                      ? 'أسئلة المباريات الرسمية لولوج المراكز الجهوية لمهن التربية والتكوين المرتبطة بهذا الدرس'
                      : 'Questions officielles des concours CRMEF liées à cette leçon — cliquez pour ouvrir'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={expandAllQcm} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer">
                    {courseLang === 'ar' ? 'فتح الكل' : 'Tout ouvrir'}
                  </button>
                  <button type="button" onClick={collapseAllQcm} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer">
                    {courseLang === 'ar' ? 'إغلاق الكل' : 'Tout fermer'}
                  </button>
                </div>
              </div>

              {/* Language filter for bilingual QCMs */}
              {isBilingualCourse && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {courseLang === 'ar' ? 'تصفية حسب اللغة :' : 'Filtrer par langue :'}
                  </span>
                  {[
                    { id: 'all', label: courseLang === 'ar' ? 'الكل' : 'Tout', flag: '🌐' },
                    { id: 'fr', label: 'Français', flag: '🇫🇷' },
                    { id: 'ar', label: 'عربي', flag: '🇲🇦' },
                  ].map(l => (
                    <button key={l.id} type="button" onClick={() => setQcmLangFilter(l.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${(qcmLangFilter === l.id || (qcmLangFilter === 'all' && courseLang === l.id))
                        ? 'bg-[#03594e] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}>
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Questions list */}
            {targetedQuestions.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl text-center" dir={courseLang === 'ar' ? 'rtl' : 'ltr'}>
                <HelpCircle className="w-10 h-10 text-[#03594e] dark:text-[#F8C62F] mx-auto mb-3 opacity-50" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {courseLang === 'ar' ? 'لا توجد أسئلة مباراة رسمية متاحة حالياً لهذا الدرس.' : 'Aucune question officielle disponible pour ce cours.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {courseLang === 'ar' ? 'سيتم إضافة الأسئلة تباعاً.' : 'Les questions seront ajoutées au fur et à mesure.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {targetedQuestions.map((q, idx) => {
                  const answer = userAnswers[q.id];
                  const isOpen = Boolean(openQcmIds[q.id]);
                  const isAr = isArabicQ(q) || courseLang === 'ar';
                  const { num } = getQuestionLabel(q, idx);
                  const arBadgeMap = { 'A': 'أ', 'B': 'ب', 'C': 'ج', 'D': 'د', 'E': 'هـ' };

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border transition-all bg-white dark:bg-slate-900 ${
                        isOpen
                          ? 'border-[#03594e]/40 shadow-sm ring-1 ring-[#03594e]/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Question Header Row */}
                      <div
                        onClick={() => toggleQcmOpen(q.id)}
                        className={`p-4 sm:p-4.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isOpen
                            ? 'bg-slate-50/90 dark:bg-slate-800/40'
                            : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                        }`}
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1" dir={isAr ? 'rtl' : 'ltr'}>
                          {/* Clean Question Number Badge */}
                          {num && (
                            <span className="shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#03594e] dark:text-[#F8C62F] border border-slate-200/80 dark:border-slate-700">
                              {num}
                            </span>
                          )}

                          {/* Question text preview */}
                          <span className={`text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex-1 min-w-0 line-clamp-2 ${
                            isAr ? 'text-right font-arabic' : 'text-left'
                          }`}>
                            {(q.question_text || '').replace(/^\[Examen\s+\d+\s*-\s*Q\d+\]\s*/i, '').replace(/^CIBLÉ_[A-Z0-9_]+\s*:?\s*/i, '')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          {/* Answer status indicator */}
                          {answer && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              answer.is_correct
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                            }`}>
                              {answer.is_correct ? '✓' : '✗'}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleBookmark(q.id)}
                            className={`flex items-center gap-1 p-1.5 rounded-lg text-xs font-medium transition-all ${
                              q.is_bookmarked
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${q.is_bookmarked ? 'fill-current' : ''}`} />
                          </button>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isOpen && (
                        <div
                          dir={isAr ? 'rtl' : 'ltr'}
                          className="p-4 sm:p-5 space-y-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20"
                        >
                          {/* Reference text button if exists */}
                          {hasReferenceText(q) && (
                            <div className={`flex ${isAr ? 'justify-start' : 'justify-end'}`}>
                              <button
                                type="button"
                                onClick={() => setSelectedRefQuestion(q)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-600" />
                                <span>{isAr ? '📄 عرض نص الانطلاق (الوثيقة المرجعية)' : '📄 Voir le texte d\'appui'}</span>
                              </button>
                            </div>
                          )}

                          {/* Simple Question Text Box */}
                          <div
                            className={`p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium leading-relaxed ${
                              isAr ? 'text-right font-arabic' : 'text-left'
                            }`}
                          >
                            <MarkdownViewer content={(q.question_text || '').replace(/^\[Examen\s+\d+\s*-\s*Q\d+\]\s*/i, '').replace(/^CIBLÉ_[A-Z0-9_]+\s*:?\s*/i, '')} />
                          </div>

                          {/* MCQ Options - Simple & Clean */}
                          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
                            {['A', 'B', 'C', 'D', 'E'].map(optKey => {
                              const rawText = q[`option_${optKey.toLowerCase()}`];
                              if (!rawText && optKey === 'E') return null;
                              const optText = rawText || (optKey === 'E' ? (isAr ? 'لا شيء مما سبق' : 'Aucune des réponses ci-dessus') : '');
                              const isChosen = answer?.chosen_option === optKey;
                              const isCorrect = answer?.is_correct && isChosen;
                              const isWrongChosen = isChosen && !answer?.is_correct;
                              const isRightNotChosen = answer && !isChosen && answer.correct_option === optKey;
                              const isFullWidth = optKey === 'E';

                              const badgeText = isAr ? (arBadgeMap[optKey] || optKey) : optKey;
                              const cleanOptText = optText.replace(/^[A-Eأبجد]\.\s*/i, '');

                              return (
                                <button
                                  key={optKey}
                                  type="button"
                                  onClick={() => handleOptionSelect(q.id, optKey)}
                                  disabled={Boolean(answer)}
                                  className={`p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                                    isAr ? 'text-right' : 'text-left'
                                  } ${isFullWidth ? 'sm:col-span-2' : ''} ${
                                    isCorrect
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs'
                                      : isWrongChosen
                                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-800 dark:text-rose-300 font-semibold shadow-xs'
                                        : isRightNotChosen
                                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-medium'
                                          : answer
                                            ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-50 cursor-not-allowed'
                                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#03594e] hover:bg-[#03594e]/5 cursor-pointer font-medium'
                                  }`}
                                >
                                  <span className="flex items-start gap-2.5" dir={isAr ? 'rtl' : 'ltr'}>
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 ${
                                      isCorrect
                                        ? 'bg-emerald-500 text-white'
                                        : isWrongChosen
                                          ? 'bg-rose-500 text-white'
                                          : isRightNotChosen
                                            ? 'bg-emerald-400 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                    }`}>
                                      {isCorrect ? '✓' : isWrongChosen ? '✗' : isRightNotChosen ? '✓' : badgeText}
                                    </span>
                                    <span className={`flex-1 leading-relaxed ${isAr ? 'font-arabic' : ''}`}>{cleanOptText}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Simple Answer Feedback */}
                          {answer && (
                            <div
                              dir={isAr ? 'rtl' : 'ltr'}
                              className={`p-4 rounded-xl border space-y-2 ${
                                answer.is_correct
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400/70 text-emerald-900 dark:text-emerald-200'
                                  : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400/70 text-rose-900 dark:text-rose-200'
                              }`}
                            >
                              <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5" dir={isAr ? 'rtl' : 'ltr'}>
                                {answer.is_correct ? (
                                  <>
                                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{isAr ? 'إجابة ممتازة وصحيحة !' : 'Excellente réponse !'}</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>
                                      {isAr
                                        ? `الإجابة غير صحيحة — الإجابة الصحيحة: الخيار ${arBadgeMap[answer.correct_option] || answer.correct_option}`
                                        : `Réponse incorrecte — Bonne réponse : Option ${answer.correct_option}`}
                                    </span>
                                  </>
                                )}
                              </div>
                              {answer.explanation && (
                                <div dir="auto" className="text-xs leading-relaxed font-normal bidi-plaintext text-slate-700 dark:text-slate-300">
                                  {answer.explanation}
                                </div>
                              )}
                              {q.astuce && (
                                <div
                                  className="mt-2 p-3 rounded-lg flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 text-xs"
                                  dir={isAr ? 'rtl' : 'ltr'}
                                >
                                  <svg className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <div>
                                    <div className="font-bold text-[#03594e] dark:text-[#F8C62F] text-[11px] mb-0.5" dir={isAr ? 'rtl' : 'ltr'}>
                                      {isAr ? 'نصيحة المباراة' : 'Astuce Concours'}
                                    </div>
                                    <div className="leading-relaxed text-slate-700 dark:text-slate-300 bidi-plaintext" dir="auto">{q.astuce}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCourseDetailView = () => {
    const domainObj = (Array.isArray(domains) ? domains : []).find(d => d.code === selectedDomainCode);
    const subdomainObj = (Array.isArray(subdomains) ? subdomains : []).find(s => s.code === selectedSubdomainCode);

    if (!selectedCourse) return null;

    return (
      <motion.div
        key="course_detail"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-1" dir={courseLang === 'ar' ? 'rtl' : 'ltr'}>
            <span onClick={() => setCurrentStep('domains')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shrink-0">{courseLang === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
            <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-40 ${courseLang === 'ar' ? 'rotate-180' : ''}`} />
            <span onClick={() => setCurrentStep('subdomains')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shrink-0">{getLocalizedDomainName(domainObj, courseLang) || 'Développement'}</span>
            <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-40 ${courseLang === 'ar' ? 'rotate-180' : ''}`} />
            <span onClick={() => setCurrentStep('courses_list')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shrink-0">{getLocalizedSubdomainName(subdomainObj, courseLang) || 'Sous-domaine'}</span>
            <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-40 ${courseLang === 'ar' ? 'rotate-180' : ''}`} />
            <span className="text-sky-600 dark:text-sky-400 font-bold truncate max-w-[200px] shrink-0">{isCLanguage && activeCourseData ? activeCourseData.title : getLocalizedCourseTitle(selectedCourse, courseLang)}</span>
          </nav>

          <button type="button" onClick={() => setCurrentStep('courses_list')} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3.5">
            <ArrowLeft className={`w-3.5 h-3.5 ${courseLang === 'ar' ? 'rotate-180' : ''}`} /> {courseLang === 'ar' ? 'العودة للدروس' : 'Retour aux cours'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800" dir={courseLang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isCLanguage ? `Leçon ${currentCLesson.num} / 50` : getLocalizedSubdomainName(subdomainObj, courseLang)}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {isCLanguage && activeCourseData ? activeCourseData.title : getLocalizedCourseTitle(selectedCourse, courseLang)}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleCourseCompleted(selectedCourse.id, selectedCourse.is_completed)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${selectedCourse.is_completed
                ? 'bg-[#03594e]/10 text-[#03594e] border border-[#03594e]/30'
                : 'bg-[#03594e] hover:bg-[#02473e] text-white'
                }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${selectedCourse.is_completed ? 'text-[#03594e]' : 'text-[#F8C62F]'}`} />
              {selectedCourse.is_completed
                ? (courseLang === 'ar' ? 'تمت دراسة الدرس ✓' : 'Leçon Validée ✓')
                : (courseLang === 'ar' ? 'إتمام الدرس' : 'Valider la leçon')}
            </button>

            {isCLanguage && (
              <>
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
              </>
            )}
          </div>
        </div>

        {isCLanguage ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-4">
              <div className="glass-card p-5 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-xl space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><Layers className="w-4 h-4 text-sky-500" /> Sommaire du Parcours</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">50 Leçons</span>
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
                              <button key={les.num} type="button" onClick={() => { setSelectedCLessonIdx(les.globalIdx); }} className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-left transition-all ${les.isActive ? 'bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-300 font-bold shadow-2xs' : 'hover:bg-slate-100 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-300'}`}>
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
              {renderCourseContentPanel()}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full">
            {renderCourseContentPanel()}
          </div>
        )}

        {/* Global Floating Notes Drawer */}
        <AnimatePresence>
          {isNoteChatbotOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-6 right-6 w-96 max-w-[92vw] z-50 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 backdrop-blur-xl shadow-2xl p-5 space-y-3"
              style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 text-amber-400 dark:bg-slate-800 shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Bloc-notes de la leçon
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyNote}
                    disabled={!notes[currentNoteKey]}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                    title="Copier les notes"
                  >
                    {copiedNote ? <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadNote}
                    disabled={!notes[currentNoteKey]}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                    title="Exporter (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNoteChatbotOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-500 transition-colors cursor-pointer"
                    title="Fermer le bloc-notes"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={notes[currentNoteKey] || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Écrivez vos remarques, définitions ou points clés sur ce cours ici..."
                  rows={8}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-700 resize-y placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Floating AI Assistant Drawer */}
        <AnimatePresence>
          {isVideoAiOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-6 right-6 w-96 max-w-[92vw] h-[480px] z-50 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
              style={{ boxShadow: '0 20px 50px rgba(3, 89, 78, 0.25)' }}
            >
              {/* AI Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#03594e] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 text-[#F8C62F] border border-white/20 shadow-sm">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      Assistant IA Cours
                    </h4>
                    <p className="text-[10px] text-teal-100/90 font-medium">Posez toutes vos questions sur le cours</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVideoAiOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* AI Message List */}
              <div ref={aiChatRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 dark:bg-slate-900/40 text-xs">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-[#03594e]/10 border border-[#03594e]/20 text-[#03594e] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] p-3 rounded-2xl ${msg.sender === 'user'
                        ? 'bg-[#03594e] text-white rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-none shadow-sm'
                        }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <div className="flex gap-2 items-center text-[#03594e] dark:text-emerald-400 font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#03594e]/10 border border-[#03594e]/20 text-[#03594e] dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <span className="text-[11px] animate-pulse">L'assistant IA réfléchit...</span>
                  </div>
                )}
              </div>

              {/* Quick suggestion chips */}
              <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar text-[10px]">
                <button
                  type="button"
                  onClick={() => handleSendVideoAiQuestion("Résume-moi les points clés de cette leçon")}
                  className="px-2.5 py-1 rounded-full bg-[#03594e]/10 hover:bg-[#03594e]/20 text-[#03594e] dark:text-emerald-300 font-semibold border border-[#03594e]/20 whitespace-nowrap cursor-pointer transition-colors"
                >
                  💡 Résumé cours
                </button>
                <button
                  type="button"
                  onClick={() => handleSendVideoAiQuestion("Explique-moi la notion principale de ce chapitre")}
                  className="px-2.5 py-1 rounded-full bg-[#03594e]/10 hover:bg-[#03594e]/20 text-[#03594e] dark:text-emerald-300 font-semibold border border-[#03594e]/20 whitespace-nowrap cursor-pointer transition-colors"
                >
                  🌐 Notion principale
                </button>
              </div>

              {/* AI Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendVideoAiQuestion();
                }}
                className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Posez votre question sur le cours..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#03594e]/50 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || aiLoading}
                  className="p-2 rounded-xl bg-[#03594e] hover:bg-[#02453d] text-[#F8C62F] disabled:opacity-40 cursor-pointer shadow-md transition-all"
                  title="Envoyer la question"
                >
                  <Send className="w-4 h-4 text-[#F8C62F]" />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setIsVideoAiOpen(true)}
              className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-[#03594e] hover:bg-[#02453d] text-white shadow-xl border border-white/20 flex items-center gap-2.5 cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ boxShadow: '0 12px 35px rgba(3, 89, 78, 0.4)' }}
            >
              <Sparkles className="w-4 h-4 text-[#F8C62F] animate-pulse" />
              <span className="text-xs font-extrabold tracking-wide text-white">Assistant IA</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des cours & fiches académiques..." />;
  }

  return (
    <div className="space-y-8 py-4 text-slate-900 dark:text-slate-100 font-sans">
      <AnimatePresence mode="wait">
        {currentStep === 'domains' && renderDomainsView()}
        {currentStep === 'subdomains' && renderSubdomainsView()}
        {currentStep === 'courses_list' && renderCoursesListView()}
        {currentStep === 'course_detail' && renderCourseDetailView()}
      </AnimatePresence>
      <ReferenceTextModal
        isOpen={Boolean(selectedRefQuestion)}
        onClose={() => setSelectedRefQuestion(null)}
        question={selectedRefQuestion}
      />
    </div>
  );
};

export default Courses;
