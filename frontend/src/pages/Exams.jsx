import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import MarkdownViewer from '../components/MarkdownViewer';
import ReferenceTextModal, { hasReferenceText } from '../components/ReferenceTextModal';
import ArabicKeyboard from '../components/ArabicKeyboard';
import {
  FileText, Play, SkipForward, ChevronLeft, ChevronRight,
  Pause, Star, CheckCircle2, AlertCircle, RefreshCw, Trophy,
  Save, History, Trash2, Clock, Check, Eye, Bot, Sparkles, Send, X, MessageSquare,
  GraduationCap, Building2, BookOpen, Book, Code2, Brain, Languages, Keyboard,
  Highlighter, Eraser
} from 'lucide-react';

const Exams = () => {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_staff || user?.is_superuser);
  const [adminCategoryView, setAdminCategoryView] = useState('CRMEF'); // 'CRMEF' or 'CONCOURS_ETAT'

  const isStateConcours = isAdmin
    ? adminCategoryView === 'CONCOURS_ETAT'
    : Boolean(user?.target_exam && !user.target_exam.toLowerCase().includes('crmef'));

  const [availableYears] = useState([2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]);
  const [selectedYear, setSelectedYear] = useState(isStateConcours ? 2001 : 2025);
  const [mode, setMode] = useState('Entraînement');
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'saved'

  const [selectedDomainFilter, setSelectedDomainFilter] = useState('SPECIALITE'); // 'SPECIALITE', 'DIDACTIQUE', 'SCIENCES_EDU'
  const [selectedLangFilter, setSelectedLangFilter] = useState('ALL'); // 'ALL', 'fr', 'ar' - for bilingual exams

  const YEAR_MAP = {
    SPECIALITE: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018],
    DIDACTIQUE: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018],
    SCIENCES_EDU: [2025, 2024, 2023, 2022]
  };

  const activeYears = YEAR_MAP[selectedDomainFilter] || [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  useEffect(() => {
    if (!isStateConcours && selectedDomainFilter && !activeYears.includes(selectedYear)) {
      setSelectedYear(activeYears[0] || 2025);
    }
  }, [selectedDomainFilter, activeYears, selectedYear, isStateConcours]);

  // Interactive Question AI Chatbot state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState(null);
  const [chatAttempt, setChatAttempt] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showArabicKeyboard, setShowArabicKeyboard] = useState(false);

  // Interactive Course Revision Modal state (Mode Entraînement)
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseModalTab, setCourseModalTab] = useState('content'); // 'content', 'examples', 'astuces', 'video'
  const [courseModalLang, setCourseModalLang] = useState('fr');
  const [showTextModal, setShowTextModal] = useState(false);

  // Active Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState({}); // question_id -> { choice, is_correct, details }
  const [quizScore, setQuizScore] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Highlights state & selection handlers inside lesson modal
  const userKey = user?.id ? `u_${user.id}` : (user?.email ? `u_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'u_guest');
  const [highlightsMap, setHighlightsMap] = useState({});
  const [highlightToolbar, setHighlightToolbar] = useState(null); // { x, y, text, lineIdx }
  const modalContentRef = useRef(null);

  const HIGHLIGHT_COLORS = [
    { id: 'yellow', label: 'Jaune',  bg: '#fef08a', text: '#78350f' },
    { id: 'green',  label: 'Vert',   bg: '#bbf7d0', text: '#14532d' },
    { id: 'blue',   label: 'Bleu',   bg: '#bae6fd', text: '#0c4a6e' },
    { id: 'pink',   label: 'Rose',   bg: '#fbcfe8', text: '#831843' },
    { id: 'orange', label: 'Orange', bg: '#fed7aa', text: '#7c2d12' },
  ];

  useEffect(() => {
    try {
      const savedHl = localStorage.getItem(`course_highlights_${userKey}`);
      setHighlightsMap(savedHl ? JSON.parse(savedHl) : {});
    } catch (e) { setHighlightsMap({}); }
  }, [userKey]);

  const saveHighlights = useCallback((key, list) => {
    setHighlightsMap(prev => {
      const updated = { ...prev, [key]: list };
      try { localStorage.setItem(`course_highlights_${userKey}`, JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  }, [userKey]);

  const currentQ = questions[currentIndex] || null;

  const currentHighlightKey = useMemo(() => {
    if (!currentQ) return '';
    const courseId = currentQ.course_id || currentQ.course;
    if (courseId) return `${userKey}_hl_course_${courseId}`;
    if (currentQ.subdomain_code) return `${userKey}_hl_sub_${currentQ.subdomain_code}`;
    return `${userKey}_hl_q_${currentQ.id}`;
  }, [currentQ, userKey]);

  const currentHighlights = useMemo(() => {
    return highlightsMap[currentHighlightKey] || [];
  }, [highlightsMap, currentHighlightKey]);

  const handleTextSelection = useCallback(() => {
    if (!courseModalOpen) { setHighlightToolbar(null); return; }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) { setHighlightToolbar(null); return; }
    const rawText = selection.toString();
    const text = rawText.replace(/\s+/g, ' ').trim();
    if (!text || text.length < 2) { setHighlightToolbar(null); return; }

    const container = modalContentRef.current;
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
  }, [courseModalOpen]);

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
    const { lineIdx, text } = highlightToolbar;
    const normT = normalizeForMatch(text);

    const filtered = currentHighlights.filter(h => {
      if (lineIdx != null && h.lineIdx != null && h.lineIdx === lineIdx) {
        return false;
      }
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
      if (lineIdx != null && h.lineIdx != null && h.lineIdx === lineIdx) {
        return false;
      }
      const normH = normalizeForMatch(h.text);
      if (normH && normT && (normH === normT || normH.includes(normT) || normT.includes(normH))) {
        return false;
      }
      return true;
    });

    const newEntry = { id: Date.now(), lineIdx, text, colorId };
    saveHighlights(currentHighlightKey, [...filtered, newEntry]);
    setHighlightToolbar(null);
    window.getSelection()?.removeAllRanges();
  }, [highlightToolbar, currentHighlightKey, currentHighlights, saveHighlights]);

  const [history, setHistory] = useState([]);
  const [savedSession, setSavedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchHistory();
    checkSavedSession(selectedYear);
  }, [selectedYear]);

  const fetchHistory = async () => {
    try {
      const res = await API.get('exams/history/');
      setHistory(res.data || []);
    } catch (err) {
      console.error('Erreur chargement historique:', err);
    }
  };

  const checkSavedSession = async (year) => {
    try {
      const res = await API.get(`exams/session/${year}/`);
      if (res.data && !res.data.exam_submitted) {
        setSavedSession(res.data);
      } else {
        setSavedSession(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startExam = async (resume = false, sessionToResume = null) => {
    setLoading(true);
    try {
      const targetSession = sessionToResume || (resume ? savedSession : null);
      const targetYear = targetSession ? targetSession.exam_year : selectedYear;

      let queryUrl = `questions/?year=${targetYear}&source_type=past_exam`;
      if (selectedDomainFilter !== 'ALL') {
        queryUrl += `&domain=${selectedDomainFilter}`;
      }

      const res = await API.get(queryUrl);
      // Filter by language if Sciences Edu selected and language filter active
      const rawQuestions = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      let filteredQuestions = rawQuestions;
      if (selectedDomainFilter === 'SCIENCES_EDU') {
        if (selectedLangFilter === 'fr') {
          const frQuestions = rawQuestions.filter(q => {
            const text = (q.question_text || '') + ' ' + (q.option_a || '') + ' ' + (q.option_b || '');
            const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
            return arabicCharCount <= 5;
          });
          if (frQuestions.length > 0) {
            filteredQuestions = frQuestions;
          }
        } else {
          const arabicQuestions = rawQuestions.filter(q => {
            const text = (q.question_text || '') + ' ' + (q.option_a || '') + ' ' + (q.option_b || '');
            const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
            return arabicCharCount > 5;
          });
          if (arabicQuestions.length > 0) {
            filteredQuestions = arabicQuestions;
          }
        }
      } else if (selectedLangFilter !== 'ALL') {
        filteredQuestions = rawQuestions.filter(q => {
          const text = (q.question_text || '') + ' ' + (q.option_a || '') + ' ' + (q.option_b || '');
          const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
          const latinWordCount = (text.match(/\b[a-zA-Z]{4,}\b/g) || []).length;
          const isMainlyArabic = arabicCharCount > 20 || (arabicCharCount > 5 && latinWordCount < 5);
          if (selectedLangFilter === 'ar') return isMainlyArabic;
          if (selectedLangFilter === 'fr') return !isMainlyArabic;
          return true;
        });
      }

      if (filteredQuestions.length === 0) {
        alert(`Aucune question disponible pour l'année ${targetYear} avec ce filtre.`);
        setLoading(false);
        return;
      }

      // Deduplicate questions by question_number & question_text
      const uniqueList = [];
      const seenKey = new Set();
      for (const q of filteredQuestions) {
        const key = `${q.question_number || ''}_${(q.question_text || '').trim().slice(0, 30)}`;
        if (!seenKey.has(key)) {
          seenKey.add(key);
          uniqueList.push(q);
        }
      }
      filteredQuestions = uniqueList;

      // Natural numerical sort by question_number (Q61, Q62... Q120)
      filteredQuestions.sort((a, b) => {
        const numA = parseInt((a.question_number || '').replace(/\D/g, ''), 10) || 0;
        const numB = parseInt((b.question_number || '').replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });

      setQuestions(filteredQuestions);

      if (targetSession) {
        setSelectedYear(targetSession.exam_year);
        setCurrentSessionId(targetSession.id);
        setCurrentIndex(targetSession.current_index || 0);
        setQuizAttempts(targetSession.quiz_attempts_json || {});
        setQuizScore(targetSession.quiz_score || 0);
        setMode(targetSession.quiz_mode || 'Entraînement');
        setExamSubmitted(Boolean(targetSession.exam_submitted));
      } else {
        setCurrentSessionId(null);
        setCurrentIndex(0);
        setQuizAttempts({});
        setQuizScore(0);
        setExamSubmitted(false);
      }

      setQuizActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (index, attempts, score, submitted = false) => {
    try {
      const res = await API.post(`exams/session/${selectedYear}/`, {
        session_id: currentSessionId,
        current_index: index,
        quiz_attempts_json: attempts,
        quiz_score: score,
        total_questions: questions.length,
        exam_submitted: submitted,
        quiz_mode: mode
      });
      if (res.data && res.data.id) {
        setCurrentSessionId(res.data.id);
      }
      fetchHistory();
      return res.data;
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    }
  };

  const handleManualSave = async () => {
    await saveSession(currentIndex, quizAttempts, quizScore, examSubmitted);
    setSaveSuccessMessage('💾 Test enregistré dans votre historique avec succès !');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const handleOptionSelect = async (questionId, option) => {
    if (quizAttempts[questionId]) return; // déjà répondu

    try {
      const res = await API.post(`questions/${questionId}/attempt/`, { chosen_option: option });
      const isCorrect = res.data.is_correct;

      const newAttempts = {
        ...quizAttempts,
        [questionId]: { choice: option, is_correct: isCorrect, details: res.data }
      };

      const newScore = isCorrect ? quizScore + 1 : quizScore;

      setQuizAttempts(newAttempts);
      setQuizScore(newScore);

      saveSession(currentIndex, newAttempts, newScore, examSubmitted);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePause = async () => {
    await saveSession(currentIndex, quizAttempts, quizScore, false);
    setQuizActive(false);
    fetchHistory();
    checkSavedSession(selectedYear);
  };

  const handleDeleteHistorySession = (sessionId, e) => {
    e.stopPropagation();
    setDeleteConfirmId(sessionId);
  };

  const confirmDeleteSession = async (sessionId) => {
    try {
      await API.delete(`exams/session/detail/${sessionId}/`);
      fetchHistory();
      checkSavedSession(selectedYear);
      showToast("Test supprimé de l'historique avec succès !");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBookmark = async (questionId) => {
    try {
      const res = await API.post(`bookmarks/${questionId}/toggle/`);
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, is_bookmarked: res.data.is_bookmarked } : q));
    } catch (err) {
      console.error(err);
    }
  };

  const handleJump = (newIdx) => {
    setCurrentIndex(newIdx);
    saveSession(newIdx, quizAttempts, quizScore, examSubmitted);
  };

  const handleSubmitExam = async () => {
    setExamSubmitted(true);
    await saveSession(currentIndex, quizAttempts, quizScore, true);
  };

  const openQuestionAiChat = (q, attempt) => {
    setChatQuestion(q);
    setChatAttempt(attempt);
    setChatModalOpen(true);
    setChatMessages([
      {
        role: 'assistant',
        content: `Bonjour ! Je suis votre Tuteur Pédagogique IA. Avez-vous des questions ou des hésitations sur la question **${q.question_number || ''}**, la réponse choisie (**Option ${attempt?.choice || 'aucune'}**) ou la solution officielle (**Option ${q.correct_option}**) ?`
      }
    ]);
  };

  const handleSendChatMessage = async (presetText = null) => {
    const messageToSend = presetText || chatInput.trim();
    if (!messageToSend || chatLoading || !chatQuestion) return;

    const userMsg = { role: 'user', content: messageToSend };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await API.post('ai/ask-question/', {
        question_text: chatQuestion.question_text,
        option_a: chatQuestion.option_a,
        option_b: chatQuestion.option_b,
        option_c: chatQuestion.option_c,
        option_d: chatQuestion.option_d,
        correct_option: chatQuestion.correct_option,
        chosen_option: chatAttempt?.choice || '',
        explanation: chatQuestion.explanation || '',
        user_message: messageToSend,
        chat_history: updatedMessages
      });

      const aiMsg = { role: 'assistant', content: res.data.reply };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "⚠️ Une erreur est survenue lors de la communication avec l'Assistant IA. Veuillez réessayer."
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- HOME / SELECTION SCREEN ---
  if (!quizActive) {
    return (
      <div className="max-w-5xl mx-auto py-2 space-y-4">
        {/* Admin Domain Switcher Bar */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Basculer le Domaine (Vue Admin) :</span>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <button
                type="button"
                onClick={() => { setAdminCategoryView('CRMEF'); setSelectedYear(2025); setSelectedDomainFilter('SPECIALITE'); }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminCategoryView === 'CRMEF'
                  ? 'bg-[#03594e] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
              >
                <GraduationCap className="w-4 h-4 text-[#F8C62F]" /> Concours Enseignement CRMEF
              </button>

              <button
                type="button"
                onClick={() => { setAdminCategoryView('CONCOURS_ETAT'); setSelectedYear(2001); setSelectedDomainFilter('ALL'); }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminCategoryView === 'CONCOURS_ETAT'
                  ? 'bg-[#03594e] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
              >
                <Building2 className="w-4 h-4 text-[#F8C62F]" /> Concours de l'État (IT, Data & IA)
              </button>
            </div>
          </div>
        )}

        {/* Compact Combined Header & Tabs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#03594e] dark:text-[#F8C62F]" />
              {isStateConcours ? "Examens Blancs Ciblés (50 QCMs)" : "Annales : Examens Réels (2018-2025)"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isStateConcours
                ? "Sélectionnez un examen blanc parmi les 6 sujets de 50 questions à choix multiples."
                : "Entraînez-vous sur les vrais sujets de concours. Sessions sauvegardées automatiquement."}
            </p>
          </div>

          {/* Right: Tab Navigation + Pause Action Pill */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('new')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === 'new'
                    ? 'bg-[#03594e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Play className="w-3.5 h-3.5 text-[#F8C62F]" /> Démarrer un Examen
              </button>

              <button
                onClick={() => { setActiveTab('saved'); fetchHistory(); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === 'saved'
                    ? 'bg-[#03594e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <History className="w-3.5 h-3.5 text-[#F8C62F]" /> Mes Tests ({history.length})
              </button>
            </div>

            {/* Reprendre Session en Pause Pill */}
            {savedSession && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startExam(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#F8C62F] hover:bg-[#e0b227] text-[#1B1D21] shadow-md transition-all cursor-pointer"
                  title={`Reprendre Q${savedSession.current_index + 1}`}
                >
                  <Pause className="w-3.5 h-3.5 text-[#03594e]" />
                  Reprendre (Q{savedSession.current_index + 1})
                </button>

                <button
                  onClick={() => startExam(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all cursor-pointer"
                  title="Ignorer la pause et recommencer à zéro"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: NEW EXAM SETUP */}
        {activeTab === 'new' && (
          <div className="space-y-4">

            {isStateConcours ? (
              /* STATE CONCOURS 6 TARGETED EXAMS GRID */
              <div className="p-8 rounded-3xl space-y-6 bg-white border border-[#d4ede9]" style={{ boxShadow: '0 8px 30px rgba(3,89,78,0.06)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#1a2e2a] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#03594e]" /> Choisissez votre Examen Blanc (50 QCMs)
                  </h3>
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-[#f0f9f8] border border-[#d4ede9]">
                    <button
                      type="button"
                      onClick={() => setMode('Entraînement')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={mode === 'Entraînement' ? { background: '#03594e', color: '#ffffff' } : { color: '#6b8c87' }}
                    >
                      Entraînement
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('Examen')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={mode === 'Examen' ? { background: '#03594e', color: '#ffffff' } : { color: '#6b8c87' }}
                    >
                      Examen Blanc
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { year: 2001, title: "Examen 01", subtitle: "Machine Learning Supervisé & Non Supervisé", count: "50 QCMs", level: "Niveau Moyen" },
                    { year: 2002, title: "Examen 02", subtitle: "Deep Learning, CNN & PyTorch", count: "50 QCMs", level: "Niveau Moyen" },
                    { year: 2003, title: "Examen 03", subtitle: "NLP, Transformers (BERT/GPT) & RAG", count: "50 QCMs", level: "Niveau Moyen" },
                    { year: 2004, title: "Examen 04", subtitle: "Algorithmique, Structures & Design Patterns", count: "50 QCMs", level: "Niveau Moyen" },
                    { year: 2005, title: "Examen 05", subtitle: "Administration de Bases de Données & SQL Tuning", count: "50 QCMs", level: "Niveau Moyen" },
                    { year: 2006, title: "Examen 06", subtitle: "MLOps, Conteneurisation & Synthèse Concours", count: "50 QCMs", level: "Niveau Moyen" },
                  ].map((ex) => {
                    const isSelected = selectedYear === ex.year;
                    return (
                      <div
                        key={ex.year}
                        onClick={() => { setSelectedYear(ex.year); setSelectedDomainFilter('ALL'); }}
                        className="group relative flex flex-col justify-between p-5 rounded-2xl text-left cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden"
                        style={{
                          border: isSelected ? '2px solid #03594e' : '1px solid #d4ede9',
                          background: isSelected ? 'rgba(3,89,78,0.04)' : '#ffffff',
                          boxShadow: isSelected ? '0 8px 24px rgba(3,89,78,0.12)' : '0 4px 16px rgba(3,89,78,0.04)',
                        }}
                      >
                        {/* Colored Top Accent Bar */}
                        <div style={{ height: 4, background: isSelected ? 'linear-gradient(90deg,#03594e,#F8C62F)' : '#e8f5f3' }} className="absolute top-0 left-0 right-0" />

                        <div className="flex items-center justify-between mb-3 pt-1">
                          <span
                            className="px-3 py-1 rounded-full font-extrabold text-xs"
                            style={isSelected ? { background: '#F8C62F', color: '#1B1D21' } : { background: 'rgba(3,89,78,0.08)', color: '#03594e' }}
                          >
                            {ex.title}
                          </span>
                          <span className="text-[11px] font-bold" style={{ color: '#6b8c87' }}>
                            {ex.count} • {ex.level}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm leading-snug" style={{ color: '#1a2e2a' }}>
                          {ex.subtitle}
                        </h4>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => startExam(false)}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  style={{
                    background: 'linear-gradient(135deg, #03594e 0%, #046a5d 100%)',
                    color: '#ffffff',
                    boxShadow: '0 12px 32px rgba(3,89,78,0.25)',
                  }}
                >
                  {loading ? "Chargement des 50 QCMs..." : (
                    <>
                      <Play className="w-5 h-5 text-[#F8C62F]" /> Lancer l'Examen {selectedYear >= 2000 ? `0${selectedYear - 2000}` : selectedYear} (50 QCMs)
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* CRMEF EXAMS SETUP - NEW ELEGANT STRUCTURE */
              <div className="p-5 sm:p-6 rounded-3xl space-y-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg">

                {/* Header Row: Title + Mode Pill Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#03594e] dark:text-[#F8C62F]" />
                      Configuration de l'Épreuve du Concours
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Personnalisez votre épreuve et choisissez l'année d'entraînement
                    </p>
                  </div>

                  {/* Mode Pill Switcher */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setMode('Entraînement')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${mode === 'Entraînement'
                          ? 'bg-[#03594e] text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      💡 Entraînement
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('Examen')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${mode === 'Examen'
                          ? 'bg-[#03594e] text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      ⏱️ Examen Blanc
                    </button>
                  </div>
                </div>

                {/* Section 1: Type d'Épreuve (Grid of Interactive Cards) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      1. Choisir le Type d'Épreuve
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'SPECIALITE',
                        title: 'Spécialité Info',
                        subtitle: 'Algo, BDD, Web, Systèmes & Réseaux',
                        icon: Code2,
                        badge: 'Épreuve 1'
                      },
                      {
                        id: 'DIDACTIQUE',
                        title: 'Didactique Info',
                        subtitle: 'Orientations & Démarches pédagogiques',
                        icon: GraduationCap,
                        badge: 'Épreuve 2'
                      },
                      {
                        id: 'SCIENCES_EDU',
                        title: 'علوم التربية',
                        subtitle: 'Psychologie & Théories de l’éducation',
                        icon: Brain,
                        badge: 'Épreuve 3'
                      }
                    ].map((ep) => {
                      const isSelected = selectedDomainFilter === ep.id;
                      const IconComp = ep.icon;
                      return (
                        <div
                          key={ep.id}
                          onClick={() => setSelectedDomainFilter(ep.id)}
                          className={`group relative p-5 sm:p-6 rounded-2xl border-2 text-left cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 min-h-[145px] ${isSelected
                              ? 'border-[#03594e] bg-[#03594e]/5 dark:bg-[#03594e]/15 shadow-lg ring-2 ring-[#03594e]/20 scale-[1.01]'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#03594e]/50 dark:hover:border-slate-700 hover:shadow-md'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`p-2.5 rounded-xl transition-all ${isSelected ? 'bg-[#03594e] text-[#F8C62F]' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 group-hover:text-[#03594e]'
                              }`}>
                              <IconComp className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${isSelected ? 'bg-[#F8C62F] text-[#1B1D21]' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                              }`}>
                              {ep.badge}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#03594e] dark:group-hover:text-[#F8C62F] transition-colors">
                              {ep.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                              {ep.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Année du Concours (Interactive Year Chips with inline Language Selector) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      2. Choisir l'Année du Concours
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Sujets réels vérifiés</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {activeYears.map(y => {
                      const isSelected = selectedYear === y;
                      return (
                        <div key={y} className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedYear(y)}
                            className={`w-full py-3 px-2 rounded-2xl text-xs font-extrabold transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${isSelected
                                ? 'bg-[#03594e] border-[#03594e] text-[#ffffff] shadow-md scale-[1.02]'
                                : 'bg-white dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                          >
                            <span className={isSelected ? 'text-[#F8C62F]' : 'text-slate-400 text-[10px]'}>Session</span>
                            <span className="text-sm font-black">{y}</span>
                          </button>

                          {/* Compact Language Selector under selected year for Sciences de l'Éducation */}
                          {selectedDomainFilter === 'SCIENCES_EDU' && isSelected && (
                            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => setSelectedLangFilter('ar')}
                                className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${selectedLangFilter !== 'fr'
                                    ? 'bg-[#03594e] text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                                  }`}
                              >
                                عربية
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedLangFilter('fr')}
                                className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${selectedLangFilter === 'fr'
                                    ? 'bg-[#03594e] text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                                  }`}
                              >
                                Français
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Launch CTA Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#03594e] dark:bg-[#F8C62F] animate-pulse" />
                    <span>
                      Concours <strong className="text-slate-900 dark:text-white">{selectedYear}</strong> • Épreuve : <strong className="text-slate-900 dark:text-white">
                        {selectedDomainFilter === 'SPECIALITE' ? 'Spécialité Info' : selectedDomainFilter === 'DIDACTIQUE' ? 'Didactique Info' : 'علوم التربية'}
                      </strong> • Mode <strong className="text-slate-900 dark:text-white">{mode}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => startExam(false)}
                    disabled={loading}
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e0b227] bg-[#F8C62F] text-[#1B1D21] shrink-0"
                  >
                    {loading ? "Chargement du sujet..." : (
                      <>
                        <Play className="w-4 h-4 text-[#03594e] fill-[#03594e]" /> Lancer le Concours {selectedYear}
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED TESTS & HISTORY */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="p-12 text-center space-y-4 rounded-3xl bg-white border border-[#d4ede9]">
                <History className="w-12 h-12 text-[#03594e] mx-auto opacity-60" />
                <h3 className="text-lg font-bold text-slate-800">Aucun test enregistré pour l'instant</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Lorsque vous passez ou mettez en pause un test, vos questions, réponses et scores apparaissent ici.
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="px-6 py-2.5 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs shadow-md transition-all"
                >
                  🚀 Démarrer mon premier test
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((session) => {
                  const total = session.total_questions || 80;
                  const scorePct = Math.round(((session.quiz_score || 0) / total) * 100);
                  const isSubmitted = session.exam_submitted;
                  const dateStr = session.updated_at ? new Date(session.updated_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Récemment';

                  return (
                    <div
                      key={session.id}
                      className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:border-[#03594e]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F] border border-[#03594e]/20 text-xs font-extrabold">
                            Concours {session.exam_year}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isSubmitted
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            }`}>
                            {isSubmitted ? '🟢 Terminé' : `🟡 En cours (Q${session.current_index + 1})`}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            Session {session.quiz_mode || 'Entraînement'}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Clock className="w-3.5 h-3.5" /> Enregistré le {dateStr}
                          </div>
                        </div>

                        {/* Score Bar */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Score de la session :</span>
                          <span className="text-sm font-extrabold text-[#03594e] dark:text-[#F8C62F]">
                            {session.quiz_score} / {total} <span className="text-xs font-medium text-slate-400">({scorePct}%)</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => startExam(true, session)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isSubmitted ? <Eye className="w-4 h-4 text-[#F8C62F]" /> : <Play className="w-4 h-4 text-[#F8C62F]" />}
                          {isSubmitted ? 'Revoir la correction' : 'Reprendre le test'}
                        </button>

                        <button
                          onClick={(e) => handleDeleteHistorySession(session.id, e)}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 hover:text-red-600 text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                          title="Supprimer cette session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {deleteConfirmId && (
          <div className="fixed top-6 right-6 z-[10000] w-96 max-w-[90vw] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-2xl space-y-3 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 shrink-0">
                <Trash2 className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  Supprimer ce test de l'historique ?
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                  Cette action est définitive et retirera le score de votre historique.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDeleteSession(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        )}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-emerald-500/30 text-emerald-400 text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toast}</span>
          </div>
        )}
      </div>
    );
  }

  // --- ACTIVE QUIZ VIEW ---
  const currentAttempt = currentQ ? quizAttempts[currentQ.id] : null;

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-4 sm:space-y-6 px-1 sm:px-0">
      {/* Toast Save Message */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Top Controls Header */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-[#03594e] dark:text-[#F8C62F] uppercase tracking-wider">Concours {selectedYear} • Mode {mode}</span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">Question {currentIndex + 1} / {questions.length}</h2>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Direct Jumper */}
          <select
            value={currentIndex}
            onChange={(e) => handleJump(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[11px] font-medium focus:outline-none"
          >
            {questions.map((q, idx) => (
              <option key={idx} value={idx}>Aller à Q{idx + 1}: {q.question_number || ''}</option>
            ))}
          </select>

          {/* MANUAL SAVE BUTTON */}
          <button
            onClick={handleManualSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-bold text-[11px] shadow-sm cursor-pointer"
            title="Enregistrer manuellement mon avancement"
          >
            <Save className="w-3.5 h-3.5 text-[#F8C62F]" /> Enregistrer
          </button>

          <button
            onClick={handlePause}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] shadow-sm cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" /> Quitter
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
        <div className="bg-[#03594e] h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
      </div>

      {/* Main Question Card */}
      <div className="glass-card p-4 sm:p-8 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-[#03594e]/10 text-[#03594e] dark:text-[#F8C62F] border border-[#03594e]/20 text-[10px] sm:text-xs font-bold">
              {currentQ.domain_name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-medium">
              {currentQ.subdomain_name}
            </span>
          </div>

          <button
            onClick={() => toggleBookmark(currentQ.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${currentQ.is_bookmarked ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Star className="w-3.5 h-3.5" />
            {currentQ.is_bookmarked ? '★ Favoris' : '⭐ Favoris'}
          </button>
        </div>

        {/* Mode Entraînement: Banner pour consulter le cours associé */}
        {(() => {
          const isArabicQ = /[\u0600-\u06FF]/.test(currentQ.question_text || '');
          return mode === 'Entraînement' && (currentQ.course_title || currentQ.subdomain_name) && (
            <div
              dir={isArabicQ ? 'rtl' : 'ltr'}
              className="p-3.5 rounded-2xl bg-[#03594e]/10 border border-[#03594e]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5 text-xs">
                <div className="p-2 rounded-xl bg-[#03594e] text-white shadow-xs shrink-0">
                  <BookOpen className="w-4 h-4 text-[#F8C62F]" />
                </div>
                <div className={`text-slate-800 dark:text-slate-200 ${isArabicQ ? 'text-right' : 'text-left'}`}>
                  <span className="text-[10px] font-bold text-[#03594e] dark:text-emerald-400 uppercase tracking-wider block">
                    {isArabicQ ? "💡 المفاهيم والدرس المرتبط بهذا السؤال :" : "💡 Notions & Cours associé à cette question :"}
                  </span>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {currentQ.course_title || currentQ.subdomain_name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCourseModalTab('content');
                  setCourseModalLang(isArabicQ ? 'ar' : 'fr');
                  setCourseModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#03594e] hover:bg-[#02453d] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-[#F8C62F]" />
                <span>{isArabicQ ? "الاطلاع على ملخص الدرس" : "Consulter la Leçon de Cours"}</span>
              </button>
            </div>
          );
        })()}

        {/* Question Text Box */}
        {(() => {
          const isArabicQuestion = /[\u0600-\u06FF]/.test(currentQ.question_text || '');
          const hasRefText = hasReferenceText(currentQ);
          return (
            <>
              {hasRefText && (
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setShowTextModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 border border-amber-500/40 text-xs font-extrabold transition-all cursor-pointer shadow-xs hover:scale-105"
                  >
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{isArabicQuestion ? "📄 عرض نص الانطلاق (الوثيقة المرجعية)" : "📄 Voir le texte d'appui (Document de référence)"}</span>
                  </button>
                </div>
              )}
              <div
                dir={isArabicQuestion ? 'rtl' : 'ltr'}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed ${isArabicQuestion ? 'text-right' : 'text-left'}`}
              >
                <div className="font-bold text-[#03594e] dark:text-[#F8C62F] mb-1.5" dir="ltr">
                  <span className="inline-block">{currentQ.question_number} :</span>
                </div>
                <MarkdownViewer content={(currentQ.question_text || '').replace(/^\[Examen\s+\d+\s*-\s*Q\d+\]\s*/i, '')} />
              </div>

              {/* MCQ Options (A, B, C, D, E) */}
              <div
                dir={isArabicQuestion ? 'rtl' : 'ltr'}
                className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 ${isArabicQuestion ? 'text-right' : 'text-left'}`}
              >
                {(() => {
                  const availableKeys = ['A', 'B', 'C', 'D', 'E'];
                  return availableKeys.map((optKey) => {
                    const rawText = currentQ[`option_${optKey.toLowerCase()}`];
                    const optText = rawText || (optKey === 'E' ? (isArabicQuestion ? 'لا شيء مما سبق' : 'Aucune des réponses ci-dessus') : '');
                    if (!optText && optKey === 'E') return null;
                    const isChosen = currentAttempt?.choice === optKey;
                    const isCorrect = currentQ.correct_option?.trim() === optKey || currentAttempt?.details?.correct_option === optKey;
                    const isFullWidth = optKey === 'E' && availableKeys.length % 2 !== 0;

                    return (
                      <button
                        key={optKey}
                        onClick={() => handleOptionSelect(currentQ.id, optKey)}
                        disabled={Boolean(currentAttempt)}
                        className={`p-3 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${isArabicQuestion ? 'text-right' : 'text-left'} ${isFullWidth ? 'sm:col-span-2' : ''
                          } ${isChosen
                            ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-300 font-bold')
                            : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                      >
                        <strong className="text-[#03594e] dark:text-[#F8C62F] mx-1 inline-block" dir="ltr">{optKey})</strong> {optText}
                      </button>
                    );
                  });
                })()}
              </div>
            </>
          );
        })()}

        {/* Correction Feedback (Mode Entraînement) */}
        {currentAttempt && mode === 'Entraînement' && (
          <div className="space-y-3 pt-3.5 border-t border-slate-200 dark:border-slate-800">
            <div dir="auto" className={`p-3 sm:p-4 rounded-xl text-[11px] sm:text-xs space-y-2 bidi-plaintext ${currentAttempt.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'}`}>
              <div className="font-bold text-xs sm:text-sm" dir="ltr">
                {currentAttempt.is_correct ? '✔️ Correct ! Bonne réponse.' : `❌ Incorrect. Bonne réponse : ${currentAttempt.details?.correct_option || currentQ.correct_option}`}
              </div>
              <div dir="auto" className="leading-relaxed bidi-plaintext">
                {currentAttempt.details?.explanation || currentQ.explanation}
              </div>
            </div>

            {currentQ.astuce && (
              <div dir="auto" className="p-3 sm:p-4 rounded-xl bg-[#03594e]/10 border border-[#03594e]/30 text-[#03594e] dark:text-emerald-300 text-[11px] sm:text-xs font-medium bidi-plaintext space-y-1.5">
                <div className="font-extrabold flex items-center gap-1.5" dir="ltr">
                  <span>⚡</span> <span>Astuce Concours :</span>
                </div>
                <div dir="auto" className="leading-relaxed bidi-plaintext">
                  {currentQ.astuce}
                </div>
              </div>
            )}

            {/* Interactive AI Chatbot Callout Banner */}
            <div className="p-4 rounded-2xl bg-[#03594e]/5 border border-[#03594e]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#03594e] flex items-center justify-center text-[#F8C62F] shadow-sm shrink-0">
                  <Sparkles className="w-5 h-5 text-[#F8C62F] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Vous avez une question sur cette correction ?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium">Demandez des explications complémentaires ou un exemple au Tuteur IA !</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openQuestionAiChat(currentQ, currentAttempt)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-[#F8C62F]" /> Discuter avec l'Assistant IA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-50 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Précédent
        </button>

        {/* SKIP BUTTON */}
        {currentIndex < questions.length - 1 && (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-xs cursor-pointer"
          >
            <SkipForward className="w-4 h-4" /> Passer (sans répondre)
          </button>
        )}

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Suivant <ChevronRight className="w-4 h-4 text-[#F8C62F]" />
          </button>
        ) : (
          <button
            onClick={handleSubmitExam}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#F8C62F]" /> Terminer l'Examen
          </button>
        )}
      </div>

      {/* Exam Final Results Card */}
      {examSubmitted && (
        <div className="glass-card p-8 rounded-3xl border-emerald-500/40 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl font-bold">
            🏆
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Résultats de l'Examen</h2>
          <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {quizScore} <span className="text-lg text-slate-500 dark:text-slate-400 font-normal">/ {questions.length}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Taux de réussite : {roundPercentage(quizScore, questions.length)}%
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setQuizActive(false); setActiveTab('saved'); fetchHistory(); }}
              className="px-6 py-3 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <History className="w-4 h-4 text-[#F8C62F]" /> Voir mes tests enregistrés
            </button>
            <button
              onClick={() => setQuizActive(false)}
              className="px-6 py-3 rounded-xl font-bold text-xs cursor-pointer"
              style={{ background: '#1e293b', color: '#ffffff' }}
            >
              Fermer le test
            </button>
          </div>
        </div>
      )}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="dark-hero relative glass-card w-full max-w-sm p-6 rounded-3xl border border-red-500/20 text-center space-y-6 shadow-2xl" style={{ background: 'rgba(15, 23, 42, 0.97)', color: '#ffffff' }}>
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>Confirmation de suppression</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: '#94a3b8' }}>
                Voulez-vous vraiment supprimer ce test enregistré de votre historique ?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                style={{ background: '#1e293b', color: '#ffffff' }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  confirmDeleteSession(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Interactive AI Chatbot Modal for Question Explanations */}
      {chatModalOpen && chatQuestion && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white dark:bg-slate-900 border border-[#03594e]/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-slate-900 dark:text-white">

            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#03594e] text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-[#F8C62F]/40 flex items-center justify-center text-[#F8C62F] shadow-sm shrink-0">
                  <Bot className="w-5 h-5 text-[#F8C62F] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    Tuteur Pédagogique IA
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#F8C62F] text-[#1B1D21] font-black uppercase tracking-wider shadow-xs">
                      🟢 En direct
                    </span>
                  </h3>
                  <p className="text-xs text-teal-100 font-medium">
                    Explications & Q/R en direct sur <strong className="text-[#F8C62F]">{chatQuestion.question_number || 'la question'}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setChatModalOpen(false); setShowArabicKeyboard(false); }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Context Banner */}
            <div className="px-5 py-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-full" dir="auto">
                <span className="text-[#03594e] dark:text-[#F8C62F] font-black mr-1">{chatQuestion.question_number}:</span>
                {chatQuestion.question_text?.slice(0, 65)}...
              </div>
              <div className="flex items-center gap-2 text-[11px] shrink-0">
                <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs font-bold">
                  Votre choix: <strong className="text-amber-600 dark:text-amber-400">{chatAttempt?.choice || 'Aucun'}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shadow-xs font-bold">
                  Bonne réponse: <strong className="text-emerald-600 dark:text-emerald-400">{chatQuestion.correct_option}</strong>
                </span>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm font-sans bg-slate-50/60 dark:bg-slate-900/60">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-[#03594e] text-[#F8C62F] flex items-center justify-center shrink-0 mt-1 shadow-md">
                      <Bot className="w-4 h-4 text-[#F8C62F]" />
                    </div>
                  )}
                  <div
                    dir="auto"
                    className={`p-4 rounded-2xl max-w-[85%] leading-relaxed bidi-plaintext ${msg.role === 'user'
                      ? 'bg-[#03594e] text-white rounded-tr-none shadow-md font-medium text-right'
                      : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none shadow-sm'
                      }`}
                  >
                    {msg.role === 'assistant' ? (
                      <MarkdownViewer content={msg.content} />
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-3 text-[#03594e] dark:text-[#F8C62F] text-xs p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-[#03594e]/30 w-fit shadow-md animate-pulse font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#03594e] dark:text-[#F8C62F]" />
                  <span>L'Assistant IA analyse la question et rédige la réponse...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider shrink-0">Suggestions:</span>
              <button
                type="button"
                onClick={() => handleSendChatMessage("Pourquoi ma réponse est-elle fausse ?")}
                disabled={chatLoading}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#03594e] hover:text-white dark:hover:bg-[#03594e] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition-all shrink-0 whitespace-nowrap shadow-xs cursor-pointer"
              >
                💡 Pourquoi ma réponse est fausse ?
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage("Donne-moi un exemple concret pour mieux comprendre.")}
                disabled={chatLoading}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#03594e] hover:text-white dark:hover:bg-[#03594e] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition-all shrink-0 whitespace-nowrap shadow-xs cursor-pointer"
              >
                🔍 Exemple concret
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage("Quelle est l'astuce pour résoudre ce type de question le jour J ?")}
                disabled={chatLoading}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#03594e] hover:text-white dark:hover:bg-[#03594e] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition-all shrink-0 whitespace-nowrap shadow-xs cursor-pointer"
              >
                ⚡ Astuce du concours
              </button>
            </div>

            {/* Virtual Arabic Keyboard Floating Popover Modal */}
            {showArabicKeyboard && (
              <div className="absolute bottom-20 right-4 left-4 sm:left-auto z-50 flex justify-end animate-fade-in drop-shadow-2xl">
                <ArabicKeyboard
                  onKeyPress={(char) => setChatInput(prev => prev + char)}
                  onBackspace={() => setChatInput(prev => prev.slice(0, -1))}
                  onClear={() => setChatInput('')}
                  onClose={() => setShowArabicKeyboard(false)}
                />
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setShowArabicKeyboard(!showArabicKeyboard)}
                  className={`px-3 py-3 rounded-xl border flex items-center gap-1.5 font-extrabold text-xs cursor-pointer transition-all shrink-0 ${showArabicKeyboard
                      ? 'bg-[#F8C62F] text-[#1B1D21] border-[#F8C62F] shadow-md scale-105'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#03594e]'
                    }`}
                  title="Ouvrir la لوحة المفاتيح العربية"
                >
                  <Keyboard className="w-4 h-4 text-[#03594e] dark:text-[#F8C62F]" />
                  <span className="hidden sm:inline font-arabic">لوحة المفاتيح</span>
                </button>

                <input
                  type="text"
                  dir="auto"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez votre question / اكتب سؤالك هنا..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:border-[#03594e] focus:ring-2 focus:ring-[#03594e]/20 focus:outline-none transition-all bidi-plaintext"
                />

                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-5 py-3 rounded-xl bg-[#03594e] hover:bg-[#02453d] text-white font-extrabold text-xs shadow-md disabled:opacity-50 flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 text-[#F8C62F]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Course Revision Modal (Mode Entraînement) */}
      {courseModalOpen && currentQ && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#03594e] text-white flex items-center justify-between shrink-0 shadow-md gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-white/10 text-[#F8C62F] border border-white/20 shadow-xs shrink-0">
                  <BookOpen className="w-5 h-5 animate-pulse" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-bold text-teal-100 uppercase tracking-wider block truncate">
                    {currentQ.domain_name} • {currentQ.subdomain_name}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate">
                    {currentQ.course_title || currentQ.subdomain_name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Language Switcher Pill */}
                <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setCourseModalLang('fr')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${courseModalLang === 'fr' ? 'bg-[#F8C62F] text-[#1B1D21] shadow-xs' : 'text-white/80 hover:text-white'
                      }`}
                  >
                    🇫🇷 FR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseModalLang('ar')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${courseModalLang === 'ar' ? 'bg-[#F8C62F] text-[#1B1D21] shadow-xs' : 'text-white/80 hover:text-white'
                      }`}
                  >
                    🇲🇦 AR
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Fermer et revenir à la question"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs Header */}
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar text-xs" dir={courseModalLang === 'ar' ? 'rtl' : 'ltr'}>
              <button
                type="button"
                onClick={() => setCourseModalTab('content')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${courseModalTab === 'content'
                    ? 'bg-[#03594e] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
              >
                {courseModalLang === 'ar' ? "📖 بطاقة الدرس والمراجعة" : "📖 Fiche de Révision"}
              </button>

              {currentQ.course_examples && (
                <button
                  type="button"
                  onClick={() => setCourseModalTab('examples')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${courseModalTab === 'examples'
                      ? 'bg-[#03594e] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                >
                  {courseModalLang === 'ar' ? "🧪 تطبيقات وأمثلة" : "🧪 Pratique & Exemples"}
                </button>
              )}

              {currentQ.course_astuces && (
                <button
                  type="button"
                  onClick={() => setCourseModalTab('astuces')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${courseModalTab === 'astuces'
                      ? 'bg-[#03594e] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                >
                  {courseModalLang === 'ar' ? "⚡ قواعد ذهبية للمباراة" : "⚡ Astuces Concours"}
                </button>
              )}

              {currentQ.course_video_url && (
                <button
                  type="button"
                  onClick={() => setCourseModalTab('video')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${courseModalTab === 'video'
                      ? 'bg-[#03594e] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                >
                  {courseModalLang === 'ar' ? "🎥 فيديو" : "🎥 Vidéo"}
                </button>
              )}
            </div>

            {/* Modal Body Content */}
            <div ref={modalContentRef} className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
              {courseModalTab === 'content' && (
                <div
                  dir={courseModalLang === 'ar' ? 'rtl' : 'ltr'}
                  className={`prose dark:prose-invert max-w-none ${courseModalLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}
                >
                  <MarkdownViewer
                    content={
                      courseModalLang === 'ar'
                        ? (currentQ.course_content_ar || currentQ.course_content || currentQ.explanation || "محتوى الدرس...")
                        : (currentQ.course_content_fr || currentQ.course_content || currentQ.explanation || "Contenu du cours...")
                    }
                    highlights={currentHighlights}
                  />
                </div>
              )}

              {courseModalTab === 'examples' && (
                <div
                  dir={courseModalLang === 'ar' ? 'rtl' : 'ltr'}
                  className={`prose dark:prose-invert max-w-none ${courseModalLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}
                >
                  <MarkdownViewer content={currentQ.course_examples} highlights={currentHighlights} />
                </div>
              )}

              {courseModalTab === 'astuces' && (
                <div
                  dir={courseModalLang === 'ar' ? 'rtl' : 'ltr'}
                  className={`prose dark:prose-invert max-w-none ${courseModalLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}
                >
                  <MarkdownViewer content={currentQ.course_astuces} highlights={currentHighlights} />
                </div>
              )}

              {courseModalTab === 'video' && currentQ.course_video_url && (() => {
                const driveMatch = currentQ.course_video_url.match(/(?:drive\.google\.com|drive\.usercontent\.google\.com).*?(?:file\/d\/|id=)([a-zA-Z0-9_-]+)/);
                const driveId = driveMatch ? driveMatch[1] : null;
                const isDirect = currentQ.course_video_url.endsWith('.mp4') || currentQ.course_video_url.includes('/media/') || driveId;
                const videoSrc = driveId
                  ? `https://drive.usercontent.google.com/download?id=${driveId}&export=download&authuser=0`
                  : currentQ.course_video_url;
                return (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    {isDirect ? (
                      <video src={videoSrc} controls className="w-full h-full object-contain bg-black" />
                    ) : (
                      <iframe src={currentQ.course_video_url} className="w-full h-full border-0" allowFullScreen title="Vidéo" />
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0" dir={courseModalLang === 'ar' ? 'rtl' : 'ltr'}>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {courseModalLang === 'ar' ? "هل انتهيت من قراءة هذا الدرس؟" : "Vous avez terminé la lecture de ce cours ?"}
              </span>
              <button
                type="button"
                onClick={() => setCourseModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#03594e] hover:bg-[#02453d] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F8C62F]" />
                <span>{courseModalLang === 'ar' ? "فهمت، العودة إلى السؤال" : "J'ai compris, revenir à la question"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Highlight Toolbar (Modal Step) */}
      {highlightToolbar && courseModalOpen && (
        <div
          className="fixed z-[10000] transform -translate-x-1/2 -translate-y-full pointer-events-auto select-none"
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

      <ReferenceTextModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        question={currentQ}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-emerald-500/30 text-emerald-400 text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

const roundPercentage = (score, total) => {
  return total > 0 ? Math.round((score / total) * 100) : 0;
};

export default Exams;
