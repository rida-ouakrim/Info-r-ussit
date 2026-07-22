import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import { Star, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [toast, setToast] = useState(null);

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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-sky-400 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement de vos favoris...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 dark:from-amber-950/70 dark:via-slate-900 dark:to-indigo-950/70 border border-amber-500/20 dark:border-amber-500/30 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <Star className="w-8 h-8 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" /> Questions Favorites ({bookmarks.length})
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Retrouvez les questions clés que vous avez mises de côté pour vos révisions ciblées.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center text-slate-500 dark:text-slate-400 text-sm space-y-2">
          <div>Vous n'avez aucune question enregistrée dans vos favoris.</div>
          <div className="text-xs text-slate-400 dark:text-slate-500">Cliquez sur ⭐ Favoris sur n'importe quelle question pour la retrouver ici.</div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((bm, idx) => {
            const q = bm.question_details;
            const answer = userAnswers[q.id];

            return (
              <div key={bm.id} className="glass-card p-6 rounded-2xl space-y-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold">
                      {q.domain_name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                      {q.subdomain_name}
                    </span>
                  </div>

                  <button
                    onClick={() => removeBookmark(q.id)}
                    className="p-2 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm leading-relaxed">
                  <div className="font-bold text-amber-600 dark:text-amber-400 mb-2">{q.question_number} :</div>
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
                          className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs text-slate-700 dark:text-slate-300 font-medium transition-all ${
                            isFullWidth ? 'sm:col-span-2' : ''
                          }`}
                        >
                          <strong className="text-amber-600 dark:text-amber-400 mr-2">{optKey})</strong> {optText}
                        </button>
                      );
                    });
                  })()}
                </div>

                {answer && (
                  <div className={`p-4 rounded-xl text-xs space-y-2 ${answer.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'}`}>
                    <div className="font-bold">
                      {answer.is_correct ? '✔️ Correct !' : `❌ Incorrect. Bonne réponse : ${answer.correct_option}`}
                    </div>
                    <div>{answer.explanation}</div>
                    {q.astuce && <div className="mt-1 text-sky-600 dark:text-sky-300">⚡ <strong>Astuce :</strong> {q.astuce}</div>}
                  </div>
                )}
              </div>
            );
          })}
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

export default Bookmarks;
