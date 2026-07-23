import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import { 
  FileText, Play, SkipForward, ChevronLeft, ChevronRight, 
  Pause, Star, CheckCircle2, AlertCircle, RefreshCw, Trophy,
  Save, History, Trash2, Clock, Check, Eye
} from 'lucide-react';

const Exams = () => {
  const [availableYears] = useState([2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [mode, setMode] = useState('Entraînement');
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'saved'
  
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState({}); // question_id -> { choice, is_correct, details }
  const [quizScore, setQuizScore] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
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

      const res = await API.get(`questions/?year=${targetYear}&source_type=past_exam`);
      if (res.data.length === 0) {
        alert(`Aucune question disponible pour l'année ${targetYear}.`);
        setLoading(false);
        return;
      }
      
      setQuestions(res.data);

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

  // --- HOME / SELECTION SCREEN ---
  if (!quizActive) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Banner Header */}
        <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-blue-500/10 dark:from-sky-950/70 dark:via-slate-900 dark:to-indigo-950/70 border border-sky-500/20 dark:border-sky-500/30 space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-sky-600 dark:text-sky-400" /> Annales : Examens Réels (2018-2025)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Entraînez-vous sur les vrais sujets de concours. Vos sessions et scores sont sauvegardés automatiquement dans votre historique.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'new'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Play className="w-4 h-4" /> 🚀 Démarrer un Concours
          </button>

          <button
            onClick={() => { setActiveTab('saved'); fetchHistory(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <History className="w-4 h-4" /> 💾 Mes Tests Enregistrés ({history.length})
          </button>
        </div>

        {/* TAB 1: NEW EXAM SETUP */}
        {activeTab === 'new' && (
          <div className="space-y-6">
            {savedSession && (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-amber-700 dark:text-amber-300 text-base flex items-center gap-2">
                    <Pause className="w-4 h-4" /> Session en pause trouvée pour l'année {selectedYear}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Avancement: Question {savedSession.current_index + 1} • Score: {savedSession.quiz_score}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => startExam(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    ▶️ Reprendre la session
                  </button>
                  <button
                    onClick={() => startExam(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm"
                  >
                    🔄 Recommencer à zéro
                  </button>
                </div>
              </div>
            )}

            <div className="glass-card p-8 rounded-3xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Sélectionnez l'Année du Concours</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                  >
                    {availableYears.map(y => (
                      <option key={y} value={y}>Concours Informatique {y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Mode d'apprentissage</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('Entraînement')}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                        mode === 'Entraînement' ? 'bg-sky-500/15 border-sky-500 text-sky-700 dark:text-sky-400' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      💡 Mode Entraînement
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('Examen')}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                        mode === 'Examen' ? 'bg-sky-500/15 border-sky-500 text-sky-700 dark:text-sky-400' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ⏱️ Mode Examen Blanc
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startExam(false)}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-base shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Chargement des questions..." : (
                  <>
                    <Play className="w-5 h-5" /> Lancer le Concours {selectedYear}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED TESTS & HISTORY */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="glass-card p-12 text-center space-y-4 rounded-3xl">
                <History className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Aucun test enregistré pour l'instant</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Lorsque vous passez ou mettez en pause un test, vos questions, réponses et scores apparaissent ici.
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md"
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
                      className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-extrabold">
                            Concours {session.exam_year}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isSubmitted 
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
                          <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
                            {session.quiz_score} / {total} <span className="text-xs font-medium text-slate-400">({scorePct}%)</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => startExam(true, session)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                        >
                          {isSubmitted ? <Eye className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {isSubmitted ? 'Revoir la correction' : 'Reprendre le test'}
                        </button>

                        <button
                          onClick={(e) => handleDeleteHistorySession(session.id, e)}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 hover:text-red-600 text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors"
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative glass-card w-full max-w-sm p-6 rounded-3xl border border-red-500/20 bg-slate-900/90 dark:bg-slate-950/95 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Confirmation de suppression</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Voulez-vous vraiment supprimer ce test enregistré de votre historique ?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  confirmDeleteSession(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition-all"
              >
                Supprimer
              </button>
            </div>
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
  const currentQ = questions[currentIndex];
  const currentAttempt = quizAttempts[currentQ.id];

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
          <span className="text-[10px] sm:text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Concours {selectedYear} • Mode {mode}</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] shadow-sm"
            title="Enregistrer manuellement mon avancement"
          >
            <Save className="w-3.5 h-3.5" /> Enregistrer
          </button>

          <button
            onClick={handlePause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] shadow-sm"
          >
            <Pause className="w-3.5 h-3.5" /> Quitter
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
        <div className="bg-sky-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
      </div>

      {/* Main Question Card */}
      <div className="glass-card p-4 sm:p-8 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[10px] sm:text-xs font-bold">
              {currentQ.domain_name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-medium">
              {currentQ.subdomain_name}
            </span>
          </div>

          <button
            onClick={() => toggleBookmark(currentQ.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              currentQ.is_bookmarked ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            {currentQ.is_bookmarked ? '★ Favoris' : '⭐ Favoris'}
          </button>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed">
          <div className="font-bold text-sky-600 dark:text-sky-400 mb-1.5">{currentQ.question_number} :</div>
          <MarkdownViewer content={currentQ.question_text} />
        </div>

        {/* MCQ Options (A, B, C, D, E) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          {(() => {
            const availableKeys = ['A', 'B', 'C', 'D', 'E'];
            return availableKeys.map((optKey) => {
              const rawText = currentQ[`option_${optKey.toLowerCase()}`];
              const optText = rawText || (optKey === 'E' ? 'Aucune des réponses ci-dessus' : '');
              const isChosen = currentAttempt?.choice === optKey;
              const isCorrect = currentQ.correct_option?.trim() === optKey || currentAttempt?.details?.correct_option === optKey;
              const isFullWidth = optKey === 'E' && availableKeys.length % 2 !== 0;

              return (
                <button
                  key={optKey}
                  onClick={() => handleOptionSelect(currentQ.id, optKey)}
                  disabled={Boolean(currentAttempt)}
                  className={`p-3 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                    isFullWidth ? 'sm:col-span-2' : ''
                  } ${
                    isChosen 
                      ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-300 font-bold')
                      : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <strong className="text-sky-600 dark:text-sky-400 mr-1.5">{optKey})</strong> {optText}
                </button>
              );
            });
          })()}
        </div>

        {/* Correction Feedback (Mode Entraînement) */}
        {currentAttempt && mode === 'Entraînement' && (
          <div className="space-y-3 pt-3.5 border-t border-slate-200 dark:border-slate-800">
            <div className={`p-3 sm:p-4 rounded-xl text-[11px] sm:text-xs space-y-1.5 ${currentAttempt.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'}`}>
              <div className="font-bold text-xs sm:text-sm">
                {currentAttempt.is_correct ? '✔️ Correct ! Bonne réponse.' : `❌ Incorrect. Bonne réponse : ${currentAttempt.details?.correct_option || currentQ.correct_option}`}
              </div>
              <div>{currentAttempt.details?.explanation || currentQ.explanation}</div>
            </div>

            {currentQ.astuce && (
              <div className="p-3 sm:p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-[11px] sm:text-xs font-medium">
                ⚡ <strong>Astuce Concours :</strong> {currentQ.astuce}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" /> Précédent
        </button>

        {/* SKIP BUTTON */}
        {currentIndex < questions.length - 1 && (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-xs"
          >
            <SkipForward className="w-4 h-4" /> Passer (sans répondre)
          </button>
        )}

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitExam}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            <Trophy className="w-4 h-4" /> Terminer l'Examen
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
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <History className="w-4 h-4" /> Voir mes tests enregistrés
            </button>
            <button
              onClick={() => setQuizActive(false)}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
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
          <div className="relative glass-card w-full max-w-sm p-6 rounded-3xl border border-red-500/20 bg-slate-900/90 dark:bg-slate-950/95 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Confirmation de suppression</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Voulez-vous vraiment supprimer ce test enregistré de votre historique ?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  confirmDeleteSession(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition-all"
              >
                Supprimer
              </button>
            </div>
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
};

const roundPercentage = (score, total) => {
  return total > 0 ? Math.round((score / total) * 100) : 0;
};

export default Exams;
