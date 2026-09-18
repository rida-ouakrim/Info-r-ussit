import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Lightbulb } from 'lucide-react';

// Matrix Block Renderer for 2D Matrices like M = (2 4 5 / 3 1 7 / 6 8 4)
const MatrixBlock = ({ name, rows }) => {
  return (
    <span className="inline-flex items-center gap-2 my-2 mx-1 p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm align-middle">
      {name && (
        <span className="font-mono font-black text-sm text-sky-600 dark:text-sky-400 mr-1">
          {name} =
        </span>
      )}

      {/* 2D Bracket Container */}
      <div className="flex items-center">
        {/* Left bracket */}
        <div className="w-1.5 self-stretch border-l-2 border-t-2 border-b-2 border-slate-500 dark:border-slate-400 rounded-l-sm"></div>

        {/* Matrix rows grid */}
        <div className="grid gap-1 px-2 font-mono text-xs">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center justify-center gap-2">
              {row.map((cell, cIdx) => (
                <span
                  key={cIdx}
                  className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-extrabold text-slate-900 dark:text-slate-100 text-xs shadow-2xs"
                >
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Right bracket */}
        <div className="w-1.5 self-stretch border-r-2 border-t-2 border-b-2 border-slate-500 dark:border-slate-400 rounded-r-sm"></div>
      </div>
    </span>
  );
};

// Tree Diagram Line Renderer with Exact Character-Proportional Width Alignment
const renderTreeLine = (line) => {
  if (!line) return '';
  try {
    const parts = line.split(/([A-Z0-9]{1,3}|\/|\\)/g);
    return parts.map((part, idx) => {
      if (/^[A-Z0-9]{1,3}$/.test(part)) {
        return (
          <span
            key={idx}
            className="inline-flex items-center justify-center rounded px-1 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 font-black text-xs font-mono shadow-2xs align-middle"
            style={{ minWidth: `${Math.max(part.length * 10, 18)}px`, height: '22px' }}
          >
            {part}
          </span>
        );
      }
      if (part === '/' || part === '\\') {
        return (
          <span key={idx} className="inline-block font-black text-indigo-400 text-sm font-mono text-center align-middle" style={{ width: '12px' }}>
            {part}
          </span>
        );
      }
      return (
        <span key={idx} className="font-mono text-slate-300 align-middle">
          {part}
        </span>
      );
    });
  } catch (e) {
    return <span className="text-slate-200 font-mono">{line}</span>;
  }
};

// Tokenizer & Syntax Highlighter for Algorithms, Pseudocode & Programming Languages
const renderAlgorithmLine = (line) => {
  if (!line) return '';
  try {
    // Comments
    if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
      return <span className="text-slate-500 italic font-mono">{line}</span>;
    }

    // Tokenize words, symbols, operators
    const tokens = line.split(/(\s+|<-|←|!=|≠|<=|>=|:=|:|,|\(|\)|\[|\]|=|\+|-|\*|\/)/g);

    const keyPurple = new Set([
      'algorithme', 'algorithm', 'variables', 'variable', 'début', 'debut',
      'fin', 'fonction', 'procedure', 'procédure', 'enregistrement', 'finenregistrement'
    ]);

    const keyControl = new Set([
      'si', 'alors', 'sinon', 'finsi', 'pour', 'de', 'à', 'a', 'faire',
      'finpour', 'tant que', 'tantque', 'fintantque', 'repeter', 'jusqu\'a',
      'jusqua', 'selon', 'cas', 'if', 'else', 'for', 'while', 'return',
      'retourner', 'renvoyer', 'sortir', 'continuer'
    ]);

    const keyTypes = new Set([
      'entier', 'réel', 'reel', 'booléen', 'booleen', 'chaîne', 'chaine',
      'caractère', 'caractere', 'tableau', 'pointeur', 'int', 'float',
      'double', 'char', 'bool', 'string', 'void', 'array', 'etudiant', 'étudiant'
    ]);

    const keyBool = new Set([
      'vrai', 'faux', 'true', 'false', 'null', 'nil'
    ]);

    const keyLog = new Set([
      'et', 'ou', 'non', 'mod', 'div', 'and', 'or', 'not'
    ]);

    const keyIO = new Set([
      'ecrire', 'écrire', 'lire', 'print', 'println', 'input', 'printf', 'scanf', 'afficher'
    ]);

    return tokens.map((token, idx) => {
      const lower = token.toLowerCase();

      if (keyPurple.has(lower)) {
        return <span key={idx} className="text-[13px] font-black text-purple-400 uppercase tracking-wide">{token}</span>;
      }
      if (keyControl.has(lower)) {
        return <span key={idx} className="font-extrabold text-indigo-400">{token}</span>;
      }
      if (keyTypes.has(lower)) {
        return <span key={idx} className="font-bold text-sky-400">{token}</span>;
      }
      if (keyBool.has(lower)) {
        return <span key={idx} className="font-bold text-emerald-400">{token}</span>;
      }
      if (keyLog.has(lower)) {
        return <span key={idx} className="font-bold text-amber-400">{token}</span>;
      }
      if (keyIO.has(lower)) {
        return <span key={idx} className="font-semibold text-cyan-300">{token}</span>;
      }
      if (['<-', '←', '!=', '≠', '<=', '>=', ':='].includes(token)) {
        return <span key={idx} className="font-bold text-pink-400 mx-0.5">{token}</span>;
      }
      if (/^\d+(\.\d+)?$/.test(token)) {
        return <span key={idx} className="text-orange-300 font-mono">{token}</span>;
      }
      // Variable / Identifier styling
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        return <span key={idx} className="text-emerald-200 font-medium">{token}</span>;
      }
      return <span key={idx} className="text-slate-200">{token}</span>;
    });
  } catch (e) {
    return <span className="text-slate-200">{line}</span>;
  }
};

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = (code || '').split('\n');

  // Detect tree diagrams vs Algorithm Code:
  // - language 'alg' = always algorithm syntax highlighting (NEVER a tree)
  // - language 'tree' = force tree rendering
  // - no language = only tree if the code looks like a real binary tree (has both / and \ on same line, no algorithm keywords)
  const hasAlgKeywords = codeLines.some(l => {
    const lower = l.toLowerCase();
    return lower.includes('algorithme') || lower.includes('variables') || lower.includes('début') || lower.includes('debut') || lower.includes('tantque') || lower.includes('tant que') || lower.includes('finsi') || lower.includes('finpour');
  });
  const isRealTree = !hasAlgKeywords && codeLines.some(l => l.includes('/') && l.includes('\\'));
  const isTreeDiagram = language === 'tree' || (language !== 'alg' && !language && isRealTree);

  // Detect ASCII art schemas (CPU/RAM diagrams, flowcharts, architecture diagrams)
  const asciiArtChars = ['┌', '┐', '└', '┘', '│', '─', '═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬', '├', '┤', '┬', '┴', '┼', '↕', '↔', '↑', '↓'];
  const hasAsciiArt = codeLines.some(l => asciiArtChars.some(ch => l.includes(ch)));
  const hasBoxDrawing = codeLines.filter(l => asciiArtChars.some(ch => l.includes(ch))).length >= 2;
  const isAsciiSchema = language === 'schema' || (!language && !hasAlgKeywords && !isRealTree && hasBoxDrawing);

  return (
    <div className={`my-5 rounded-2xl overflow-hidden border shadow-2xl group ${isAsciiSchema ? 'bg-slate-50 dark:bg-[#0c1220] border-indigo-500/30' : 'bg-[#090d16] border-slate-800'}`}>
      {/* Header bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b text-xs font-mono ${isAsciiSchema ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300' : 'bg-[#0f172a] border-slate-800 text-slate-300'}`}>
        <div className="flex items-center gap-2">
          {isAsciiSchema ? (
            <>
              <span className="text-sm">📊</span>
              <span className="font-bold">Schéma / Diagramme</span>
            </>
          ) : isTreeDiagram ? (
            <>
              <span className="text-sm">🌳</span>
              <span className="font-bold text-slate-200">Arbre Binaire / Structure</span>
            </>
          ) : language === 'alg' || hasAlgKeywords ? (
            <>
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-bold text-slate-200">Algorithme / Pseudocode</span>
            </>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold text-slate-200">Code Source</span>
            </>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copié</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Body: ASCII Schema / Tree / Algorithm / Code */}
      {isAsciiSchema ? (
        <div className="p-6 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed flex flex-col items-center justify-center">
          <div className="space-y-0 py-2 text-left inline-block">
            {codeLines.map((line, idx) => (
              <div key={idx} className="whitespace-pre text-slate-800 dark:text-slate-200 font-medium">
                {line}
              </div>
            ))}
          </div>
        </div>
      ) : isTreeDiagram ? (
        <div className="p-6 font-mono text-xs overflow-x-auto leading-relaxed flex flex-col items-center justify-center bg-[#070a12]">
          <div className="space-y-1 py-2 text-left inline-block">
            {codeLines.map((line, idx) => (
              <div key={idx} className="whitespace-pre">
                {renderTreeLine(line)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed">
          {codeLines.map((line, idx) => (
            <div key={idx} className="flex items-start gap-4 hover:bg-slate-900/50 rounded px-1">
              <span className="text-[11px] text-slate-600 select-none text-right w-6 shrink-0 pt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1 whitespace-pre">
                {renderAlgorithmLine(line)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Smart Question & Algorithm Markdown Preprocessor
const ensureFencedCodeBlocks = (text) => {
  if (!text) return '';

  // Auto-fix corrupted control chars or single backtick variants
  let cleaned = text
    .replace(/`\x07lg/g, '```alg')
    .replace(/`\\lg/g, '```alg')
    .replace(/`lg/g, '```alg')
    .replace(/`\x07/g, '```');

  // Auto-detect unfenced tree diagrams (lines containing / and \)
  if (!cleaned.includes('```') && (cleaned.includes('/ \\') || cleaned.includes('/  \\'))) {
    const lines = cleaned.split('\n');
    let formatted = [];
    let inTree = false;

    lines.forEach(line => {
      const hasTreeBranch = line.includes('/') && line.includes('\\');
      const isSingleNode = /^\s*[A-Za-z0-9]+\s*$/.test(line);

      if ((hasTreeBranch || isSingleNode) && !inTree && line.trim()) {
        inTree = true;
        formatted.push('```alg');
        formatted.push(line);
      } else if (inTree && !line.trim() && !hasTreeBranch && !isSingleNode) {
        formatted.push('```');
        inTree = false;
      } else {
        formatted.push(line);
      }
    });

    if (inTree) {
      formatted.push('```');
    }

    cleaned = formatted.join('\n');
  }

  // Auto-close unclosed ``` code blocks
  if (cleaned.includes('```') && (cleaned.split('```').length - 1) % 2 !== 0) {
    cleaned += '\n```';
  }

  if (cleaned.includes('```')) return cleaned;

  // Auto-detect unfenced algorithm structures
  if ((cleaned.includes('Algorithme') || cleaned.includes('Variables:')) && (cleaned.includes('Début') || cleaned.includes('Debut'))) {
    const lines = cleaned.split('\n');
    let formatted = [];
    let inAlgBlock = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if ((trimmed.startsWith('Algorithme') || trimmed.startsWith('Algorithm') || trimmed.startsWith('Variables:')) && !inAlgBlock) {
        inAlgBlock = true;
        formatted.push('```alg');
        formatted.push(line);
      } else if (inAlgBlock && (trimmed === 'Fin' || trimmed === 'Fin;' || trimmed === 'End')) {
        formatted.push(line);
        formatted.push('```');
        inAlgBlock = false;
      } else {
        formatted.push(line);
      }
    });

    if (inAlgBlock) {
      formatted.push('```');
    }

    return formatted.join('\n');
  }

  return cleaned;
};

const HIGHLIGHT_COLORS_MAP = {
  yellow: { bg: '#fef08a', text: '#78350f' },
  green: { bg: '#bbf7d0', text: '#14532d' },
  blue: { bg: '#bae6fd', text: '#0c4a6e' },
  pink: { bg: '#fbcfe8', text: '#831843' },
  orange: { bg: '#fed7aa', text: '#7c2d12' },
};

const stripArabicDiacritics = (str) => {
  if (!str) return '';
  return str.replace(/[\u064B-\u065F\u0640]/g, '');
};

const normalizeForMatch = (str) => {
  if (!str) return '';
  return stripArabicDiacritics(str).trim().toLowerCase().replace(/\s+/g, ' ');
};

const createFlexibleRegex = (str) => {
  if (!str) return null;
  const cleaned = normalizeForMatch(str);
  if (!cleaned) return null;

  const words = cleaned.split(' ').filter(Boolean);
  if (words.length === 0) return null;

  const wordPatterns = words.map(w => {
    const chars = w.split('').map(ch => {
      const escapedCh = ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (/[\u0600-\u06FF]/.test(ch)) {
        return escapedCh + '[\u064B-\u065F\u0640]*';
      }
      return escapedCh;
    });
    return chars.join('');
  });

  try {
    return new RegExp(`(${wordPatterns.join('\\s+')})`, 'gi');
  } catch (e) {
    console.warn("createFlexibleRegex compilation error:", e);
    return null;
  }
};

const applySingleHighlightToSegments = (segments, highlight) => {
  if (!highlight || !highlight.text || highlight.text.trim().length < 2) return segments;

  const normH = normalizeForMatch(highlight.text);
  if (!normH) return segments;

  const flexRegex = createFlexibleRegex(highlight.text);
  if (!flexRegex) return segments;

  const color = HIGHLIGHT_COLORS_MAP[highlight.colorId] || HIGHLIGHT_COLORS_MAP.yellow;
  const newSegments = [];

  for (const seg of segments) {
    if (typeof seg !== 'string') {
      newSegments.push(seg);
      continue;
    }

    flexRegex.lastIndex = 0;
    const matches = [...seg.matchAll(flexRegex)];
    if (matches.length === 0) {
      newSegments.push(seg);
      continue;
    }

    let lastIdx = 0;
    matches.forEach((match, idx) => {
      const matchStr = match[0];
      const matchStart = match.index;

      if (matchStart > lastIdx) {
        newSegments.push(seg.slice(lastIdx, matchStart));
      }

      newSegments.push(
        <mark
          key={`hl-${highlight.id || Math.random()}-${idx}`}
          className="rounded px-1 py-0.5 font-medium transition-all shadow-xs"
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          {matchStr}
        </mark>
      );

      lastIdx = matchStart + matchStr.length;
    });

    if (lastIdx < seg.length) {
      newSegments.push(seg.slice(lastIdx));
    }
  }

  return newSegments;
};

const renderTextWithHighlights = (text, lineHighlights = []) => {
  if (!text || typeof text !== 'string' || !lineHighlights || !Array.isArray(lineHighlights) || lineHighlights.length === 0) {
    return text;
  }

  try {
    const validHighlights = lineHighlights.filter(h => h && typeof h.text === 'string' && h.text.trim().length >= 2);
    if (validHighlights.length === 0) return text;

    const sorted = [...validHighlights].sort((a, b) => (b.text || '').length - (a.text || '').length);

    let segments = [text];
    for (const h of sorted) {
      segments = applySingleHighlightToSegments(segments, h);
    }

    return segments.length === 1 ? segments[0] : segments;
  } catch (e) {
    console.warn("Highlight rendering warning:", e);
    return text;
  }
};

// Helper for Matrix rendering and **bold** / `code`
const renderTextWithMatrices = (text, lineHighlights = []) => {
  if (!text) return '';

  const matrixRegex = /([A-Za-z]\s*=\s*)?[\(\[]\s*([\d\s\w\-\.,\+]+(?:\s*\/\s*[\d\s\w\-\.,\+]+)+)\s*[\)\]]/g;
  const matches = [...text.matchAll(matrixRegex)];

  if (matches.length === 0) {
    return parseInlineFormatting(text, lineHighlights);
  }

  const elements = [];
  let lastIndex = 0;

  matches.forEach((match, idx) => {
    const fullMatch = match[0];
    const matchStart = match.index;
    const namePart = match[1] ? match[1].replace('=', '').trim() : '';
    const contentPart = match[2];

    const rows = contentPart.split('/').map(r => r.trim().split(/\s+/).filter(Boolean));
    const isAllNumeric = rows.every(row => row.every(cell => /^-?\d+$/.test(cell)));
    const hasMultipleColumns = rows.some(row => row.length > 1);
    const hasManyRows = rows.length >= 3;
    const isRealMatrix = rows.length > 0 &&
      rows.every(row => row.length > 0 && row.every(cell => cell.length <= 4)) &&
      (hasMultipleColumns || hasManyRows || isAllNumeric);

    if (matchStart > lastIndex) {
      elements.push(parseInlineFormatting(text.slice(lastIndex, matchStart), lineHighlights));
    }

    if (isRealMatrix) {
      elements.push(
        <MatrixBlock key={`matrix-${idx}`} name={namePart} rows={rows} />
      );
    } else {
      elements.push(parseInlineFormatting(fullMatch, lineHighlights));
    }

    lastIndex = matchStart + fullMatch.length;
  });

  if (lastIndex < text.length) {
    elements.push(parseInlineFormatting(text.slice(lastIndex), lineHighlights));
  }

  return elements;
};

// Custom MS Access Query Icon Component (Table Grid + Red Exclamation Badge)
const AccessQueryIcon = () => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700/80 font-mono text-xs shadow-md mx-1.5 align-middle text-slate-200">
    <div className="relative flex items-center justify-center w-6 h-6 rounded bg-slate-800 border border-slate-700">
      <div className="grid grid-cols-2 grid-rows-2 w-4 h-4 gap-0.5">
        <div className="bg-sky-500/80 rounded-2xs"></div>
        <div className="bg-sky-500/80 rounded-2xs"></div>
        <div className="bg-slate-600 rounded-2xs"></div>
        <div className="bg-slate-600 rounded-2xs"></div>
      </div>
      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center border border-slate-900 shadow-sm">
        !
      </div>
    </div>
    <span className="font-bold text-sky-400 text-xs">Requête !</span>
  </span>
);
// Helper to check if text contains Arabic characters and is predominantly Arabic
const isArabicText = (str) => {
  if (!str) return false;
  const arabicMatches = str.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g);
  if (!arabicMatches) return false;
  const latinMatches = str.match(/[a-zA-Z]/g);
  const arabicCount = arabicMatches.length;
  const latinCount = latinMatches ? latinMatches.length : 0;

  if (latinCount > 0) {
    return arabicCount > latinCount;
  }
  return arabicCount >= 2;
};

// Helper to check if the overall document content is predominantly Arabic
const checkOverallArabic = (str) => {
  if (!str) return false;
  const arabicMatches = str.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g);
  if (!arabicMatches) return false;
  const latinMatches = str.match(/[a-zA-Z]/g);
  const arabicCount = arabicMatches.length;
  const latinCount = latinMatches ? latinMatches.length : 0;
  return arabicCount > latinCount;
};

// Helper to determine if a specific line should be rendered RTL
const checkLineIsArabic = (lineText, overallArabic, forceLtr = false, forceRtl = false) => {
  if (forceLtr) return false;
  if (forceRtl) return true;
  if (!lineText) return false;

  const hasArabicChar = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(lineText);
  if (!hasArabicChar) return false; // Pure LTR/French lines are ALWAYS left-aligned

  return isArabicText(lineText) || overallArabic;
};

// Zoomable Image Component with custom keyframe animations and modal view
const ZoomableImage = ({ src, alt, isAr }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleImgError = () => {
    if (imgSrc && imgSrc.startsWith('/images/')) {
      const filename = imgSrc.replace('/images/', '');
      const githubUrl = `https://raw.githubusercontent.com/rida-ouakrim/Info-r-ussit/main/frontend/public/images/${filename}`;
      if (imgSrc !== githubUrl) {
        setImgSrc(githubUrl);
        return;
      }
    }
    setHasError(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };
    if (isZoomed) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  const isArabic = isAr || isArabicText(alt) || isArabicText(src);
  const hoverLabel = isArabic ? "انقر لتكبير الصورة" : "Cliquer pour agrandir";
  const closeLabel = isArabic ? "إغلاق (Esc)" : "Fermer (Esc)";

  if (hasError) {
    return (
      <div className="my-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        🖼️ <span>{alt || 'Schéma d\'illustration'}</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes zoomFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(6px); }
        }
        @keyframes zoomScaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="relative group inline-block max-w-full my-4 mx-auto cursor-zoom-in text-center" onClick={() => setIsZoomed(true)}>
        <img
          src={imgSrc}
          alt={alt}
          onError={handleImgError}
          className="max-w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md block max-h-[360px] object-contain group-hover:scale-[1.015] active:scale-[0.98] transition-all duration-300 mx-auto"
        />
        {/* Subtle hover badge indicating click to enlarge */}
        <div className={`absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/85 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1.5 pointer-events-none shadow-lg ${isArabic ? 'font-arabic' : 'font-sans'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#F8C62F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <span>{hoverLabel}</span>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-zoom-out p-4"
          style={{ animation: 'zoomFadeIn 0.2s ease-out forwards' }}
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top-12 right-0 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 p-2 py-1 rounded-full transition-colors duration-200 backdrop-blur-md z-20 cursor-pointer flex items-center gap-1.5 text-xs px-3 font-medium border border-white/20"
              onClick={() => setIsZoomed(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{closeLabel}</span>
            </button>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/15 cursor-zoom-out"
              style={{ animation: 'zoomScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
              onClick={() => setIsZoomed(false)}
            />
            {alt && (
              <span
                className={`mt-4 text-white/95 text-xs sm:text-sm bg-slate-900/90 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md shadow-xl text-center max-w-xl ${isArabic ? 'font-arabic' : 'font-sans'}`}
                style={{ animation: 'zoomFadeIn 0.3s ease-out forwards' }}
              >
                {alt}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Interactive Author Avatar Component with Modal Lightbox Zoom
const AuthorAvatar = ({ src, name, sizeClass = "w-10 h-10 sm:w-12 sm:h-12" }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={name}
          onClick={() => setIsZoomed(true)}
          className={`${sizeClass} rounded-full object-cover border-2 border-[#03594e] shadow-md hover:scale-115 cursor-zoom-in transition-all duration-300 ring-2 ring-[#F8C62F]/50`}
          title={`انقر لتكبير صورة ${name}`}
        />
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md cursor-zoom-out p-4"
          style={{ animation: 'zoomFadeIn 0.2s ease-out forwards' }}
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative flex flex-col items-center justify-center p-6 bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsZoomed(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={src}
              alt={name}
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover border-4 border-[#03594e] shadow-2xl my-2"
              style={{ animation: 'zoomScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
            />

            <div className="mt-4 space-y-1">
              <h4 className="text-lg font-black text-white">{name}</h4>
              <p className="text-xs font-semibold text-[#F8C62F]">عالم نفس ومفكر تربوي</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Comprehensive & Flawless LaTeX → Clean Unicode Converter for math expressions
const convertLatexToUnicode = (mathContent) => {
  if (!mathContent) return '';
  let result = mathContent;

  // 1. Remove LaTeX formatting commands wrapping words/letters
  result = result.replace(/\\mathcal\{([^{}]+)\}/g, '$1');
  result = result.replace(/\\mathcal\s*([A-Za-z])/g, '$1');

  result = result.replace(/\\boldsymbol\{([^{}]+)\}/g, '$1');
  result = result.replace(/\\boldsymbol\s*(\\?[A-Za-z]+)/g, '$1');

  result = result.replace(/\\mathbf\{([^{}]+)\}/g, '$1');
  result = result.replace(/\\font\s*([A-Za-z])/g, '$1');
  result = result.replace(/\\mathbf\s*([A-Za-z])/g, '$1');

  result = result.replace(/\\text\{([^{}]+)\}/g, '$1');
  result = result.replace(/\\mathrm\{([^{}]+)\}/g, '$1');

  result = result.replace(/\\hat\{([^{}]+)\}/g, '$1̂');
  result = result.replace(/\\hat\s*(\\?[A-Za-z]+)/g, '$1̂');

  // 2. Fractions: \frac{a}{b} -> (a / b)
  result = result.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');

  // 3. Brackets & Norms: \left( -> (, \right) -> ), \| -> ||
  result = result.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  result = result.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');
  result = result.replace(/\\left\\\|/g, '||').replace(/\\right\\\|/g, '||');
  result = result.replace(/\\\|/g, '||');

  // 4. Sums and Integrals
  result = result.replace(/\\sum_{([^}]+)}\^\{([^}]+)\}/g, '∑($1..$2)');
  result = result.replace(/\\sum_{([^}]+)}\^([a-zA-Z0-9])/g, '∑($1..$2)');

  // 5. Common symbols & Greek letters
  const commands = [
    [/\\rightarrow/g, '→'], [/\\leftarrow/g, '←'], [/\\leftrightarrow/g, '↔'],
    [/\\Rightarrow/g, '⇒'], [/\\Leftarrow/g, '⇐'], [/\\Leftrightarrow/g, '⇔'],
    [/\\implies/g, '⇒'], [/\\iff/g, '⇔'],
    [/\\lfloor/g, '⌊'], [/\\rfloor/g, '⌋'], [/\\lceil/g, '⌈'], [/\\rceil/g, '⌉'],
    [/\\times/g, '×'], [/\\div/g, '÷'], [/\\cdot/g, '·'], [/\\pm/g, '±'],
    [/\\leq/g, '≤'], [/\\geq/g, '≥'], [/\\neq/g, '≠'], [/\\approx/g, '≈'],
    [/\\equiv/g, '≡'], [/\\propto/g, '∝'],
    [/\\infty/g, '∞'], [/\\sum/g, 'Σ'], [/\\prod/g, 'Π'], [/\\sqrt/g, '√'],
    [/\\in/g, '∈'], [/\\notin/g, '∉'], [/\\subset/g, '⊂'], [/\\supset/g, '⊃'],
    [/\\forall/g, '∀'], [/\\exists/g, '∃'], [/\\neg/g, '¬'],
    [/\\land/g, '∧'], [/\\lor/g, '∨'],
    [/\\alpha/g, 'α'], [/\\beta/g, 'β'], [/\\gamma/g, 'γ'], [/\\delta/g, 'δ'],
    [/\\epsilon/g, 'ε'], [/\\theta/g, 'θ'], [/\\lambda/g, 'λ'], [/\\mu/g, 'μ'],
    [/\\pi/g, 'π'], [/\\sigma/g, 'σ'], [/\\phi/g, 'φ'], [/\\omega/g, 'ω'],
    [/\\log/g, 'log'], [/\\ln/g, 'ln'], [/\\sin/g, 'sin'], [/\\cos/g, 'cos'],
    [/\\tan/g, 'tan'], [/\\max/g, 'max'], [/\\min/g, 'min'],
    [/\\quad/g, '  '], [/\\qquad/g, '    '], [/\\,/g, ' '], [/\\!/g, ''],
  ];

  for (const [pattern, replacement] of commands) {
    result = result.replace(pattern, replacement);
  }

  // 6. Subscripts: _{...} or _x
  // For text in subscripts, preserve words (e.g. _MSE -> _MSE, _Ridge -> _Ridge)
  result = result.replace(/_\{([a-zA-Z]{2,})\}/g, '_$1');

  // Single-digit/char subscripts: _2 -> ₂, _i -> ᵢ, _0 -> ₀
  const subMap = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'n': 'ₙ', 'x': 'ₓ', 'y': 'ᵧ', '+': '₊', '-': '₋', '=': '₌'
  };
  result = result.replace(/_([0-9ijkny\+\-=])/g, (_, c) => subMap[c] || `_${c}`);
  result = result.replace(/_\{([0-9ijkny\+\-=])\}/g, (_, c) => subMap[c] || `_${c}`);

  // 7. Superscripts: ^{...} or ^x
  // Special superscripts: ^T -> ᵀ, ^2 -> ², ^3 -> ³, ^-1 -> ⁻¹
  result = result.replace(/\^{T}/g, 'ᵀ').replace(/\^T/g, 'ᵀ');
  result = result.replace(/\^{-1}/g, '⁻¹').replace(/\^-1/g, '⁻¹');
  result = result.replace(/\^{2}/g, '²').replace(/\^2/g, '²');
  result = result.replace(/\^{3}/g, '³').replace(/\^3/g, '³');
  result = result.replace(/\^{n}/g, 'ⁿ').replace(/\^n/g, 'ⁿ');

  // Clean leftover backslashes and braces
  result = result.replace(/\\([a-zA-Z]+)/g, '$1');
  result = result.replace(/[{}]/g, '');

  return result;
};

// Helper for **bold**, *italic*, `code`, $math$, [ICON_ACCESS_QUERY], ⚡, and images
const parseInlineFormatting = (text, lineHighlights = []) => {
  if (!text) return '';

  // Improved regex: use [\s\S] instead of . to handle newlines, markdown images, and HTML img tags
  const inlineRegex = /(\*\*\*[\s\S]*?\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\$\$[\s\S]*?\$\$|\$[^$]+\$|\[ICON_ACCESS_QUERY\]|⚡|!\[[^\]]*\]\([^)]*\)|<img\s+[^>]*\/?>)/gi;
  const parts = text.split(inlineRegex);

  if (parts.length <= 1) {
    return renderTextWithHighlights(text, lineHighlights);
  }

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      const inner = part.slice(3, -3);
      return (
        <strong key={`bold-italic-${i}`} className="font-bold text-slate-900 dark:text-white">
          <em className="italic text-slate-850 dark:text-slate-200">
            {parseInlineFormatting(inner, lineHighlights)}
          </em>
        </strong>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2);
      return <strong key={`bold-${i}`} className="font-bold text-slate-900 dark:text-white">{parseInlineFormatting(inner, lineHighlights)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.startsWith('**')) {
      const inner = part.slice(1, -1);
      return <em key={`italic-${i}`} className="italic text-slate-800 dark:text-slate-200">{parseInlineFormatting(inner, lineHighlights)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={`code-${i}`} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 font-mono text-xs mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('$') && part.endsWith('$') && part.length > 2)) {
      const mathContent = part.replace(/^\$\$|\$\$$|^\$|\$$/g, '').trim();
      const cleanMath = convertLatexToUnicode(mathContent);

      return (
        <span
          key={`math-${i}`}
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-500/20 text-sky-700 dark:text-sky-300 font-mono font-bold text-xs shadow-2xs align-baseline"
        >
          {cleanMath}
        </span>
      );
    }
    if (part === '[ICON_ACCESS_QUERY]') {
      return <AccessQueryIcon key={`access-${i}`} />;
    }
    if (part === '⚡') {
      return <span key={`lightning-${i}`} className="inline-block text-amber-500 text-base font-extrabold mr-1 align-middle">⚡</span>;
    }
    if (part.startsWith('![') && part.includes('](')) {
      const alt = part.substring(part.indexOf('![') + 2, part.indexOf(']('));
      const src = part.substring(part.indexOf('](') + 2, part.length - 1);
      const isArText = isArabicText(text) || isArabicText(alt);
      return <ZoomableImage key={`img-${i}`} src={src} alt={alt} isAr={isArText} />;
    }
    if (part.toLowerCase().startsWith('<img')) {
      const srcMatch = part.match(/src=["']([^"']+)["']/i);
      const altMatch = part.match(/alt=["']([^"']+)["']/i);
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      if (src) {
        const isArText = isArabicText(text) || isArabicText(alt);
        return <ZoomableImage key={`html-img-${i}`} src={src} alt={alt} isAr={isArText} />;
      }
    }

    return renderTextWithHighlights(part, lineHighlights);
  });
};

const TableBlock = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  const parsedRows = rows.map(r => {
    const raw = r.trim();
    const stripped = raw.startsWith('|') && raw.endsWith('|') ? raw.slice(1, -1) : raw;
    return stripped.split('|').map(c => c.trim());
  });

  const headerRow = parsedRows[0];
  const bodyRows = parsedRows.slice(1).filter(row => !row.every(cell => cell.startsWith('---') || cell.startsWith(':--') || cell.startsWith('--:')));

  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
      <table className="w-full text-xs sm:text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-100/90 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-extrabold">
            {headerRow.map((cell, idx) => (
              <th key={idx} className="px-3 py-2.5 border-r last:border-r-0 border-slate-200 dark:border-slate-700 whitespace-nowrap">
                {parseInlineFormatting(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {bodyRows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-3 py-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                  {parseInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AUTHOR_MAP = [
  { keywords: ['erikson', 'إريكسون', 'اريكسون'], name: 'Erik Erikson', src: '/images/authors/erikson.jpg' },
  { keywords: ['piaget', 'بياجيه', 'بياتشيه'], name: 'Jean Piaget', src: '/images/authors/piaget.jpeg' },
  { keywords: ['vygotsky', 'فيغوتسكي', 'فايكوتسكي'], name: 'Lev Vygotsky', src: '/images/authors/vygotsky.jpg' },
  { keywords: ['freud', 'فرويد'], name: 'Sigmund Freud', src: '/images/authors/freud.jpg' },
  { keywords: ['skinner', 'سكينر'], name: 'B. F. Skinner', src: '/images/authors/skinner.jpg' },
  { keywords: ['thorndike', 'ثورندايك'], name: 'Edward Thorndike', src: '/images/authors/thorndike.png' },
];

const getAuthorImage = (str) => {
  if (!str || typeof str !== 'string') return null;
  const lower = str.toLowerCase();
  for (const author of AUTHOR_MAP) {
    if (author.keywords.some(kw => lower.includes(kw))) {
      return author;
    }
  }
  return null;
};

export const MarkdownViewer = ({ content, highlights = [], forceLtr = false, forceRtl = false }) => {
  if (!content) return <div className="text-slate-400 dark:text-slate-500 italic p-4">Aucun contenu disponible.</div>;

  const processedContent = ensureFencedCodeBlocks(content);
  const lines = processedContent.split('\n');
  const elements = [];
  let currentCodeBlock = [];
  let inCode = false;
  let currentLanguage = '';
  let currentTableRows = [];
  let currentBlockquoteLines = [];

  const isOverallArabic = !forceLtr && (forceRtl || checkOverallArabic(content));

  const getLineHighlights = (lineIdx, lineContent = '') => {
    if (!highlights || !Array.isArray(highlights) || highlights.length === 0) return [];
    const normLine = normalizeForMatch(lineContent);
    return highlights.filter(h => {
      if (!h || !h.text) return false;
      const normH = normalizeForMatch(h.text);
      if (!normH) return false;

      // 1. Exact line index match (primary target)
      if (typeof h.lineIdx === 'number' && h.lineIdx === lineIdx) return true;

      // 2. Multi-line phrase: h.text contains this entire line
      if (normLine && normLine.length >= 2 && normH.includes(normLine)) return true;

      // 3. Fallback for legacy highlights without lineIdx
      if (h.lineIdx == null && normLine && normLine.includes(normH)) return true;

      return false;
    });
  };

  const flushTable = (keyIndex) => {
    if (currentTableRows.length > 0) {
      elements.push(<TableBlock key={`table-${keyIndex}`} rows={[...currentTableRows]} />);
      currentTableRows = [];
    }
  };

  const flushBlockquote = (keyIndex) => {
    if (currentBlockquoteLines.length > 0) {
      let linesToRender = [...currentBlockquoteLines];
      let alertType = null;

      const firstLineTrimmed = linesToRender[0].trim();
      const alertMatch = firstLineTrimmed.match(/^\[!(TIP|IMPORTANT|WARNING|NOTE|CAUTION)\]/i);

      if (alertMatch) {
        alertType = alertMatch[1].toUpperCase();
        linesToRender = linesToRender.slice(1);
      }

      const contentText = linesToRender.join('\n');
      const isQuoteAr = checkLineIsArabic(contentText, isOverallArabic, forceLtr, forceRtl);

      const paragraphs = linesToRender.map((line, pIdx) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={pIdx} className="h-2"></div>;
        return (
          <div key={pIdx} className="my-1.5">
            {renderTextWithMatrices(trimmedLine, getLineHighlights(keyIndex, trimmedLine))}
          </div>
        );
      });

      if (alertType === 'TIP') {
        elements.push(
          <div
            key={`quote-${keyIndex}`}
            dir={isQuoteAr ? 'rtl' : 'ltr'}
            className={`my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border-l-4 border-emerald-500 text-slate-800 dark:text-slate-100 text-sm sm:text-base flex items-start gap-3.5 shadow-sm ${isQuoteAr ? 'text-right font-arabic' : 'text-left'}`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="leading-relaxed font-medium flex-1">
              <div className="font-extrabold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">
                {isQuoteAr ? "💡 نصيحة للمباراة" : "💡 ASTUCE CONCOURS"}
              </div>
              {paragraphs}
            </div>
          </div>
        );
      } else if (alertType === 'IMPORTANT') {
        elements.push(
          <div
            key={`quote-${keyIndex}`}
            dir={isQuoteAr ? 'rtl' : 'ltr'}
            className={`my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/5 border-l-4 border-purple-500 text-slate-800 dark:text-slate-100 text-sm sm:text-base flex items-start gap-3.5 shadow-sm ${isQuoteAr ? 'text-right font-arabic' : 'text-left'}`}
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="leading-relaxed font-medium flex-1">
              <div className="font-extrabold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
                {isQuoteAr ? "⚡ هام جداً" : "⚡ IMPORTANT"}
              </div>
              {paragraphs}
            </div>
          </div>
        );
      } else if (alertType === 'WARNING' || alertType === 'CAUTION') {
        elements.push(
          <div
            key={`quote-${keyIndex}`}
            dir={isQuoteAr ? 'rtl' : 'ltr'}
            className={`my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-l-4 border-amber-500 text-slate-800 dark:text-slate-100 text-sm sm:text-base flex items-start gap-3.5 shadow-sm ${isQuoteAr ? 'text-right font-arabic' : 'text-left'}`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="leading-relaxed font-medium flex-1">
              <div className="font-extrabold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1">
                {isQuoteAr ? "⚠️ تنبيه" : "⚠️ ATTENTION"}
              </div>
              {paragraphs}
            </div>
          </div>
        );
      } else {
        elements.push(
          <div
            key={`quote-${keyIndex}`}
            dir={isQuoteAr ? 'rtl' : 'ltr'}
            className={`my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border-l-4 border-amber-500 dark:border-amber-400 text-slate-800 dark:text-slate-100 text-sm sm:text-base flex items-start gap-3 shadow-sm ${isQuoteAr ? 'text-right font-arabic' : 'text-left'}`}
          >
            <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium flex-1">
              {paragraphs}
            </div>
          </div>
        );
      }

      currentBlockquoteLines = [];
    }
  };

  const renderedImagesSet = new Set();

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      flushTable(index);
      flushBlockquote(index);
      if (inCode) {
        elements.push(<CodeBlock key={`code-${index}`} code={currentCodeBlock.join('\n')} language={currentLanguage} />);
        currentCodeBlock = [];
        inCode = false;
        currentLanguage = '';
      } else {
        inCode = true;
        currentLanguage = line.trim().substring(3).toLowerCase().trim();
      }
      return;
    }

    if (inCode) {
      currentCodeBlock.push(line);
      return;
    }

    const trimmed = line.trim();

    // Deduplicate identical image tags within the same document
    if (trimmed.startsWith('![') && trimmed.includes('](')) {
      const imgSrc = trimmed.substring(trimmed.indexOf('](') + 2, trimmed.endsWith(')') ? trimmed.length - 1 : trimmed.length);
      if (renderedImagesSet.has(imgSrc)) {
        return;
      }
      renderedImagesSet.add(imgSrc);
    }

    // Check for Markdown Table Rows
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushBlockquote(index);
      currentTableRows.push(trimmed);
      return;
    } else {
      flushTable(index);
    }

    // Check for Blockquotes
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.startsWith('> ') ? trimmed.substring(2) : trimmed.substring(1);
      currentBlockquoteLines.push(quoteText);
      return;
    } else {
      flushBlockquote(index);
    }

    if (!trimmed) {
      elements.push(<div key={`empty-${index}`} className="h-2"></div>);
      return;
    }

    // Horizontal Rules: --- / *** / ___
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(
        <hr key={`hr-${index}`} className="my-6 border-t border-slate-200 dark:border-slate-800" />
      );
      return;
    }

    const isAr = checkLineIsArabic(trimmed, isOverallArabic, forceLtr, forceRtl);
    const textDirClass = isAr ? 'dir-rtl text-right font-arabic' : 'text-left';

    // Headings H1
    if (trimmed.startsWith('# ')) {
      const titleText = trimmed.replace('# ', '');
      const isTitleAr = checkLineIsArabic(titleText, isOverallArabic, forceLtr, forceRtl);
      const authorImg = getAuthorImage(titleText);

      elements.push(
        <h1 key={`h1-${index}`} data-line-idx={index} dir={isTitleAr ? 'rtl' : 'ltr'} className={`text-2xl sm:text-3xl font-black text-[#1a2e2a] mt-8 mb-5 pb-3 border-b-2 border-[#d4ede9] flex items-center justify-between gap-3 ${isTitleAr ? 'text-right font-arabic' : 'text-left'}`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="w-2.5 h-8 bg-gradient-to-b from-[#03594e] to-[#046a5d] rounded-full inline-block shrink-0 shadow-md"></span>
            <span className="leading-snug">{renderTextWithMatrices(titleText, getLineHighlights(index, titleText))}</span>
          </div>
          {authorImg && <AuthorAvatar src={authorImg.src} name={authorImg.name} sizeClass="w-12 h-12 sm:w-14 sm:h-14" />}
        </h1>
      );
    }
    // Headings H2
    else if (trimmed.startsWith('## ')) {
      const h2Text = trimmed.replace('## ', '');
      const isH2Ar = checkLineIsArabic(h2Text, isOverallArabic, forceLtr, forceRtl);
      const authorImg = getAuthorImage(h2Text);

      elements.push(
        <h2 key={`h2-${index}`} data-line-idx={index} dir={isH2Ar ? 'rtl' : 'ltr'} className={`text-lg sm:text-xl font-extrabold text-[#03594e] mt-7 mb-3.5 flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#f0f9f8] border border-[#d4ede9] shadow-xs ${isH2Ar ? 'text-right font-arabic' : 'text-left'}`}>
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-6 bg-[#F8C62F] rounded-full inline-block shrink-0 shadow-xs"></span>
            <span className="leading-snug">{renderTextWithMatrices(h2Text, getLineHighlights(index, h2Text))}</span>
          </div>
          {authorImg && <AuthorAvatar src={authorImg.src} name={authorImg.name} sizeClass="w-10 h-10 sm:w-12 sm:h-12" />}
        </h2>
      );
    }
    // Headings H3
    else if (trimmed.startsWith('### ')) {
      const h3Text = trimmed.replace('### ', '');
      const isH3Ar = checkLineIsArabic(h3Text, isOverallArabic, forceLtr, forceRtl);
      const authorImg = getAuthorImage(h3Text);

      elements.push(
        <h3 key={`h3-${index}`} data-line-idx={index} dir={isH3Ar ? 'rtl' : 'ltr'} className={`text-base sm:text-lg font-extrabold text-[#1a2e2a] mt-5 mb-2 flex items-center justify-between gap-2 ${isH3Ar ? 'text-right font-arabic' : 'text-left'}`}>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-1.5 h-4 bg-[#03594e] rounded-full inline-block shrink-0"></span>
            <span>{renderTextWithMatrices(h3Text, getLineHighlights(index, h3Text))}</span>
          </div>
          {authorImg && <AuthorAvatar src={authorImg.src} name={authorImg.name} sizeClass="w-8 h-8 sm:w-10 sm:h-10" />}
        </h3>
      );
    }
    // Headings H4
    else if (trimmed.startsWith('#### ')) {
      const h4Text = trimmed.replace('#### ', '');
      const isH4Ar = checkLineIsArabic(h4Text, isOverallArabic, forceLtr, forceRtl);
      elements.push(
        <h4 key={`h4-${index}`} data-line-idx={index} dir={isH4Ar ? 'rtl' : 'ltr'} className={`text-sm sm:text-base font-bold text-[#1a2e2a] mt-4 mb-1.5 flex items-center gap-1.5 ${isH4Ar ? 'text-right font-arabic' : 'text-left'}`}>
          <span className="w-1.5 h-3 bg-[#F8C62F] rounded-full inline-block shrink-0"></span>
          <span>{renderTextWithMatrices(h4Text, getLineHighlights(index, h4Text))}</span>
        </h4>
      );
    }
    // Headings H5
    else if (trimmed.startsWith('##### ')) {
      const h5Text = trimmed.replace('##### ', '');
      const isH5Ar = checkLineIsArabic(h5Text, isOverallArabic, forceLtr, forceRtl);
      elements.push(
        <h5 key={`h5-${index}`} data-line-idx={index} dir={isH5Ar ? 'rtl' : 'ltr'} className={`text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350 mt-3.5 mb-1 ${isH5Ar ? 'text-right font-arabic' : 'text-left'}`}>
          <span>{renderTextWithMatrices(h5Text, getLineHighlights(index, h5Text))}</span>
        </h5>
      );
    }
    // Headings H6
    else if (trimmed.startsWith('###### ')) {
      const h6Text = trimmed.replace('###### ', '');
      const isH6Ar = checkLineIsArabic(h6Text, isOverallArabic, forceLtr, forceRtl);
      elements.push(
        <h6 key={`h6-${index}`} data-line-idx={index} dir={isH6Ar ? 'rtl' : 'ltr'} className={`text-xs font-medium text-slate-600 dark:text-slate-400 mt-3 mb-1 uppercase tracking-wider ${isH6Ar ? 'text-right font-arabic' : 'text-left'}`}>
          <span>{renderTextWithMatrices(h6Text, getLineHighlights(index, h6Text))}</span>
        </h6>
      );
    }
    // Bullet lists
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.substring(2);
      const isLiAr = checkLineIsArabic(text, isOverallArabic, forceLtr, forceRtl);
      elements.push(
        <div key={`li-${index}`} data-line-idx={index} dir={isLiAr ? 'rtl' : 'ltr'} className={`flex items-start gap-3 my-2 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed pl-2 ${isLiAr ? 'text-right font-arabic' : 'text-left'}`}>
          <div className="w-2 h-2 rounded-full bg-[#03594e] mt-2 shrink-0 shadow-xs"></div>
          <div className="flex-1">{renderTextWithMatrices(text, getLineHighlights(index, text))}</div>
        </div>
      );
    }

    // Standard paragraph / block
    else {
      elements.push(
        <div key={`p-${index}`} data-line-idx={index} dir={isAr ? 'rtl' : 'ltr'} className={`text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed my-2.5 ${textDirClass}`}>
          {renderTextWithMatrices(trimmed, getLineHighlights(index, trimmed))}
        </div>
      );
    }
  });

  flushTable('end');
  flushBlockquote('end');

  return <div className="space-y-1">{elements}</div>;
};

export default MarkdownViewer;
