import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import {
  BookOpen, Sparkles, HelpCircle, RotateCcw, CheckCircle2, XCircle,
  ChevronRight, Loader2, MessageSquare, Lightbulb, Award, Star,
  RefreshCw, ArrowRight, ArrowLeft, Pencil, Languages
} from 'lucide-react';
import { VOCABULARY, STORIES, LESSONS_CONFIG, DIAGNOSTIC_QUIZ, PRESTORED_LESSONS } from '../data/languagesData';

const TABS = [
  { id: 'lessons', label: '📚 Leçons', icon: BookOpen },
  { id: 'vocab', label: '🗣️ Vocabulaire', icon: Languages },
  { id: 'quiz', label: '🧠 Quiz Diagnostic', icon: HelpCircle },
  { id: 'corrector', label: '🤖 Correcteur IA', icon: Sparkles },
];

// ─── Color helpers ──────────────────────────────────────────────────────────
const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-400',
    badge: 'bg-blue-500',
    card: 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10',
    ring: 'ring-blue-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-400',
    badge: 'bg-purple-500',
    card: 'from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10',
    ring: 'ring-purple-400'
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-400',
    badge: 'bg-orange-500',
    card: 'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10',
    ring: 'ring-orange-400'
  },
  green: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-400',
    badge: 'bg-emerald-500',
    card: 'from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/10',
    ring: 'ring-emerald-400'
  }
};

// ─── FlipCard component ──────────────────────────────────────────────────────
function FlipCard({ word }) {
  const [flipped, setFlipped] = useState(false);
  const c = COLOR_MAP[word.color] || COLOR_MAP.blue;

  return (
    <div
      className="cursor-pointer h-52 perspective-1000"
      onClick={() => setFlipped(f => !f)}
      title="Cliquez pour retourner"
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s' }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl border-2 ${c.border} bg-gradient-to-br ${c.card} flex flex-col items-center justify-center p-5 space-y-3 shadow-md`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className={`text-xs font-black uppercase tracking-widest ${c.text} ${c.bg} px-2 py-0.5 rounded-full`}>
            {word.type}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white text-center leading-tight">{word.word}</div>
          <div className={`w-8 h-8 rounded-full ${c.badge} flex items-center justify-center animate-bounce`}>
            <span className="text-white text-xs">↩</span>
          </div>
          <p className="text-[9px] text-slate-400 text-center">Cliquez pour voir la définition</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-700 flex flex-col justify-between p-4 space-y-2 shadow-md"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <div className="text-xs font-bold text-slate-400 mb-1">📖 Définition</div>
            <p className="text-xs text-slate-200 leading-relaxed">{word.definition}</p>
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 mb-0.5">💡 Exemple</div>
            <p className="text-[10px] text-amber-200 italic leading-snug">« {word.example} »</p>
          </div>
          {word.conjugation && (
            <div>
              <div className="text-xs font-bold text-blue-400 mb-0.5">🔀 Conjugaison</div>
              <p className="text-[9px] text-blue-200 leading-snug">{word.conjugation}</p>
            </div>
          )}
          <div className={`px-2 py-1 rounded-lg bg-slate-800 border border-slate-700`}>
            <p className="text-[9px] text-slate-400"><span className="text-yellow-400 font-bold">✨ Astuce: </span>{word.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Story Renderer ──────────────────────────────────────────────────────────
function StoryRenderer({ story }) {
  const colorTextMap = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/30 px-1 py-0.5 rounded font-bold',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-900/30 px-1 py-0.5 rounded font-bold',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100/70 dark:bg-orange-900/30 px-1 py-0.5 rounded font-bold',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src="/images/languages/banana_story.png" alt="Story" className="w-12 h-12 object-contain rounded-xl" />
        <div>
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">{story.title}</h4>
          <p className="text-xs text-slate-400">L'histoire de Nano & Banana</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {story.text.map((part, i) =>
          part.type === 'text' ? (
            <span key={i}>{part.content}</span>
          ) : (
            <span key={i} className={colorTextMap[part.color] || colorTextMap.blue} title={part.meaning}>
              {part.content}
            </span>
          )
        )}
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-xs text-amber-700 dark:text-amber-300 font-medium">
        <span>🍌</span>
        <span className="italic">{story.moral}</span>
      </div>
    </div>
  );
}

// ─── Lessons Tab ─────────────────────────────────────────────────────────────
function LessonsTab() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const lessonData = selectedLesson ? PRESTORED_LESSONS[selectedLesson.id] : null;

  const handleQuizAnswer = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const quizScore = lessonData?.quiz
    ? lessonData.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Lesson Cards */}
      <div className="lg:col-span-4 space-y-4">
        <h2 className="text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Choisissez une Leçon
        </h2>
        {LESSONS_CONFIG.map((lesson) => {
          const c = COLOR_MAP[lesson.color] || COLOR_MAP.blue;
          const isActive = selectedLesson?.id === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              className={`glass-card w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${isActive ? `border-${lesson.color}-400 ring-2 ${c.ring}` : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <img src={lesson.image} alt={lesson.title} className="w-12 h-12 object-contain rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">{lesson.icon} {lesson.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{lesson.subtitle}</div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'rotate-90' : ''} text-slate-400`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Lesson Content */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {!selectedLesson && (
            <div className="glass-card p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
              <img src="/images/languages/banana_hero.png" alt="Welcome" className="w-28 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Sélectionnez une leçon à gauche</h3>
              <p className="text-xs text-slate-400">Accédez instantanément à la leçon complète, avec règles, exemples, astuces et quiz interactif.</p>
            </div>
          )}

          {lessonData && (
            <motion.div key={lessonData.lesson_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Header */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/10">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">Introduction</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{lessonData.intro}</p>
              </div>

              {/* Rule */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> La Règle</h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lessonData.rule}</p>
              </div>

              {/* Examples */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Exemples Pratiques</h3>
                {lessonData.examples?.map((ex, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
                      <div className="text-[9px] font-black text-red-500 uppercase mb-0.5">❌ Incorrect</div>
                      <div className="text-xs text-red-700 dark:text-red-300 italic">{ex.wrong}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30">
                      <div className="text-[9px] font-black text-emerald-500 uppercase mb-0.5">✅ Correct</div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">{ex.correct}</div>
                    </div>
                    {ex.explanation && (
                      <div className="col-span-2 text-[10px] text-slate-500 italic px-1">{ex.explanation}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Astuce */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 flex gap-3 items-start">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mb-0.5">✨ Astuce Mnémotechnique</div>
                  <p className="text-xs text-amber-800 dark:text-amber-200">{lessonData.astuce}</p>
                </div>
              </div>

              {/* Quiz */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> Quiz de la Leçon</h3>
                {lessonData.quiz?.map((q, qi) => (
                  <div key={qi} className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{qi + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const chosen = quizAnswers[qi] === oi;
                        const isCorrect = oi === q.correct;
                        let btnClass = 'px-3 py-2 rounded-xl text-xs text-left border transition-all font-medium ';
                        if (quizSubmitted) {
                          if (isCorrect) btnClass += 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700 dark:text-emerald-300';
                          else if (chosen) btnClass += 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300';
                          else btnClass += 'border-slate-200 dark:border-slate-700 text-slate-500 opacity-60';
                        } else {
                          btnClass += chosen
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300';
                        }
                        return (
                          <button key={oi} onClick={() => handleQuizAnswer(qi, oi)} className={btnClass}>
                            {String.fromCharCode(65 + oi)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className={`text-[10px] p-2 rounded-lg ${quizAnswers[qi] === q.correct ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'}`}>
                        {quizAnswers[qi] === q.correct ? '✅ ' : '💡 '}{q.explanation}
                      </div>
                    )}
                  </div>
                ))}
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < (lessonData.quiz?.length || 0)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
                  >
                    Valider mes Réponses
                  </button>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{quizScore}/{lessonData.quiz?.length}</div>
                    <p className="text-xs text-slate-500">{quizScore === lessonData.quiz?.length ? '🎉 Parfait !' : quizScore > lessonData.quiz?.length / 2 ? '👍 Bien joué !' : '📚 Continuez à pratiquer !'}</p>
                    <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto">
                      <RotateCcw className="w-3 h-3" /> Recommencer
                    </button>
                  </div>
                )}
              </div>

              {/* Motivation */}
              <div className="glass-card p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10 flex gap-3">
                <img src="/images/languages/banana_winner.png" alt="Motivation" className="w-14 h-14 object-contain shrink-0" />
                <div>
                  <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">🌟 Message de Banana pour toi</p>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed italic">{lessonData.motivation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Vocabulary Tab ───────────────────────────────────────────────────────────
function VocabTab() {
  const TOTAL_DAYS = 34;
  const [selectedDay, setSelectedDay] = useState(1);
  const [storyIdx, setStoryIdx] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState({});
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  const dayWords = VOCABULARY.filter(w => w.day === selectedDay);
  const dayStories = STORIES.filter(s => dayWords.some(w => s.wordIds.includes(w.id)));
  const currentStory = dayStories[storyIdx % Math.max(dayStories.length, 1)];

  // Simple challenge: fill in the correct word for each word of the day
  const challenges = dayWords.map(w => ({
    word: w.word,
    sentence: w.example.replace(w.word, '___'),
    options: [
      w.word,
      dayWords.find(x => x.id !== w.id)?.word || 'apprendre',
      'enseigner',
      'comprendre'
    ].sort(() => Math.random() - 0.5)
  }));

  return (
    <div className="space-y-6">
      {/* Day selector */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <img src="/images/languages/banana_vocab.png" alt="vocab" className="w-7 h-7 object-contain" />
            Programme 34 Jours — 3 mots/jour
          </h2>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
            Jour {selectedDay} / {TOTAL_DAYS}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(d => (
            <button
              key={d}
              onClick={() => { setSelectedDay(d); setChallengeAnswers({}); setChallengeSubmitted(false); setStoryIdx(0); }}
              className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${selectedDay === d
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcards */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">🃏 Cartes Mémo du Jour {selectedDay}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dayWords.map(w => <FlipCard key={w.id} word={w} />)}
        </div>
      </div>

      {/* Story */}
      {currentStory && (
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">📖 L'Histoire de Nano & Banana</h3>
            {dayStories.length > 1 && (
              <div className="flex gap-2">
                <button onClick={() => setStoryIdx(i => Math.max(0, i - 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-3.5 h-3.5" /></button>
                <button onClick={() => setStoryIdx(i => i + 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
          <StoryRenderer story={currentStory} />
        </div>
      )}

      {/* Daily Challenge */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500" /> Défi du Jour
        </h3>
        <p className="text-xs text-slate-500">Choisissez le bon mot pour compléter chaque phrase.</p>
        {challenges.map((ch, i) => (
          <div key={i} className="space-y-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ch.sentence}</p>
            <div className="flex flex-wrap gap-2">
              {ch.options.map((opt, oi) => {
                const chosen = challengeAnswers[i] === opt;
                const isCorrect = opt === ch.word;
                let cls = 'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ';
                if (challengeSubmitted) {
                  if (isCorrect) cls += 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700 dark:text-emerald-300';
                  else if (chosen) cls += 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300 line-through opacity-70';
                  else cls += 'border-slate-200 dark:border-slate-700 text-slate-400 opacity-50';
                } else {
                  cls += chosen
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300';
                }
                return (
                  <button key={oi} onClick={() => !challengeSubmitted && setChallengeAnswers(p => ({ ...p, [i]: opt }))} className={cls}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {!challengeSubmitted ? (
          <button
            onClick={() => setChallengeSubmitted(true)}
            disabled={Object.keys(challengeAnswers).length < challenges.length}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white text-xs font-bold transition-all"
          >
            Vérifier mes Réponses ⚡
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-black text-slate-800 dark:text-white">
                {Object.entries(challengeAnswers).filter(([k, v]) => v === challenges[+k]?.word).length}/{challenges.length} correct !
              </span>
            </div>
            <button onClick={() => { setChallengeAnswers({}); setChallengeSubmitted(false); }} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Diagnostic Quiz Tab ──────────────────────────────────────────────────────
function QuizTab() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = DIAGNOSTIC_QUIZ.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/10">
        <img src="/images/languages/banana_hero.png" alt="Quiz" className="w-16 h-16 object-contain shrink-0" />
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Quiz Diagnostic de Niveau</h2>
          <p className="text-xs text-slate-500 mt-0.5">10 questions sur les pièges du français oral. Mesurez votre niveau actuel.</p>
        </div>
      </div>

      {DIAGNOSTIC_QUIZ.map((q, qi) => (
        <div key={q.id} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span className="text-blue-600 dark:text-blue-400 font-black mr-1.5">{qi + 1}.</span>{q.question}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((opt, oi) => {
              const chosen = answers[qi] === oi;
              const isCorrect = oi === q.correct;
              let cls = 'px-3 py-2.5 rounded-xl text-xs text-left border transition-all font-medium ';
              if (submitted) {
                if (isCorrect) cls += 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold';
                else if (chosen) cls += 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300 line-through opacity-80';
                else cls += 'border-slate-200 dark:border-slate-700 text-slate-400 opacity-50';
              } else {
                cls += chosen
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20';
              }
              return (
                <button key={oi} onClick={() => !submitted && setAnswers(p => ({ ...p, [qi]: oi }))} className={cls}>
                  <span className="font-black mr-1.5">{String.fromCharCode(65 + oi)}.</span>{opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className={`p-3 rounded-xl text-[10px] leading-relaxed ${answers[qi] === q.correct ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200'}`}>
              <span className="font-bold">{answers[qi] === q.correct ? '✅ Bravo ! ' : '💡 Explication : '}</span>{q.explanation}
              <br /><span className="font-bold text-amber-600 dark:text-amber-400">✨ Astuce : </span>{q.astuce}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < DIAGNOSTIC_QUIZ.length}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
        >
          Voir mon Résultat ({Object.keys(answers).length}/{DIAGNOSTIC_QUIZ.length} réponses)
        </button>
      ) : (
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <img src={score >= 7 ? "/images/languages/banana_winner.png" : "/images/languages/banana_hero.png"} alt="Result" className="w-24 mx-auto" />
          <div className={`text-4xl font-black ${score >= 8 ? 'text-emerald-600' : score >= 5 ? 'text-amber-600' : 'text-red-600'}`}>{score}/10</div>
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {score === 10 ? '🎉 Excellent ! Vous maîtrisez le français formel !'
              : score >= 7 ? '👏 Très bien ! Continuez à travailler les quelques points faibles.'
              : score >= 5 ? '📚 Bien ! Révisez les leçons pour consolider vos bases.'
              : '💪 Ne vous découragez pas ! Commencez par les leçons et revenez bientôt.'}
          </div>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="btn-primary mx-auto">
            <RefreshCw className="w-4 h-4" /> Recommencer le Quiz
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI Corrector Tab ─────────────────────────────────────────────────────────
function CorrectorTab() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const TYPE_COLOR = {
    orthographe: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300',
    conjugaison: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300',
    accord: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300',
    syntaxe: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300',
    vocabulaire: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300',
  };

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await API.post('ai/languages-academy/', {
        action: 'check_text',
        text: text
      });
      setResult(res.data.result);
    } catch (e) {
      setError("Erreur lors de la correction. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/10">
        <img src="/images/languages/banana_agreement.png" alt="Corrector" className="w-16 h-16 object-contain shrink-0" />
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Correcteur IA d'Orthographe</h2>
          <p className="text-xs text-slate-500 mt-0.5">Saisissez un texte (e-mail, paragraphe, brouillon) et l'IA détecte vos erreurs avec des explications bienveillantes.</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Exemple : Je doit commancer a écrire des cours. Jai pas bcp de temps mais je veux progresser..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
        />
        <button
          onClick={handleCheck}
          disabled={!text.trim() || loading}
          className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
          {loading ? 'Correction en cours...' : 'Analyser et Corriger'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Score */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-black ${result.score >= 80 ? 'text-emerald-600' : result.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                {result.score}/100
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">{result.level}</div>
                <div className="text-xs text-slate-500">{result.summary}</div>
              </div>
            </div>
            <img src="/images/languages/banana_winner.png" alt="Score" className="w-14 h-14 object-contain shrink-0" />
          </div>

          {/* Corrected text */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 space-y-2">
            <h3 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Texte Corrigé</h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl">
              « {result.corrected_text} »
            </p>
          </div>

          {/* Errors */}
          {result.errors?.length > 0 && (
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">🔍 Erreurs Détectées ({result.errors.length})</h3>
              {result.errors.map((err, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs space-y-1 ${TYPE_COLOR[err.type] || TYPE_COLOR.orthographe}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold line-through opacity-70">"{err.original}"</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span className="font-black">"{err.correction}"</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-black/20 text-[8px] font-bold uppercase">{err.type}</span>
                  </div>
                  <div><span className="font-bold">Règle : </span>{err.rule}</div>
                  <div className="opacity-80">{err.explanation}</div>
                </div>
              ))}
            </div>
          )}

          {/* Advice */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/30 flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-0.5">💡 Conseil Principal</div>
              <p className="text-xs text-blue-800 dark:text-blue-200">{result.main_advice}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LanguagesAcademy() {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Hero Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-slate-900 dark:via-indigo-950/40 dark:to-purple-950/30 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-black">
            🔒 Espace Exclusif Admin • Académie des Langues
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Parler & Écrire le Français <span className="text-blue-600 dark:text-blue-400">sans Faute</span>
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            100 mots académiques, 50 histoires de Nano & Banana, 4 leçons générées par IA, et un correcteur d'orthographe intelligent pour vous aider à progresser chaque jour.
          </p>
        </div>
        <img src="/images/languages/banana_hero.png" alt="Nano & Banana" className="w-36 h-36 object-contain shrink-0" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all ${activeTab === tab.id
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'lessons' && <LessonsTab />}
          {activeTab === 'vocab' && <VocabTab />}
          {activeTab === 'quiz' && <QuizTab />}
          {activeTab === 'corrector' && <CorrectorTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
