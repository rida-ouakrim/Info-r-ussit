import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import ReferenceTextModal, { hasReferenceText } from '../components/ReferenceTextModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, Trash2, CheckCircle2, FileText } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [toast, setToast] = useState(null);
  const [selectedRefQuestion, setSelectedRefQuestion] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get('bookmarks/');
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (questionId) => {
    try {
      await API.post(`bookmarks/${questionId}/toggle/`);
      setBookmarks(prev => prev.filter(b => b.question !== questionId));
      showToast("Question retirée des favoris avec succès !");
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

  if (loading) {
    return <LoadingSpinner message="Chargement de vos questions favorites..." />;
  }

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6 relative z-10">
      
      {/* ─── Compact Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-extrabold">
            <Star className="w-3.5 h-3.5 fill-[#F8C62F] text-[#F8C62F]" />
            Favoris de révision ({bookmarks.length})
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Questions Favorites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Retrouvez les questions clés que vous avez mises de côté pour vos révisions ciblées.
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-12 rounded-2xl text-center text-slate-500 dark:text-slate-400 text-sm space-y-2 shadow-sm">
          <div>Vous n'avez aucune question enregistrée dans vos favoris.</div>
          <div className="text-xs text-slate-400 dark:text-slate-500">Cliquez sur ⭐ Favoris sur n'importe quelle question pour la retrouver ici.</div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((bm) => {
            const q = bm.question_details;
            const answer = userAnswers[q.id];

            return (
              <div key={bm.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#e6f5f3] text-[#03594e] dark:bg-[#03594e]/20 dark:text-[#F8C62F] border border-[#b3e6df] dark:border-[#03594e]/40 text-xs font-bold">
                      {q.domain_name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                      {q.subdomain_name}
                    </span>
                  </div>

                  <button
                    onClick={() => removeBookmark(q.id)}
                    className="p-2 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

                      return (
                        <button
                          key={optKey}
                          onClick={() => handleOptionSelect(q.id, optKey)}
                          className={`p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-[#e6f5f3]/60 dark:hover:bg-[#03594e]/20 border border-slate-200/80 dark:border-slate-800 text-left text-xs text-slate-700 dark:text-slate-300 font-medium transition-all ${
                            isFullWidth ? 'sm:col-span-2' : ''
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
                      {answer.is_correct ? '✔️ Correct !' : `❌ Incorrect. Bonne réponse : ${answer.correct_option}`}
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
      )}
      <ReferenceTextModal
        isOpen={Boolean(selectedRefQuestion)}
        onClose={() => setSelectedRefQuestion(null)}
        question={selectedRefQuestion}
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

export default Bookmarks;
