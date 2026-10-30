import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Copy, Download, Check, X,
  Maximize2, Minimize2, GripHorizontal, RotateCcw, Trash2
} from 'lucide-react';

const STORAGE_KEY = 'floating_notepad_bounds';

const getDefaultBounds = () => {
  const isClient = typeof window !== 'undefined';
  const screenW = isClient ? window.innerWidth : 1024;
  const screenH = isClient ? window.innerHeight : 768;

  const defaultWidth = Math.min(460, screenW - 32);
  const defaultHeight = Math.min(420, screenH - 100);

  return {
    x: Math.max(16, screenW - defaultWidth - 24),
    y: Math.max(60, screenH - defaultHeight - 32),
    width: defaultWidth,
    height: defaultHeight,
  };
};

export default function FloatingNotePad({
  isOpen,
  onClose,
  noteText = '',
  onNoteChange,
  onCopy,
  onDownload,
  onClear,
  isCopied = false,
  saveStatus = '',
  courseTitle = 'Cours',
}) {
  const [bounds, setBounds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed.width === 'number' &&
          typeof parsed.height === 'number' &&
          typeof parsed.x === 'number' &&
          typeof parsed.y === 'number'
        ) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return getDefaultBounds();
  });

  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeBounds, setPreMaximizeBounds] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resizingType, setResizingType] = useState(null); // 'corner' | 'right' | 'bottom' | null

  const modalRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, startW: 0, startH: 0 });

  // Clamp bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setBounds((prev) => {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const clampedW = Math.min(prev.width, screenW - 20);
        const clampedH = Math.min(prev.height, screenH - 40);
        const clampedX = Math.max(10, Math.min(screenW - clampedW - 10, prev.x));
        const clampedY = Math.max(10, Math.min(screenH - clampedH - 10, prev.y));

        return {
          x: clampedX,
          y: clampedY,
          width: Math.max(320, clampedW),
          height: Math.max(240, clampedH),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save bounds to localStorage
  const saveBounds = useCallback((newBounds) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBounds));
    } catch (e) {
      // ignore
    }
  }, []);

  // --- DRAG HANDLERS ---
  const handlePointerDownHeader = (e) => {
    // Only drag with primary mouse button or touch, and not when clicking controls
    if (e.button !== 0 && e.button !== undefined) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
      return;
    }

    if (isMaximized) return; // Cannot drag when maximized

    e.preventDefault();
    setIsDragging(true);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: bounds.x,
      startY: bounds.y,
    };

    const handlePointerMove = (moveEvt) => {
      const dx = moveEvt.clientX - dragStartRef.current.mouseX;
      const dy = moveEvt.clientY - dragStartRef.current.mouseY;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const maxX = Math.max(10, screenW - bounds.width - 10);
      const maxY = Math.max(10, screenH - bounds.height - 10);

      const nextX = Math.max(10, Math.min(maxX, dragStartRef.current.startX + dx));
      const nextY = Math.max(10, Math.min(maxY, dragStartRef.current.startY + dy));

      setBounds((prev) => {
        const updated = { ...prev, x: nextX, y: nextY };
        saveBounds(updated);
        return updated;
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // --- RESIZE HANDLERS ---
  const startResizing = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMaximized) return; // Cannot manually resize when maximized

    setResizingType(type);

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: bounds.width,
      startH: bounds.height,
    };

    const handlePointerMove = (moveEvt) => {
      const dx = moveEvt.clientX - resizeStartRef.current.mouseX;
      const dy = moveEvt.clientY - resizeStartRef.current.mouseY;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const minW = 320;
      const maxW = Math.max(minW, screenW - bounds.x - 12);
      const minH = 220;
      const maxH = Math.max(minH, screenH - bounds.y - 12);

      setBounds((prev) => {
        let newW = prev.width;
        let newH = prev.height;

        if (type === 'corner' || type === 'right') {
          newW = Math.max(minW, Math.min(maxW, resizeStartRef.current.startW + dx));
        }
        if (type === 'corner' || type === 'bottom') {
          newH = Math.max(minH, Math.min(maxH, resizeStartRef.current.startH + dy));
        }

        const updated = { ...prev, width: newW, height: newH };
        saveBounds(updated);
        return updated;
      });
    };

    const handlePointerUp = () => {
      setResizingType(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // --- MAXIMIZE / RESTORE ---
  const toggleMaximize = () => {
    if (isMaximized) {
      if (preMaximizeBounds) {
        setBounds(preMaximizeBounds);
        saveBounds(preMaximizeBounds);
      }
      setIsMaximized(false);
    } else {
      setPreMaximizeBounds(bounds);
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const maxW = Math.min(840, screenW - 32);
      const maxH = Math.min(620, screenH - 80);
      const centeredX = Math.max(16, (screenW - maxW) / 2);
      const centeredY = Math.max(50, (screenH - maxH) / 2);

      const maximizedBounds = {
        x: centeredX,
        y: centeredY,
        width: maxW,
        height: maxH,
      };
      setBounds(maximizedBounds);
      setIsMaximized(true);
    }
  };

  // --- RESET POSITION ---
  const handleResetPosition = () => {
    setIsMaximized(false);
    const def = getDefaultBounds();
    setBounds(def);
    saveBounds(def);
  };

  // Stats
  const charCount = noteText ? noteText.length : 0;
  const wordCount = noteText ? noteText.trim().split(/\s+/).filter(Boolean).length : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed',
          left: `${bounds.x}px`,
          top: `${bounds.y}px`,
          width: `${bounds.width}px`,
          height: `${bounds.height}px`,
          zIndex: 9999,
          boxShadow: isDragging
            ? '0 25px 60px -10px rgba(0, 0, 0, 0.45), 0 0 0 2px rgba(16, 185, 129, 0.5)'
            : '0 20px 50px -10px rgba(0, 0, 0, 0.35)',
        }}
        className={`flex flex-col rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 backdrop-blur-2xl overflow-hidden select-none transition-shadow ${
          isDragging ? 'cursor-grabbing opacity-95' : ''
        }`}
      >
        {/* --- HEADER (DRAGGABLE AREA) --- */}
        <div
          onPointerDown={handlePointerDownHeader}
          onDoubleClick={toggleMaximize}
          className={`flex items-center justify-between px-3.5 py-2.5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 shrink-0 ${
            isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
          }`}
          title="Cliquez et glissez pour déplacer le bloc-notes (Double-clic pour agrandir)"
        >
          {/* Left: Drag grip + Icon + Title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <GripHorizontal className="w-4 h-4" />
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900 text-amber-400 dark:bg-slate-800 shadow-xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                Bloc-notes de la leçon
              </h4>
              {saveStatus && (
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
                  {saveStatus}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
            {/* Copy Button */}
            <button
              type="button"
              onClick={onCopy}
              disabled={!noteText}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/80 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              title="Copier les notes"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={onDownload}
              disabled={!noteText}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/80 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              title="Exporter (.txt)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Maximize / Restore Button */}
            <button
              type="button"
              onClick={toggleMaximize}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
              title={isMaximized ? "Restaurer la taille normale" : "Agrandir l'espace"}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-500 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
              title="Fermer le bloc-notes"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* --- TEXTAREA BODY (DYNAMICALLY RESIZABLE SPACE) --- */}
        <div className="flex-1 p-3 min-h-0 flex flex-col bg-slate-50/50 dark:bg-slate-900/30">
          <textarea
            value={noteText}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Écrivez vos remarques, définitions ou points clés sur ce cours ici..."
            className="w-full flex-1 min-h-0 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner select-text transition-all"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* --- FOOTER STATUS & CONTROLS --- */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span>{charCount} caractères</span>
            <span>•</span>
            <span>{wordCount} mots</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onClear && noteText && (
              <button
                type="button"
                onClick={onClear}
                className="px-2 py-0.5 rounded hover:bg-red-500/10 hover:text-red-500 text-[10px] text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
                title="Effacer le contenu"
              >
                <Trash2 className="w-3 h-3" />
                <span>Effacer</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetPosition}
              className="px-2 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Réinitialiser l'emplacement et la taille par défaut"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* --- RESIZE HANDLERS (RIGHT, BOTTOM, BOTTOM-RIGHT CORNER) --- */}
        {!isMaximized && (
          <>
            {/* Right Edge Handle */}
            <div
              onPointerDown={(e) => startResizing(e, 'right')}
              className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors z-20"
              title="Agrandir en largeur"
            />

            {/* Bottom Edge Handle */}
            <div
              onPointerDown={(e) => startResizing(e, 'bottom')}
              className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors z-20"
              title="Agrandir en hauteur"
            />

            {/* Bottom-Right Corner Handle (Visual Grip) */}
            <div
              onPointerDown={(e) => startResizing(e, 'corner')}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 z-30 transition-colors"
              title="Glisser pour redimensionner librement le bloc-notes"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" className="fill-current">
                <circle cx="8" cy="8" r="1.2" />
                <circle cx="4" cy="8" r="1.2" />
                <circle cx="8" cy="4" r="1.2" />
              </svg>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
