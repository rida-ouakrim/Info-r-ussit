import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import { 
  Sparkles, RefreshCw, Play, CheckCircle2, Star, 
  ChevronLeft, ChevronRight, Trophy, BookOpen, XCircle,
  History, Trash2, Clock, Eye, Pause, Save
} from 'lucide-react';

const AIGenerator = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomainCode, setSelectedDomainCode] = useState('');
  const [subdomains, setSubdomains] = useState([]);
  const [selectedSubdomainCode, setSelectedSubdomainCode] = useState('');

  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Moyen');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'history'

  const [aiQuestions, setAiQuestions] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [allowedGenerations, setAllowedGenerations] = useState(null);
  const [limitError, setLimitError] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchDomains();
    fetchHistory();
    checkQueryParam();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await API.get('auth/me/');
      const isUnlimited = res.data.is_staff || res.data.username.toLowerCase() === 'rida' || res.data.account_type === 'Premium';
      setAllowedGenerations(isUnlimited ? 99999 : res.data.allowed_generations);
      if (!isUnlimited && res.data.allowed_generations <= 0) {
        setLimitError({
          error: "Limite de génération QCM IA atteinte. Pour obtenir plus de générations, veuillez contacter l'administrateur Rida Ouakrim."
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile info:", err);
    }
  };

  const fetchDomains = async () => {
    try {
      const res = await API.get('domains/');
      setDomains(res.data);
      if (res.data.length > 0) {
        setSelectedDomainCode(res.data[0].code);
        setSubdomains(res.data[0].subdomains);
        if (res.data[0].subdomains.length > 0) {
          setSelectedSubdomainCode(res.data[0].subdomains[0].code);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkQueryParam = () => {
    const params = new URLSearchParams(window.location.search);
    const subCode = params.get('subdomain');
    if (subCode) {
      setSelectedSubdomainCode(subCode);
    }
  };

  const handleDomainChange = (e) => {
    const code = e.target.value;
    setSelectedDomainCode(code);
    const dom = domains.find(d => d.code === code);
    if (dom) {
      setSubdomains(dom.subdomains);
      if (dom.subdomains.length > 0) {
        setSelectedSubdomainCode(dom.subdomains[0].code);
      }
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get('exams/history/');
      // Filter sessions for AI QCM (exam_year === 9999)
      const aiSessions = (res.data || []).filter(s => s.exam_year === 9999);
      setHistoryList(aiSessions);
    } catch (err) {
      console.error('Erreur chargement historique QCM IA:', err);
    }
  };

  const saveSession = async (index, answers, currentScore, submitted = false, customIds = null) => {
    try {
      const idsToSave = customIds || questionIds;
      const res = await API.post('exams/session/9999/', {
        session_id: currentSessionId,
        current_index: index,
        quiz_attempts_json: {
          attempts: answers,
          question_ids: idsToSave
        },
        quiz_score: currentScore,
        total_questions: idsToSave.length,
        exam_submitted: submitted,
        quiz_mode: `AI_${selectedSubdomainCode}`
      });
      if (res.data && res.data.id) {
        setCurrentSessionId(res.data.id);
      }
      fetchHistory();
      return res.data;
    } catch (err) {
      console.error('Erreur sauvegarde session IA:', err);
    }
  };

  const handleManualSave = async () => {
    await saveSession(currentIndex, userAnswers, score, showResults);
    setSaveSuccessMessage('💾 QCM IA enregistré dans votre historique avec succès !');
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setGenerating(true);
    setShowResults(false);
    setCurrentSessionId(null);
    setLimitError(null);
    try {
      const res = await API.post('ai/generate-qcm/', {
        subdomain_code: selectedSubdomainCode,
        num_questions: numQuestions,
        difficulty: difficulty
      });
      
      const qList = res.data.questions || res.data;
      const ids = qList.map(q => q.id);
      setAiQuestions(qList);
      setQuestionIds(ids);
      setCurrentIndex(0);
      setUserAnswers({});
      setScore(0);
      if (res.data.allowed_generations !== undefined) {
        setAllowedGenerations(res.data.allowed_generations);
      }

      // Create session in database immediately
      await saveSession(0, {}, 0, false, ids);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setLimitError(err.response.data);
      } else {
        alert("Erreur lors de la génération IA. Veuillez réessayer.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const resumeSession = async (session) => {
    setLoading(true);
    try {
      const qIds = session.quiz_attempts_json?.question_ids || [];
      if (qIds.length === 0) {
        alert("Impossible de charger les questions de cette session.");
        setLoading(false);
        return;
      }

      // Fetch specific questions
      const res = await API.get(`questions/?ids=${qIds.join(',')}`);
      setAiQuestions(res.data);
      setQuestionIds(qIds);
      setCurrentSessionId(session.id);
      setCurrentIndex(session.current_index || 0);
      setUserAnswers(session.quiz_attempts_json?.attempts || {});
      setScore(session.quiz_score || 0);
      setShowResults(Boolean(session.exam_submitted));
      
      // Extract subdomain code from mode (e.g. AI_DEV_ALGO -> DEV_ALGO)
      const subCode = (session.quiz_mode || '').replace('AI_', '');
      if (subCode) {
        setSelectedSubdomainCode(subCode);
      }
    } catch (err) {
      console.error('Erreur chargement session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    setDeleteConfirmId(sessionId);
  };

  const confirmDeleteSession = async (sessionId) => {
    try {
      await API.delete(`exams/session/detail/${sessionId}/`);
      fetchHistory();
      showToast("QCM supprimé de l'historique avec succès !");
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionSelect = async (questionId, option) => {
    if (userAnswers[questionId]) return;

    try {
      const res = await API.post(`questions/${questionId}/attempt/`, { chosen_option: option });
      const newAnswers = { ...userAnswers, [questionId]: res.data };
      const newScore = res.data.is_correct ? score + 1 : score;

      setUserAnswers(newAnswers);
      setScore(newScore);

      await saveSession(currentIndex, newAnswers, newScore, showResults);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePause = async () => {
    await saveSession(currentIndex, userAnswers, score, false);
    setAiQuestions([]);
    setShowResults(false);
    fetchHistory();
  };

  const handleFinishQcm = async () => {
    setShowResults(true);
    await saveSession(currentIndex, userAnswers, score, true);
  };

  const handleJump = (newIdx) => {
    setCurrentIndex(newIdx);
    saveSession(newIdx, userAnswers, score, showResults);
  };

  const getSubdomainName = (code) => {
    for (const d of domains) {
      const sd = d.subdomains.find(s => s.code === code);
      if (sd) return sd.name;
    }
    return code;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-sky-400 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement de l'Assistant IA...</span>
        </div>
      </div>
    );
  }

  // --- HOME VIEW (GENERATOR FORM & HISTORY LIST) ---
  if (aiQuestions.length === 0 && !showResults) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Header Banner */}
        <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-sky-500/10 dark:from-purple-950/70 dark:via-slate-900 dark:to-indigo-950/70 border border-purple-500/20 dark:border-purple-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                Assistant IA Concours Pédagogique
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Générateur de QCM Sur-Mesure</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Ciblez un sous-domaine spécifique du programme officiel pour générer un test d'entraînement personnalisé et suivez vos performances.
              </p>
            </div>
            {allowedGenerations !== null && (
              <div className="shrink-0 px-4 py-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold text-center">
                Générations restantes : <span className="text-sm font-black font-mono text-purple-700 dark:text-purple-300">{allowedGenerations === 99999 ? "Illimité" : allowedGenerations}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'generate'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> 🚀 Générer un QCM
          </button>

          <button
            onClick={() => { setActiveTab('history'); fetchHistory(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <History className="w-4 h-4" /> 💾 Mes QCM IA Enregistrés ({historyList.length})
          </button>
        </div>

        {/* TAB 1: FORM GENERATOR */}
        {activeTab === 'generate' && (
          <form onSubmit={handleGenerate} className="glass-card p-8 rounded-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Domaine principal</label>
                <select
                  value={selectedDomainCode}
                  onChange={handleDomainChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  {domains.map(d => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Sous-domaine Cible</label>
                <select
                  value={selectedSubdomainCode}
                  onChange={(e) => setSelectedSubdomainCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  {subdomains.map(sd => (
                    <option key={sd.code} value={sd.code}>{sd.name} ({sd.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre de questions : {numQuestions}</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full accent-purple-600 dark:accent-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Niveau de difficulté</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen (Niveau Concours)</option>
                  <option value="Difficile">Difficile (Expert)</option>
                </select>
              </div>
            </div>

            {limitError ? (
              <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/5 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
                  <XCircle className="w-5 h-5" />
                  <span>Limite de génération atteinte</span>
                </div>
                <p className="text-sm text-slate-300">
                  {limitError.error || "Vous avez épuisé vos crédits de génération de QCM IA."}
                </p>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-1.5 inline-block">
                  <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Administrateur :</div>
                  <div><strong>Nom :</strong> Rida Ouakrim</div>
                  <div><strong>Email :</strong> <a href="mailto:ridaouarkim0@gmail.com" className="text-sky-400 hover:underline">ridaouarkim0@gmail.com</a></div>
                  <div><strong>Téléphone :</strong> <span className="text-sky-400 font-mono">0702555943</span></div>
                  <div><strong>GitHub :</strong> <a href="https://github.com/rida-ouakrim" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">github.com/rida-ouakrim</a></div>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={generating}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-base shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Génération du QCM par l'IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Générer le QCM Intelligent
                  </>
                )}
              </button>
            )}
          </form>
        )}

        {/* TAB 2: AI QUIZ HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyList.length === 0 ? (
              <div className="glass-card p-12 text-center space-y-4 rounded-3xl">
                <History className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-sans">Aucun QCM IA enregistré</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Entraînez-vous avec notre générateur de QCM IA. Vos avancements et scores apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historyList.map(session => {
                  const total = session.total_questions || 5;
                  const scorePct = Math.round(((session.quiz_score || 0) / total) * 100);
                  const isSubmitted = session.exam_submitted;
                  const subCode = (session.quiz_mode || '').replace('AI_', '');
                  const subName = getSubdomainName(subCode);
                  const dateStr = session.updated_at ? new Date(session.updated_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Récemment';

                  return (
                    <div 
                      key={session.id} 
                      className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-extrabold">
                            Générateur IA
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
                            {subName || 'Module Informatique'}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Clock className="w-3.5 h-3.5" /> Enregistré le {dateStr}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Score :</span>
                          <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                            {session.quiz_score} / {total} <span className="text-xs font-medium text-slate-400">({scorePct}%)</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => resumeSession(session)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                        >
                          {isSubmitted ? <Eye className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {isSubmitted ? 'Correction' : 'Reprendre le QCM'}
                        </button>

                        <button
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 hover:text-red-600 text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors"
                          title="Supprimer la session"
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
                Voulez-vous vraiment supprimer ce QCM IA de votre historique ?
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

  // --- SHOW ACTIVE QUIZ RESULTS VIEW ---
  if (showResults) {
    const scorePct = Math.round((score / aiQuestions.length) * 100);
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8 animate-fade-in">
        {/* Results Card */}
        <div className="glass-card p-8 rounded-3xl text-center space-y-6 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 dark:from-emerald-950/70 dark:via-slate-900 dark:to-purple-950/70 border border-emerald-500/20 dark:border-emerald-500/30">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-4xl shadow-md">
            🏆
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">QCM IA Terminé !</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vous avez complété l'entraînement généré par l'Intelligence Artificielle.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <span className="block text-xs font-semibold text-slate-500">Score Final</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{score} / {aiQuestions.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <span className="block text-xs font-semibold text-slate-500">Taux de réussite</span>
              <span className={`text-2xl font-extrabold ${scorePct >= 60 ? 'text-emerald-500' : 'text-amber-500'}`}>{scorePct}%</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleGenerate()}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <RefreshCw className="w-4 h-4" /> Recommencer un test
            </button>
            <button
              onClick={() => { setAiQuestions([]); setShowResults(false); fetchHistory(); }}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm"
            >
              Changer de module
            </button>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" /> Correction & Explication Détaillée
          </h3>

          <div className="space-y-4">
            {aiQuestions.map((q, idx) => {
              const answer = userAnswers[q.id];
              const isCorrect = answer?.is_correct;

              return (
                <div key={q.id} className={`p-6 rounded-2xl border space-y-4 ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Question {idx + 1}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="text-sm text-slate-800 dark:text-slate-200">
                    <MarkdownViewer content={q.question_text} />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {['A', 'B', 'C', 'D', 'E'].map(optKey => {
                      const rawText = q[`option_${optKey.toLowerCase()}`];
                      if (!rawText && optKey !== 'E') return null;
                      const optText = rawText || 'Aucune des réponses ci-dessus';
                      const isChosen = answer?.chosen_option === optKey;
                      const isCorrectAnswer = q.correct_option?.trim() === optKey || answer?.correct_option === optKey;

                      return (
                        <div key={optKey} className={`p-2.5 rounded-lg border ${
                          isCorrectAnswer 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold'
                            : isChosen
                            ? 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          <strong className="mr-1">{optKey})</strong> {optText}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    <div className="font-semibold text-slate-900 dark:text-white mb-1">Explication :</div>
                    <div>{answer?.explanation || q.explanation}</div>
                    {q.astuce && <div className="mt-2 text-sky-600 dark:text-sky-300">⚡ <strong>Astuce :</strong> {q.astuce}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ PLAY VIEW ---
  const currentQ = aiQuestions[currentIndex];
  const currentAnswer = userAnswers[currentQ.id];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Toast Save Message */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Top Controls Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Assistant IA • {getSubdomainName(selectedSubdomainCode)}
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Question {currentIndex + 1} / {aiQuestions.length}</h2>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Direct Jumper */}
          <select
            value={currentIndex}
            onChange={(e) => handleJump(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
          >
            {aiQuestions.map((q, idx) => (
              <option key={idx} value={idx}>Aller à Q{idx + 1}</option>
            ))}
          </select>

          {/* MANUAL SAVE BUTTON */}
          <button
            onClick={handleManualSave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm"
            title="Enregistrer mon avancement"
          >
            <Save className="w-4 h-4" /> Enregistrer
          </button>

          <button
            onClick={handlePause}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm"
          >
            <Pause className="w-4 h-4" /> Pause & Quitter
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
        <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / aiQuestions.length) * 100}%` }}></div>
      </div>

      {/* Main Question Card */}
      <div className="glass-card p-8 rounded-3xl space-y-6 relative">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm leading-relaxed">
          <div className="font-bold text-purple-600 dark:text-purple-400 mb-2">{currentQ.question_number} :</div>
          <MarkdownViewer content={currentQ.question_text} />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(() => {
            const availableKeys = ['A', 'B', 'C', 'D', 'E'];
            return availableKeys.map(optKey => {
              const rawText = currentQ[`option_${optKey.toLowerCase()}`];
              const optText = rawText || (optKey === 'E' ? 'Aucune des réponses ci-dessus' : '');
              const isFullWidth = optKey === 'E' && availableKeys.length % 2 !== 0;
              const isChosen = currentAnswer?.chosen_option === optKey;
              const isCorrect = currentQ.correct_option?.trim() === optKey || currentAnswer?.correct_option === optKey;

              return (
                <button
                  key={optKey}
                  onClick={() => handleOptionSelect(currentQ.id, optKey)}
                  disabled={Boolean(currentAnswer)}
                  className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                    isFullWidth ? 'sm:col-span-2' : ''
                  } ${
                    isChosen
                      ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-300 font-bold')
                      : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <strong className="text-purple-600 dark:text-purple-400 mr-2">{optKey})</strong> {optText}
                </button>
              );
            });
          })()}
        </div>

        {/* Explanation */}
        {currentAnswer && (
          <div className={`p-4 rounded-xl text-xs space-y-2 ${currentAnswer.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'}`}>
            <div className="font-bold">
              {currentAnswer.is_correct ? '✔️ Correct !' : `❌ Incorrect. Bonne réponse : ${currentAnswer.correct_option}`}
            </div>
            <div>{currentAnswer.explanation}</div>
            {currentQ.astuce && <div className="mt-2 text-sky-600 dark:text-sky-300">⚡ <strong>Astuce :</strong> {currentQ.astuce}</div>}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-50 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Précédent
        </button>
        
        {currentIndex < aiQuestions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinishQcm}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            <Trophy className="w-4 h-4" /> Terminer le QCM
          </button>
        )}
      </div>
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
                Voulez-vous vraiment supprimer ce QCM IA de votre historique ?
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

export default AIGenerator;
