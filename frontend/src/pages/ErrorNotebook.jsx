import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import ReferenceTextModal, { hasReferenceText } from '../components/ReferenceTextModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertTriangle, BookOpen, FileText } from 'lucide-react';

const ErrorNotebook = () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [activeSubdomain, setActiveSubdomain] = useState('');
  const [selectedRefQuestion, setSelectedRefQuestion] = useState(null);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async (keepActiveSubdomain = false) => {
    try {
      const res = await API.get('errors/');
      setErrors(res.data);
      
      if (res.data.length > 0) {
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
        setTimeout(() => fetchErrors(true), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du Carnet d'Erreurs..." />;
  }

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
    <div className="max-w-6xl mx-auto py-2 space-y-6 relative z-10">
      
      {/* ─── Compact Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-extrabold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Révisions ciblées ({errors.length} erreurs)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Carnet d'Erreurs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Retentez les questions où vous avez échoué. Elles sont regroupées par module.
          </p>
        </div>
      </div>

      {errors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-12 rounded-2xl text-center text-emerald-600 dark:text-emerald-400 text-sm space-y-2 shadow-sm">
          <div className="font-bold text-lg">🎉 Félicitations ! Votre carnet d'erreurs est totalement vide.</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Poursuivez vos révisions sur les annales ou l'Assistant IA Concours.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Subdomain Tabs */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
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
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300' 
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate max-w-[140px] sm:max-w-none">{subName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-[#03594e] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Error Questions */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-[#03594e] dark:text-[#F8C62F]" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeSubdomain} <span className="text-xs font-normal text-slate-400">({currentSubdomainErrors.length} questions)</span>
              </h2>
            </div>

            <div className="space-y-6">
              {currentSubdomainErrors.map((q) => {
                const answer = userAnswers[q.id];

                return (
                  <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#03594e]/30 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                        À Réviser
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        Concours {q.exam_year || 'IA'}
                      </span>
                    </div>

                    {hasReferenceText(q) && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedRefQuestion(q)}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 border border-amber-500/40 text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>📄 عرض نص الانطلاق (الوثيقة المرجعية)</span>
                        </button>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 text-sm leading-relaxed">
                      <div className="font-bold text-[#03594e] dark:text-[#F8C62F] mb-2">{q.question_number} :</div>
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
                                  ? (isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-300 font-bold')
                                  : 'bg-slate-50 dark:bg-slate-950 hover:bg-[#e6f5f3]/60 dark:hover:bg-[#03594e]/20 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <strong className="text-[#03594e] dark:text-[#F8C62F] mr-2">{optKey})</strong> {optText}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {answer && (
                      <div dir="auto" className={`p-4 rounded-xl text-xs space-y-2 bidi-plaintext ${answer.is_correct ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
                        <div className="font-bold" dir="ltr">
                          {answer.is_correct ? '✔️ Correct ! Cette question sera retirée de votre carnet.' : `❌ Encore incorrect. Bonne réponse : ${answer.correct_option}`}
                        </div>
                        <div dir="auto" className="leading-relaxed bidi-plaintext">{answer.explanation}</div>
                        {q.astuce && (
                          <div dir="auto" className="mt-2 text-[#03594e] dark:text-[#F8C62F] font-medium bidi-plaintext space-y-1">
                            <div className="font-extrabold flex items-center gap-1.5" dir="ltr">
                              <span>⚡</span> <span>Astuce :</span>
                            </div>
                            <div dir="auto" className="leading-relaxed bidi-plaintext">{q.astuce}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <ReferenceTextModal
        isOpen={Boolean(selectedRefQuestion)}
        onClose={() => setSelectedRefQuestion(null)}
        question={selectedRefQuestion}
      />
    </div>
  );
};

export default ErrorNotebook;
