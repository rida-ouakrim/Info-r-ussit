import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import { AlertTriangle, RefreshCw, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

const ErrorNotebook = () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [activeSubdomain, setActiveSubdomain] = useState('');

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async (keepActiveSubdomain = false) => {
    try {
      const res = await API.get('errors/');
      setErrors(res.data);
      
      if (res.data.length > 0) {
        // Group and extract keys to check if current activeSubdomain still exists
        const keys = [...new Set(res.data.map(q => q.subdomain_name || 'Autre'))];
        if (!keepActiveSubdomain || !keys.includes(activeSubdomain)) {
          setActiveSubdomain(keys[0]);
        }
      } else {
        setActiveSubdomain('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (questionId, option) => {
    try {
      const res = await API.post(`questions/${questionId}/attempt/`, { chosen_option: option });
      setUserAnswers(prev => ({ ...prev, [questionId]: res.data }));
      if (res.data.is_correct) {
        // Automatically refresh list after correct answer to remove the item
        setTimeout(() => fetchErrors(true), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-sky-400 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement du Carnet d'Erreurs...</span>
        </div>
      </div>
    );
  }

  // Group errors by subdomain
  const groupedErrors = {};
  errors.forEach(q => {
    const key = q.subdomain_name || 'Autre';
    if (!groupedErrors[key]) {
      groupedErrors[key] = [];
    }
    groupedErrors[key].push(q);
  });

  const subdomains = Object.keys(groupedErrors);
  const currentSubdomainErrors = groupedErrors[activeSubdomain] || [];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-sky-500/10 dark:from-red-950/70 dark:via-slate-900 dark:to-indigo-950/70 border border-red-500/20 dark:border-red-500/30 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" /> Carnet d'Erreurs ({errors.length})
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Retentez les questions où vous avez échoué. Elles sont regroupées par module pour faciliter vos révisions ciblées.
        </p>
      </div>

      {errors.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center text-emerald-600 dark:text-emerald-400 text-sm space-y-2">
          <div className="font-bold text-lg">🎉 Félicitations ! Votre carnet d'erreurs est totalement vide.</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Poursuivez vos révisions sur les annales ou l'Assistant IA Concours.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Subdomain Selector Tabs */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-2">
              Modules en révision
            </h3>
            
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
              {subdomains.map(subName => {
                const count = groupedErrors[subName].length;
                const isActive = subName === activeSubdomain;

                return (
                  <button
                    key={subName}
                    onClick={() => setActiveSubdomain(subName)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border shrink-0 lg:shrink ${
                      isActive 
                        ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate max-w-[140px] sm:max-w-none">{subName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Error Questions for Selected Subdomain */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeSubdomain} <span className="text-xs font-normal text-slate-400">({currentSubdomainErrors.length} questions)</span>
              </h2>
            </div>

            <div className="space-y-6">
              {currentSubdomainErrors.map((q) => {
                const answer = userAnswers[q.id];

                return (
                  <div key={q.id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:border-red-500/20 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold">
                        À Réviser
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        Concours {q.exam_year || 'IA'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm leading-relaxed">
                      <div className="font-bold text-red-600 dark:text-red-400 mb-2">{q.question_number} :</div>
                      <MarkdownViewer content={q.question_text} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(() => {
                        const availableKeys = ['A', 'B', 'C', 'D', 'E'];
                        return availableKeys.map(optKey => {
                          const rawText = q[`option_${optKey.toLowerCase()}`];
                          const optText = rawText || (optKey === 'E' ? 'Aucune des réponses ci-dessus' : '');
                          const isFullWidth = optKey === 'E' && availableKeys.length % 2 !== 0;
                          const isChosen = answer?.chosen_option === optKey;
                          const isCorrect = q.correct_option?.trim() === optKey || answer?.correct_option === optKey;

                          return (
                            <button
                              key={optKey}
                              onClick={() => handleOptionSelect(q.id, optKey)}
                              disabled={Boolean(answer)}
                              className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                                isFullWidth ? 'sm:col-span-2' : ''
                              } ${
                                isChosen
                                  ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-300 font-bold')
                                  : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <strong className="text-red-600 dark:text-red-400 mr-2">{optKey})</strong> {optText}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {answer && (
                      <div className={`p-4 rounded-xl text-xs space-y-2 ${answer.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'}`}>
                        <div className="font-bold">
                          {answer.is_correct ? '✔️ Correct ! Cette question sera retirée de votre carnet.' : `❌ Encore incorrect. Bonne réponse : ${answer.correct_option}`}
                        </div>
                        <div>{answer.explanation}</div>
                        {q.astuce && <div className="mt-1 text-sky-600 dark:text-sky-300">⚡ <strong>Astuce :</strong> {q.astuce}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorNotebook;
