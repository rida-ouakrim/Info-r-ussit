import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import { 
  BookOpen, CheckCircle2, Circle, Sparkles, Search, 
  HelpCircle, Code2, AlertTriangle, RefreshCw, Clock, 
  ChevronRight, Award, Zap, Bookmark, ChevronDown, ChevronUp, Star,
  Video, Play
} from 'lucide-react';

const Courses = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomainCode, setSelectedDomainCode] = useState('');
  const [subdomains, setSubdomains] = useState([]);
  const [selectedSubdomainCode, setSelectedSubdomainCode] = useState('');
  
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'examples', 'astuces', 'qcm'

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subQuestions, setSubQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [openQcmIds, setOpenQcmIds] = useState({}); // Stores which QCM cards are expanded

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
    fetchDomains();
    fetchStats();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await API.get('domains/');
      const domList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setDomains(domList);
      if (domList.length > 0) {
        setSelectedDomainCode(domList[0].code);
        const subList = Array.isArray(domList[0].subdomains) ? domList[0].subdomains : [];
        setSubdomains(subList);
        if (subList.length > 0) {
          setSelectedSubdomainCode(subList[0].code);
          fetchCourses(subList[0].code);
        }
      }
    } catch (err) {
      console.error("fetchDomains error:", err);
      setDomains([]);
      setSubdomains([]);
    } finally {
      setLoading(false);
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
      if (subList.length > 0) {
        setSelectedSubdomainCode(subList[0].code);
        fetchCourses(subList[0].code);
      }
    }
  };

  const handleSubdomainChange = (code) => {
    setSelectedSubdomainCode(code);
    fetchCourses(code);
  };

  const fetchCourses = async (subCode) => {
    try {
      const res = await API.get(`courses/?subdomain=${subCode}`);
      const courseList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setCourses(courseList);
      if (courseList.length > 0) {
        fetchCourseDetail(courseList[0].id);
      } else {
        setSelectedCourse(null);
      }
      fetchSubQuestions(subCode);
    } catch (err) {
      console.error("fetchCourses error:", err);
      setCourses([]);
    }
  };

  const filterQuestionsForCourse = (questions, course) => {
    if (!Array.isArray(questions) || !course) return [];
    const title = (course.title || '').toLowerCase();

    let keywords = [];
    if (title.includes('01.') || title.includes('introduction')) {
      keywords = ['algorithme', 'pseudo-code', 'définition', 'instruction', 'entrée', 'finitude', 'déterminisme', 'organigramme'];
    } else if (title.includes('02.') || title.includes('variable')) {
      keywords = ['variable', 'type', 'entier', 'réel', 'booléen', 'constante', 'mémoire', 'affectation'];
    } else if (title.includes('03.') || title.includes('opérateur')) {
      keywords = ['opérateur', 'div', 'mod', 'lire', 'écrire', 'expression', 'logique', 'priorité'];
    } else if (title.includes('04.') || title.includes('condition')) {
      keywords = ['si', 'sinon', 'alors', 'finsi', 'selon', 'cas', 'branchement', 'condition'];
    } else if (title.includes('05.') || title.includes('boucle')) {
      keywords = ['boucle', 'tantque', 'tant que', 'pour', 'répéter', 'jusqu', 'itératif', 'compteur'];
    } else if (title.includes('06.') || title.includes('tableau')) {
      keywords = ['tableau', 'vecteur', 'matrice', 'indice', 'dimension', 'élément'];
    } else if (title.includes('07.') || title.includes('chaîne') || title.includes('chaine')) {
      keywords = ['chaîne', 'chaine', 'caractère', 'caractere', 'longueur', 'concaténation', 'sous-chaîne', 'string'];
    } else if (title.includes('08.') || title.includes('procédure') || title.includes('fonction')) {
      keywords = ['fonction', 'procédure', 'procedure', 'paramètre', 'valeur', 'référence', 'var', 'retour'];
    } else if (title.includes('09.') || title.includes('complexité')) {
      keywords = ['complexité', 'grand o', 'o(1)', 'o(n)', 'o(n^2)', 'o(log n)', 'temporelle', 'notations'];
    } else if (title.includes('10.') || title.includes('structure de donnée') || title.includes('pile')) {
      keywords = ['pile', 'file', 'lifo', 'fifo', 'empiler', 'dépiler', 'enfiler', 'défiler', 'liste chaînée', 'pointeur'];
    } else if (title.includes('11.') || title.includes('tri') || title.includes('recherche')) {
      keywords = ['tri', 'bulle', 'sélection', 'selection', 'insertion', 'quicksort', 'mergesort', 'dichotomie', 'dichotomique', 'pivot'];
    } else if (title.includes('12.') || title.includes('récursivité') || title.includes('diviser')) {
      keywords = ['récursivité', 'recursivite', 'récursif', 'cas de base', 'pile d\'appel', 'diviser pour régner', 'hanoi', 'fibonacci'];
    } else if (title.includes('13.') || title.includes('arbre')) {
      keywords = ['arbre', 'abr', 'binaire', 'infixe', 'préfixe', 'postfixe', 'racine', 'feuille', 'hauteur'];
    } else if (title.includes('14.') || title.includes('graphe')) {
      keywords = ['graphe', 'dfs', 'bfs', 'profondeur', 'largeur', 'adjacence', 'sommet', 'dijkstra', 'arête', 'arc'];
    }

    if (keywords.length === 0) return questions.slice(0, 10);

    const filtered = questions.filter(q => {
      const text = ((q.question_text || '') + ' ' + (q.explanation || '') + ' ' + (q.astuce || '')).toLowerCase();
      return keywords.some(kw => text.includes(kw));
    });

    return filtered.length > 0 ? filtered : questions.slice(0, 10);
  };

  const targetedQuestions = filterQuestionsForCourse(subQuestions, selectedCourse);

  const fetchCourseDetail = async (id) => {
    try {
      const res = await API.get(`courses/${id}/`);
      setSelectedCourse(res.data);
      if (!res.data?.video_url && activeTab === 'video') {
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

  const toggleCourseCompleted = async (id, currentVal) => {
    try {
      const res = await API.post(`courses/${id}/toggle-completed/`, { is_completed: !currentVal });
      setSelectedCourse(prev => prev ? { ...prev, is_completed: res.data.is_completed } : null);
      setCourses(prev => (Array.isArray(prev) ? prev : []).map(c => c.id === id ? { ...c, is_completed: res.data.is_completed } : c));
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

  const filteredCourses = (Array.isArray(courses) ? courses : []).filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-sky-500 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement des Fiches de Cours...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Coursera Header Banner */}
      <div className="glass-card p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-blue-500/10 dark:from-sky-950/70 dark:via-slate-900 dark:to-indigo-950/70 border border-sky-500/20 dark:border-sky-500/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-400 text-[10px] sm:text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            Académie Nationale de Révision • Programme Officiel 2026
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Fiches de Cours & Parcours d'Apprentissage</h1>
          <p className="hidden sm:block text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Consultez les modules théoriques, les algorithmes pratiques et les QCM ciblés avec option de favoris.
          </p>
        </div>

        {stats && (
          <div className="z-10 flex items-center justify-between sm:justify-start gap-5 bg-white/90 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shrink-0">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Progression Globale</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{stats.completed} <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">/ {stats.total} modules</span></div>
              <div className="text-[10px] sm:text-xs text-sky-600 dark:text-sky-400 font-bold mt-0.5">{stats.percentage}% maîtrisés</div>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center font-extrabold text-xs sm:text-sm text-sky-600 dark:text-sky-300">
                {stats.percentage}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Domain Tabs Navigation */}
      <div 
        className="flex overflow-x-auto no-scrollbar flex-nowrap lg:flex-wrap gap-2 pb-2 lg:pb-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {(Array.isArray(domains) ? domains : []).map((dom) => {
          const isSelected = selectedDomainCode === dom.code;
          return (
            <button
              key={dom.code}
              onClick={() => handleDomainChange(dom.code)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/25 scale-[1.02]'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{dom.name}</span>
            </button>
          );
        })}
      </div>

      {/* Subdomain Filter Chips */}
      <div 
        className="flex overflow-x-auto no-scrollbar flex-nowrap items-center gap-2 bg-slate-100/80 dark:bg-slate-950/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800/80 pb-2 lg:flex-wrap"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-3 shrink-0">Sous-domaines :</span>
        {(Array.isArray(subdomains) ? subdomains : []).map(sd => {
          const isSel = selectedSubdomainCode === sd.code;
          return (
            <button
              key={sd.code}
              onClick={() => handleSubdomainChange(sd.code)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                isSel
                  ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              {sd.name}
            </button>
          );
        })}
      </div>

      {/* Main Coursera 2-Column Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Coursera Module Index Drawer */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Modules de Cours</span>
              <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                {filteredCourses.length} cours
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un module..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Course Module Items */}
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredCourses.length === 0 ? (
                <div className="text-xs text-slate-500 p-4 text-center">Aucun module trouvé.</div>
              ) : (
                filteredCourses.map((c, idx) => {
                  const isSel = selectedCourse?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => fetchCourseDetail(c.id)}
                      className={`w-full flex items-start justify-between p-3.5 rounded-2xl text-xs font-medium text-left transition-all ${
                        isSel 
                          ? 'bg-sky-500/15 border border-sky-500/40 text-slate-900 dark:text-white font-bold shadow-md' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 pr-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${isSel ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {idx + 1}
                        </span>
                        <span className="line-clamp-2 leading-relaxed flex items-center gap-1.5">
                          {c.title}
                          {c.video_url && (
                            <Video className="w-3.5 h-3.5 text-red-500 shrink-0 inline" title="Vidéo explicative disponible" />
                          )}
                        </span>
                      </div>
                      {c.is_completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Coursera Lesson Viewer */}
        <div className="lg:col-span-3 space-y-6">
          {selectedCourse ? (
            <div className="space-y-6">
              
              {/* Course Title Header Card */}
              <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-50 dark:from-slate-900 dark:via-sky-950/30 dark:to-slate-900 border border-slate-200 dark:border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold uppercase tracking-wider">
                      {selectedCourse.subdomain_name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 10 min de lecture
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {selectedCourse.title}
                  </h2>
                </div>

                <button
                  onClick={() => toggleCourseCompleted(selectedCourse.id, selectedCourse.is_completed)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all shrink-0 ${
                    selectedCourse.is_completed
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {selectedCourse.is_completed ? 'Terminé (Maîtrisé)' : 'Marquer comme Terminé'}
                </button>
              </div>

              {/* Coursera Lesson Navigation Tabs */}
              <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'content' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Fiche de Révision
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'video' ? 'border-red-500 text-red-600 dark:text-red-400 font-extrabold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-red-500" /> Vidéo Explicative
                  {selectedCourse.video_url && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'examples' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4" /> Exemples & Pratique
                </button>
                <button
                  onClick={() => setActiveTab('astuces')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'astuces' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Astuces & Pièges
                </button>
                <button
                  onClick={() => setActiveTab('qcm')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'qcm' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-purple-500 dark:text-purple-400" /> QCM Ciblés ({targetedQuestions.length})
                </button>
              </div>

              {/* Coursera Lesson Content / Video Box */}
              {activeTab === 'video' ? (
                <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leçon Vidéo • {selectedCourse.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Support vidéo du cours et explication pas à pas (Style Coursera)</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Mohamed Chiny & Académie Info
                    </span>
                  </div>

                  {selectedCourse.video_url ? (
                    selectedCourse.video_url.includes('drive.google.com') ? (
                      <div className="space-y-4">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
                          <iframe
                            src={selectedCourse.video_url.replace(/\/view(\?.*)?$/, '/preview')}
                            title={selectedCourse.title}
                            className="w-full h-full border-0"
                            allow="autoplay"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            ☁️ <strong>Vidéo HD Google Drive :</strong> Streaming direct et sécurisé sans aucune publicité.
                          </span>
                          <a
                            href={selectedCourse.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 dark:text-sky-400 font-bold hover:underline shrink-0"
                          >
                            Ouvrir dans Google Drive ↗
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
                          <iframe
                            src={getEmbedUrl(selectedCourse.video_url)}
                            title={selectedCourse.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            💡 <strong>Conseil pédagogique :</strong> Regardez la vidéo puis passez aux exercices pratiques et QCM.
                          </span>
                          <a
                            href={selectedCourse.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 dark:text-sky-400 font-bold hover:underline shrink-0"
                          >
                            Ouvrir la vidéo ↗
                          </a>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="p-12 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                      <Video className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Aucune vidéo associée à ce module</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Consultez la fiche de révision théorique et les exemples de code pour préparer votre examen.
                      </p>
                    </div>
                  )}
                </div>
              ) : activeTab !== 'qcm' ? (
                <div className="glass-card p-8 rounded-3xl border-slate-200 dark:border-slate-800/90 shadow-2xl min-h-[400px]">
                  {activeTab === 'content' && <MarkdownViewer content={selectedCourse.content} />}
                  {activeTab === 'examples' && <MarkdownViewer content={selectedCourse.examples} />}
                  {activeTab === 'astuces' && <MarkdownViewer content={selectedCourse.astuces} />}
                </div>
              ) : (
                /* Tab 4: Accordion QCM List (Collapsed by Default) */
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" /> QCM Ciblés du Module ({targetedQuestions.length})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Chaque question est fermée par défaut. Cliquez sur une question pour l'ouvrir, répondre et voir la correction.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={expandAllQcm}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                      >
                        Tout ouvrir
                      </button>
                      <button
                        type="button"
                        onClick={collapseAllQcm}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                      >
                        Tout fermer
                      </button>
                    </div>
                  </div>

                  {targetedQuestions.length === 0 ? (
                    <div className="glass-card p-12 rounded-3xl text-center text-slate-500 dark:text-slate-400 text-sm">
                      Aucun QCM ciblé disponible pour ce module.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {targetedQuestions.map((q, idx) => {
                        const answer = userAnswers[q.id];
                        const isOpen = Boolean(openQcmIds[q.id]);

                        return (
                          <div key={q.id} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm transition-all">
                            
                            {/* Question Card Accordion Header */}
                            <div 
                              onClick={() => toggleQcmOpen(q.id)}
                              className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
                                  Q{idx + 1} • {q.exam_year}
                                </span>

                                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {q.question_number} — <span className="font-normal text-slate-500 dark:text-slate-400">{q.question_text.slice(0, 65)}...</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                {/* ⭐ OPTION DE FAVORISER */}
                                <button
                                  onClick={() => toggleBookmark(q.id)}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    q.is_bookmarked
                                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                  title={q.is_bookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
                                >
                                  <Star className={`w-3.5 h-3.5 ${q.is_bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                                  <span className="hidden sm:inline">{q.is_bookmarked ? 'Favoris' : '⭐'}</span>
                                </button>

                                {/* Toggle Expand Icon Button */}
                                <button
                                  onClick={() => toggleQcmOpen(q.id)}
                                  className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-500 hover:text-white transition-colors"
                                >
                                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Question Body (Only shown when isOpen === true) */}
                            {isOpen && (
                              <div className="p-6 pt-3 space-y-4 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/20">
                                
                                {/* Formatted Question Text & Code Snippets */}
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm border border-slate-200 dark:border-slate-800/80 leading-relaxed">
                                  <MarkdownViewer content={q.question_text} />
                                </div>

                                {/* MCQ Options (A, B, C, D, E) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {(() => {
                                    const availableKeys = ['A', 'B', 'C', 'D', 'E'];
                                    return availableKeys.map(optKey => {
                                      const rawText = q[`option_${optKey.toLowerCase()}`];
                                      const optText = rawText || (optKey === 'E' ? 'Aucune des réponses ci-dessus' : '');
                                      const isChosen = answer?.chosen_option === optKey;
                                      const isCorrect = answer?.is_correct && isChosen;
                                      const isFullWidth = optKey === 'E' && availableKeys.length % 2 !== 0;

                                      return (
                                        <button
                                          key={optKey}
                                          onClick={() => handleOptionSelect(q.id, optKey)}
                                          className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                                            isFullWidth ? 'sm:col-span-2' : ''
                                          } ${
                                            isChosen
                                              ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-300 font-bold')
                                              : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                          }`}
                                        >
                                          <strong className="text-sky-600 dark:text-sky-400 mr-2">{optKey})</strong> {optText}
                                        </button>
                                      );
                                    });
                                  })()}
                                </div>

                                {/* Detailed Explanation */}
                                {answer && (
                                  <div className={`p-4 rounded-xl text-xs space-y-2 ${answer.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'}`}>
                                    <div className="font-bold">
                                      {answer.is_correct ? '✔️ Correct !' : `❌ Incorrect. Bonne réponse : ${answer.correct_option}`}
                                    </div>
                                    <div className="leading-relaxed">{answer.explanation}</div>
                                    {q.astuce && (
                                      <div className="mt-2 text-sky-600 dark:text-sky-300 font-medium">⚡ <strong>Astuce Concours :</strong> {q.astuce}</div>
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
          ) : (
            <div className="glass-card p-12 rounded-3xl text-center text-slate-500 dark:text-slate-400 text-sm">
              Sélectionnez un module de cours dans le menu de gauche pour commencer la lecture.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Courses;
