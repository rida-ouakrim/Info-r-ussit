import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import {
  BookOpen, Sparkles, HelpCircle, RotateCcw, CheckCircle2, XCircle,
  ChevronRight, Loader2, MessageSquare, Lightbulb, Award, Star,
  RefreshCw, ArrowRight, ArrowLeft, Pencil, Languages,
  ZoomIn, ZoomOut, Maximize2, X
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

// ─── Image Zoom Modal (Lightbox with Zoom Controls) ──────────────────────────
function ImageZoomModal({ zoomData, onClose }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!zoomData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
      >
        {/* Controls Toolbar */}
        <div 
          onClick={e => e.stopPropagation()}
          className="absolute top-4 right-4 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-md z-10"
        >
          <button
            onClick={() => setScale(s => Math.min(s + 0.25, 3))}
            className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoomer (+)"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setScale(s => Math.max(s - 0.25, 0.5))}
            className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dézoomer (-)"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Taille réelle"
          >
            100%
          </button>
          <div className="w-px h-6 bg-slate-700 mx-1" />
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title Badge */}
        {zoomData.title && (
          <div className="absolute top-4 left-4 max-w-sm bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-2 text-white text-xs font-bold shadow-2xl backdrop-blur-md hidden sm:block">
            🖼️ {zoomData.title}
          </div>
        )}

        {/* Scalable Image */}
        <div
          onClick={e => e.stopPropagation()}
          className="relative max-w-4xl max-h-[85vh] overflow-auto flex items-center justify-center p-2 rounded-3xl"
        >
          <motion.img
            src={zoomData.src}
            alt={zoomData.alt || 'Illustration'}
            style={{ transform: `scale(${scale})` }}
            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200 cursor-grab active:cursor-grabbing select-none"
          />
        </div>
        
        <p className="text-[11px] text-slate-400 mt-4 font-medium text-center">
          Cliquez sur <span className="text-red-400 font-bold">X</span> ou en dehors de l'image pour fermer
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Interactive Zoomable Image Wrapper ──────────────────────────────────────
function ZoomableImage({ src, alt, title = "", className = "", containerClassName = "" }) {
  return (
    <div 
      className={`group relative cursor-zoom-in overflow-hidden rounded-2xl transition-all ${containerClassName}`}
      title="Cliquez pour agrandir"
    >
      <img src={src} alt={alt} className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${className}`} />
      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
        <span className="bg-slate-900/85 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-xl backdrop-blur-sm">
          <Maximize2 className="w-3 h-3 text-blue-400" /> Zoom
        </span>
      </div>
    </div>
  );
}

// ─── FlipCard component ──────────────────────────────────────────────────────
function FlipCard({ word }) {
  const [flipped, setFlipped] = useState(false);
  const c = COLOR_MAP[word.color] || COLOR_MAP.blue;

  return (
    <div
      className="cursor-pointer h-56 perspective-1000"
      onClick={() => setFlipped(f => !f)}
      title="Cliquez pour retourner la carte"
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
          <span className={`text-xs font-black uppercase tracking-widest ${c.text} ${c.bg} px-2.5 py-0.5 rounded-full`}>
            {word.type}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white text-center leading-tight">{word.word}</div>
          <div className={`w-8 h-8 rounded-full ${c.badge} flex items-center justify-center animate-bounce shadow-md`}>
            <span className="text-white text-xs font-bold">↩</span>
          </div>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 text-center">Cliquez pour voir la définition</p>
        </div>

        {/* Back (Fixed for 100% visibility in Light and Dark Mode) */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-slate-700 flex flex-col justify-between p-4 space-y-2 shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="space-y-2 overflow-y-auto pr-1 no-scrollbar flex-1">
            <div className="flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-slate-800 pb-1">
              📖 Définition
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {word.definition}
            </p>
            
            <div className="pt-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">💡 Exemple en Classe</div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 italic font-semibold leading-snug bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                « {word.example} »
              </p>
            </div>

            {word.conjugation && (
              <div className="pt-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">🔀 Conjugaison Utile</div>
                <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium leading-snug">{word.conjugation}</p>
              </div>
            )}
          </div>

          <div className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 mt-auto shrink-0">
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
              <span className="text-amber-600 dark:text-yellow-400 font-black">✨ Astuce : </span>{word.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Story Renderer ──────────────────────────────────────────────────────────
function StoryRenderer({ story, onZoom }) {
  const colorTextMap = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/30 px-1 py-0.5 rounded font-bold',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-900/30 px-1 py-0.5 rounded font-bold',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100/70 dark:bg-orange-900/30 px-1 py-0.5 rounded font-bold',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div 
          onClick={() => onZoom({ src: "/images/languages/banana_story.png", title: story.title })}
          className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 cursor-zoom-in group"
        >
          <ZoomableImage src="/images/languages/banana_story.png" alt="Story" title={story.title} containerClassName="w-full h-full" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">{story.title}</h4>
          <p className="text-xs text-slate-400">L'histoire de Nano & Banana</p>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
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

      <div className="flex items-center gap-2 p-3 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-xs text-amber-700 dark:text-amber-300 font-medium">
        <span>🍌</span>
        <span className="italic">{story.moral}</span>
      </div>
    </div>
  );
}

// ─── Lessons Tab ─────────────────────────────────────────────────────────────
function LessonsTab({ onZoom }) {
  const [selectedLesson, setSelectedLesson] = useState(LESSONS_CONFIG[0]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const lessonData = selectedLesson ? PRESTORED_LESSONS[selectedLesson.id] : PRESTORED_LESSONS.lesson_conjugation;

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
      <div className="lg:col-span-4 space-y-3 sm:space-y-4">
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Choisissez une Leçon
        </h2>
        {LESSONS_CONFIG.map((lesson) => {
          const c = COLOR_MAP[lesson.color] || COLOR_MAP.blue;
          const isActive = selectedLesson?.id === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              className={`glass-card w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${isActive ? `border-${lesson.color}-400 ring-2 ${c.ring}` : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <div 
                  onClick={(e) => { e.stopPropagation(); onZoom({ src: lesson.image, title: lesson.title }); }}
                  className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden cursor-zoom-in"
                >
                  <ZoomableImage src={lesson.image} alt={lesson.title} title={lesson.title} containerClassName="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{lesson.icon} {lesson.title}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{lesson.subtitle}</div>
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
          {lessonData && selectedLesson && (
            <motion.div key={lessonData.lesson_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Feature Header Card with Lesson Illustration */}
              <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-slate-900 dark:to-indigo-950/40 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                    {selectedLesson.icon} Leçon Pédagogique Détaillée
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {lessonData.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{lessonData.intro}</p>
                </div>
                <div 
                  onClick={() => onZoom({ src: selectedLesson.image, title: lessonData.title })}
                  className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 cursor-zoom-in"
                >
                  <ZoomableImage src={selectedLesson.image} alt={lessonData.title} title={lessonData.title} containerClassName="w-full h-full" />
                </div>
              </div>

              {/* Posture & Pédagogie de l'Enseignant */}
              {lessonData.pedagogical_context && (
                <div className="glass-card p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 space-y-2">
                  <h3 className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                    🎓 Posture de l'Enseignant en Classe
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lessonData.pedagogical_context}</p>
                </div>
              )}

              {/* Règle Principale */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-500" /> La Règle Fondamentale</h3>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{lessonData.rule}</p>
              </div>

              {/* Nuances & Distinctions de Mots Confondus (si disponible) */}
              {lessonData.word_distinctions?.length > 0 && (
                <div className="glass-card p-5 sm:p-6 rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/30 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 space-y-4">
                  <h3 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    🔍 Nuances & Différences entre Mots Clés
                  </h3>
                  <div className="space-y-3">
                    {lessonData.word_distinctions.map((dist, di) => (
                      <div key={di} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/40 space-y-1.5 shadow-sm">
                        <div className="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <span>⚡</span> {dist.pair}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{dist.difference}</p>
                        <div className="text-[11px] text-amber-900 dark:text-amber-200 italic bg-amber-50/80 dark:bg-amber-950/40 p-2 rounded-xl">
                          <span className="font-bold">Exemple en classe : </span>« {dist.example} »
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tableaux de Conjugaison Utiles (si disponible) */}
              {lessonData.conjugation_tables?.length > 0 && (
                <div className="glass-card p-5 sm:p-6 rounded-3xl border border-purple-200 dark:border-purple-900/40 space-y-4">
                  <h3 className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    🔀 Conjugaison des Verbes les Plus Utilisés en Enseignement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessonData.conjugation_tables.map((table, ti) => (
                      <div key={ti} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-2">
                        <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-1.5">
                          <span className="text-xs font-black text-purple-900 dark:text-purple-200">{table.verb}</span>
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">{table.tense}</span>
                        </div>
                        <ul className="text-xs text-slate-800 dark:text-slate-200 space-y-1 font-mono">
                          {table.forms.map((form, fi) => (
                            <li key={fi} className="flex justify-between border-b border-slate-100 dark:border-slate-800/50 py-0.5">
                              <span>{form}</span>
                            </li>
                          ))}
                        </ul>
                        {table.note && (
                          <p className="text-[10px] text-purple-700 dark:text-purple-300 italic pt-1"><span className="font-bold">⚠️ Piège : </span>{table.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exemples Pratiques (Incorrect vs Correct) */}
              <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-emerald-500" /> Exemples d'Erreurs Courantes & Corrections</h3>
                {lessonData.examples?.map((ex, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 space-y-1">
                      <div className="text-[10px] font-black text-red-500 uppercase tracking-wider">❌ À ÉVITER ABSOLUMENT</div>
                      <div className="text-xs sm:text-sm text-red-700 dark:text-red-300 italic font-medium">{ex.wrong}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 space-y-1">
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">✅ FORMULATION ACADÉMIQUE</div>
                      <div className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-bold">{ex.correct}</div>
                    </div>
                    {ex.explanation && (
                      <div className="col-span-1 sm:col-span-2 text-xs text-slate-600 dark:text-slate-400 italic px-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Pourquoi ? </span>{ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Classroom Dialogues (Mises en Situation) */}
              {lessonData.classroom_dialogues?.length > 0 && (
                <div className="glass-card p-5 sm:p-6 rounded-3xl border border-blue-200 dark:border-blue-900/40 space-y-4">
                  <h3 className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest flex items-center gap-2">
                    💬 Mises en Situation Reelles en Classe
                  </h3>
                  <div className="space-y-3">
                    {lessonData.classroom_dialogues.map((diag, dgi) => (
                      <div key={dgi} className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                        <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                          📌 {diag.situation}
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          « {diag.dialogue} »
                        </div>
                        <div className="text-[11px] text-blue-800 dark:text-blue-300 italic"><span className="font-bold">Analyse du prof : </span>{diag.analysis}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Astuce */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 flex gap-3 items-start">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mb-0.5">✨ Astuce Mnémotechnique Rapide</div>
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 font-medium">{lessonData.astuce}</p>
                </div>
              </div>

              {/* Quiz */}
              <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-purple-500" /> Quiz de Validation de la Leçon</h3>
                {lessonData.quiz?.map((q, qi) => (
                  <div key={qi} className="space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{qi + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const chosen = quizAnswers[qi] === oi;
                        const isCorrect = oi === q.correct;
                        let btnClass = 'px-3.5 py-2.5 rounded-xl text-xs text-left border transition-all font-medium ';
                        if (quizSubmitted) {
                          if (isCorrect) btnClass += 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold';
                          else if (chosen) btnClass += 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300';
                          else btnClass += 'border-slate-200 dark:border-slate-700 text-slate-500 opacity-60';
                        } else {
                          btnClass += chosen
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300 font-bold'
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
                      <div className={`text-xs p-3 rounded-xl ${quizAnswers[qi] === q.correct ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'}`}>
                        {quizAnswers[qi] === q.correct ? '✅ Bravo ! ' : '💡 Explication : '}{q.explanation}
                      </div>
                    )}
                  </div>
                ))}
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < (lessonData.quiz?.length || 0)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
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
              <div className="glass-card p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
                <div 
                  onClick={() => onZoom({ src: "/images/languages/banana_winner.png", title: "Message de Motivation" })}
                  className="w-16 h-16 shrink-0 cursor-zoom-in"
                >
                  <ZoomableImage src="/images/languages/banana_winner.png" alt="Motivation" title="Message de Motivation" containerClassName="w-full h-full" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">🌟 Message de Banana pour toi</p>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed italic font-medium">{lessonData.motivation}</p>
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
function VocabTab({ onZoom }) {
  const TOTAL_DAYS = 34;
  const [selectedDay, setSelectedDay] = useState(1);
  const [storyIdx, setStoryIdx] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState({});
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  const dayWords = VOCABULARY.filter(w => w.day === selectedDay);
  const dayStories = STORIES.filter(s => dayWords.some(w => s.wordIds.includes(w.id)));
  const currentStory = dayStories[storyIdx % Math.max(dayStories.length, 1)];

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
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <div 
              onClick={() => onZoom({ src: "/images/languages/banana_vocab.png", title: "Vocabulaire Jour par Jour" })}
              className="w-8 h-8 shrink-0 cursor-zoom-in"
            >
              <ZoomableImage src="/images/languages/banana_vocab.png" alt="vocab" title="Vocabulaire Jour par Jour" containerClassName="w-full h-full" />
            </div>
            Programme 34 Jours — 3 mots/jour
          </h2>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            Jour {selectedDay} / {TOTAL_DAYS}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(d => (
            <button
              key={d}
              onClick={() => { setSelectedDay(d); setChallengeAnswers({}); setChallengeSubmitted(false); setStoryIdx(0); }}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${selectedDay === d
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <StoryRenderer story={currentStory} onZoom={onZoom} />
        </div>
      )}

      {/* Daily Challenge */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500" /> Défi du Jour
        </h3>
        <p className="text-xs text-slate-500">Choisissez le bon mot pour compléter chaque phrase.</p>
        {challenges.map((ch, i) => (
          <div key={i} className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{ch.sentence}</p>
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
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300 font-bold'
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
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20"
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
function QuizTab({ onZoom }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = DIAGNOSTIC_QUIZ.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/10 text-center sm:text-left">
        <div 
          onClick={() => onZoom({ src: "/images/languages/banana_hero.png", title: "Quiz Diagnostic" })}
          className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 cursor-zoom-in"
        >
          <ZoomableImage src="/images/languages/banana_hero.png" alt="Quiz" title="Quiz Diagnostic" containerClassName="w-full h-full" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Quiz Diagnostic de Niveau</h2>
          <p className="text-xs text-slate-500 mt-0.5">10 questions sur les pièges du français oral. Mesurez votre niveau actuel.</p>
        </div>
      </div>

      {DIAGNOSTIC_QUIZ.map((q, qi) => (
        <div key={q.id} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
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
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300 font-bold'
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
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/20"
        >
          Voir mon Résultat ({Object.keys(answers).length}/{DIAGNOSTIC_QUIZ.length} réponses)
        </button>
      ) : (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div 
            onClick={() => onZoom({ src: score >= 7 ? "/images/languages/banana_winner.png" : "/images/languages/banana_hero.png", title: "Résultat du Quiz" })}
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto cursor-zoom-in"
          >
            <ZoomableImage src={score >= 7 ? "/images/languages/banana_winner.png" : "/images/languages/banana_hero.png"} alt="Result" title="Résultat du Quiz" containerClassName="w-full h-full" />
          </div>
          <div className={`text-3xl sm:text-4xl font-black ${score >= 8 ? 'text-emerald-600' : score >= 5 ? 'text-amber-600' : 'text-red-600'}`}>{score}/10</div>
          <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
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
function CorrectorTab({ onZoom }) {
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
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/10 text-center sm:text-left">
        <div 
          onClick={() => onZoom({ src: "/images/languages/banana_agreement.png", title: "Correcteur IA" })}
          className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 cursor-zoom-in"
        >
          <ZoomableImage src="/images/languages/banana_agreement.png" alt="Corrector" title="Correcteur IA" containerClassName="w-full h-full" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Correcteur IA d'Orthographe</h2>
          <p className="text-xs text-slate-500 mt-0.5">Saisissez un texte (e-mail, paragraphe, brouillon) et l'IA détecte vos erreurs avec des explications bienveillantes.</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Exemple : Je doit commancer a écrire des cours. Jai pas bcp de temps mais je veux progresser..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
        />
        <button
          onClick={handleCheck}
          disabled={!text.trim() || loading}
          className="btn-primary w-full justify-center py-3 text-xs sm:text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
          {loading ? 'Correction en cours...' : 'Analyser et Corriger'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-xs sm:text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Score */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`text-2xl sm:text-3xl font-black ${result.score >= 80 ? 'text-emerald-600' : result.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                {result.score}/100
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{result.level}</div>
                <div className="text-[10px] sm:text-xs text-slate-500">{result.summary}</div>
              </div>
            </div>
            <div 
              onClick={() => onZoom({ src: "/images/languages/banana_winner.png", title: "Score de Correction" })}
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 cursor-zoom-in"
            >
              <ZoomableImage src="/images/languages/banana_winner.png" alt="Score" title="Score de Correction" containerClassName="w-full h-full" />
            </div>
          </div>

          {/* Corrected text */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 space-y-2">
            <h3 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Texte Corrigé</h3>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl">
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

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function LanguagesAcademy() {
  const [activeTab, setActiveTab] = useState('lessons');
  const [zoomData, setZoomData] = useState(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 sm:py-4 px-2 sm:px-4">
      {/* Lightbox Zoom Modal */}
      <ImageZoomModal zoomData={zoomData} onClose={() => setZoomData(null)} />

      {/* Hero Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-slate-900 dark:via-indigo-950/40 dark:to-purple-950/30 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-xs font-black">
            🔒 Espace Exclusif Admin • Académie des Langues
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Parler & Écrire le Français <span className="text-blue-600 dark:text-blue-400">sans Faute</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            100 mots académiques, 50 histoires de Nano & Banana, 4 leçons interactives, et un correcteur d'orthographe intelligent pour réussir votre posture d'enseignant.
          </p>
        </div>
        <div 
          onClick={() => setZoomData({ src: "/images/languages/banana_hero.png", title: "Académie des Langues - Nano & Banana" })}
          className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 cursor-zoom-in hover:scale-105 transition-transform"
        >
          <ZoomableImage src="/images/languages/banana_hero.png" alt="Nano & Banana" title="Académie des Langues - Nano & Banana" containerClassName="w-full h-full" />
        </div>
      </div>

      {/* Navigation Tabs (Scrollable on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 whitespace-nowrap transition-all ${activeTab === tab.id
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
          {activeTab === 'lessons' && <LessonsTab onZoom={setZoomData} />}
          {activeTab === 'vocab' && <VocabTab onZoom={setZoomData} />}
          {activeTab === 'quiz' && <QuizTab onZoom={setZoomData} />}
          {activeTab === 'corrector' && <CorrectorTab onZoom={setZoomData} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
