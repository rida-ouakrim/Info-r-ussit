import React, { useState } from 'react';
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

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = (code || '').split('\n');

  // Detect tree diagrams (Q16, Q17) vs Algorithm Code
  const isTreeDiagram = codeLines.some(l => 
    (l.includes('/') && l.includes('\\')) || 
    l.includes('/  \\') || 
    (l.includes('A') && l.includes('B') && l.includes('C'))
  );

  return (
    <div className="my-5 rounded-2xl overflow-hidden bg-[#090d16] border border-slate-800 shadow-2xl group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f172a] border-b border-slate-800 text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          {isTreeDiagram ? (
            <>
              <span className="text-sm">🌳</span>
              <span className="font-bold text-slate-200">Arbre Binaire / Structure</span>
            </>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold text-slate-200">Algorithme / Code Source</span>
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

      {/* Body: Styled Node Pills for Trees (Q16 & Q17), Rich Syntax Highlight & Line Numbers for Algorithms */}
      {isTreeDiagram ? (
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

// Helper for Matrix rendering and **bold** / `code`
const renderTextWithMatrices = (text) => {
  if (!text) return '';

  const matrixRegex = /([A-Za-z]\s*=\s*)?[\(\[]\s*([\d\s\w\-\.,\+]+(?:\s*\/\s*[\d\s\w\-\.,\+]+)+)\s*[\)\]]/g;
  const matches = [...text.matchAll(matrixRegex)];

  if (matches.length === 0) {
    return parseInlineFormatting(text);
  }

  const elements = [];
  let lastIndex = 0;

  matches.forEach((match, idx) => {
    const fullMatch = match[0];
    const matchStart = match.index;
    const namePart = match[1] ? match[1].replace('=', '').trim() : '';
    const contentPart = match[2];

    if (matchStart > lastIndex) {
      elements.push(parseInlineFormatting(text.slice(lastIndex, matchStart)));
    }

    const rows = contentPart.split('/').map(r => r.trim().split(/\s+/).filter(Boolean));
    elements.push(
      <MatrixBlock key={`matrix-${idx}`} name={namePart} rows={rows} />
    );

    lastIndex = matchStart + fullMatch.length;
  });

  if (lastIndex < text.length) {
    elements.push(parseInlineFormatting(text.slice(lastIndex)));
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

// Helper for **bold**, `code`, and [ICON_ACCESS_QUERY]
const parseInlineFormatting = (text) => {
  if (!text) return '';

  if (text.includes('[ICON_ACCESS_QUERY]') || text.includes('⚡')) {
    const segments = text.split(/(\[ICON_ACCESS_QUERY\]|⚡)/g);
    return segments.map((seg, i) => {
      if (seg === '[ICON_ACCESS_QUERY]' || seg === '⚡') {
        return <AccessQueryIcon key={`access-icon-${i}`} />;
      }
      return parseInlineFormatting(seg);
    });
  }

  // Handle Markdown Images: ![alt](src)
  if (text.includes('![') && text.includes('](')) {
    const segments = text.split(/(!\[.*?\]\(.*?\))/g);
    return segments.map((seg, i) => {
      if (seg.startsWith('![') && seg.includes('](')) {
        const alt = seg.substring(seg.indexOf('![') + 2, seg.indexOf(']('));
        const src = seg.substring(seg.indexOf('](') + 2, seg.length - 1);
        return (
          <img 
            key={`img-${i}`} 
            src={src} 
            alt={alt} 
            className="my-4 max-w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md mx-auto block max-h-[300px] object-contain" 
          />
        );
      }
      return parseInlineFormatting(seg);
    });
  }

  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 font-mono text-xs mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

// Excel & Markdown Table Component with Sleek Grid Styling
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
    <div className="my-5 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
          <tr>
            {headerRow.map((cell, idx) => (
              <th key={idx} className="px-3 py-2.5 border-r last:border-r-0 border-slate-200 dark:border-slate-700/60 whitespace-nowrap bg-slate-200/50 dark:bg-slate-800">
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

export const MarkdownViewer = ({ content }) => {
  if (!content) return <div className="text-slate-400 dark:text-slate-500 italic p-4">Aucun contenu disponible.</div>;

  const processedContent = ensureFencedCodeBlocks(content);
  const lines = processedContent.split('\n');
  const elements = [];
  let currentCodeBlock = [];
  let inCode = false;
  let currentTableRows = [];

  const flushTable = (keyIndex) => {
    if (currentTableRows.length > 0) {
      elements.push(<TableBlock key={`table-${keyIndex}`} rows={[...currentTableRows]} />);
      currentTableRows = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      flushTable(index);
      if (inCode) {
        elements.push(<CodeBlock key={`code-${index}`} code={currentCodeBlock.join('\n')} />);
        currentCodeBlock = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }

    if (inCode) {
      currentCodeBlock.push(line);
      return;
    }

    const trimmed = line.trim();

    // Check for Markdown Table Rows
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      currentTableRows.push(trimmed);
      return;
    } else {
      flushTable(index);
    }

    if (!trimmed) {
      elements.push(<div key={`empty-${index}`} className="h-2"></div>);
      return;
    }

    // Headings H1
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${index}`} className="text-2xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span className="w-2 h-7 bg-sky-500 rounded-full inline-block shrink-0"></span>
          <span>{trimmed.replace('# ', '')}</span>
        </h1>
      );
    } 
    // Headings H2
    else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl font-bold text-sky-700 dark:text-sky-400 mt-6 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block shrink-0"></span>
          <span>{trimmed.replace('## ', '')}</span>
        </h2>
      );
    } 
    // Headings H3
    else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-5 mb-2">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } 
    // Bullet lists
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.substring(2);
      elements.push(
        <div key={`li-${index}`} className="flex items-start gap-3 my-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-2">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 mt-2 shrink-0"></div>
          <div>{renderTextWithMatrices(text)}</div>
        </div>
      );
    }
    // Blockquotes / Callouts
    else if (trimmed.startsWith('> ')) {
      const text = trimmed.replace('> ', '');
      elements.push(
        <div key={`quote-${index}`} className="my-5 p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-500/10 border-l-4 border-sky-500 text-sky-900 dark:text-sky-200 text-sm flex items-start gap-3 shadow-sm">
          <Lightbulb className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">{renderTextWithMatrices(text)}</div>
        </div>
      );
    }
    // Standard paragraph / block
    else {
      elements.push(
        <div key={`p-${index}`} className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed my-2.5">
          {renderTextWithMatrices(trimmed)}
        </div>
      );
    }
  });

  flushTable('end');

  return <div className="space-y-1">{elements}</div>;
};

export default MarkdownViewer;
