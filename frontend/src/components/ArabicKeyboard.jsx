import React, { useState } from 'react';
import { Delete, X, ArrowUp } from 'lucide-react';

// Google Translate exact Arabic keyboard layout
const ROW_1 = ['ذ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
const ROW_1_SHIFT = ['ّ', '!', '"', '¥', '$', '%', '&', '/', '(', ')', '=', '؟', '+'];

const ROW_2 = ['\\', 'د', 'ج', 'ح', 'خ', 'ه', 'ع', 'غ', 'ف', 'ق', 'ث', 'ص', 'ض'];
const ROW_2_SHIFT = ['|', 'أ', 'إ', 'آ', '÷', '‘', '’', '«', '»', '؛', '`', 'ً', 'ُ'];

const ROW_3 = ['ط', 'ك', 'م', 'ن', 'ت', 'ا', 'ل', 'ب', 'ي', 'س', 'ش'];
const ROW_3_SHIFT = ['~', ':', ']', '[', 'لإ', 'لأ', 'لآ', 'ـ', 'ٍ', 'ِ', 'َ'];

const ROW_4 = ['ظ', 'ز', 'و', 'ة', 'ى', 'لا', 'ر', 'ؤ', 'ء', 'ئ'];
const ROW_4_SHIFT = ['؟', '>', '<', '،', 'أ', 'لإ', 'ر', 'ء', 'ئ', 'ش'];

const ArabicKeyboard = ({ onKeyPress, onBackspace, onClear, onClose }) => {
  const [isShift, setIsShift] = useState(false);

  const handleKeyClick = (char) => {
    onKeyPress(char);
    if (isShift) setIsShift(false); // Shift resets after 1 key press like Google Translate
  };

  const row1 = isShift ? ROW_1_SHIFT : ROW_1;
  const row2 = isShift ? ROW_2_SHIFT : ROW_2;
  const row3 = isShift ? ROW_3_SHIFT : ROW_3;
  const row4 = isShift ? ROW_4_SHIFT : ROW_4;

  return (
    <div className="relative w-full max-w-lg bg-[#ffffff] dark:bg-slate-900 border border-[#dadce0] dark:border-slate-700 shadow-2xl rounded-2xl p-3 text-slate-800 dark:text-slate-100 font-sans select-none dir-rtl animate-fade-in">
      {/* Top Header Row (Google Translate style) */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-bold text-slate-600 dark:text-slate-300 font-arabic text-sm">
          لوحة مفاتيح اللغة العربية
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Grid */}
      <div className="space-y-1.5 text-center dir-rtl font-arabic">
        {/* Row 1 */}
        <div className="flex justify-between gap-1">
          {row1.map((char, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleKeyClick(char)}
              className="flex-1 min-w-[22px] h-8 sm:h-9 bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#dadce0] dark:border-slate-700 rounded-md font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer active:scale-95 transition-all flex items-center justify-center"
            >
              {char}
            </button>
          ))}
          <button
            type="button"
            onClick={onBackspace}
            className="w-10 sm:w-12 h-8 sm:h-9 bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#dadce0] dark:border-slate-700 rounded-md font-bold text-xs text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer flex items-center justify-center active:scale-95 transition-all shrink-0"
            title="Effacer"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex justify-between gap-1">
          {row2.map((char, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleKeyClick(char)}
              className="flex-1 min-w-[22px] h-8 sm:h-9 bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#dadce0] dark:border-slate-700 rounded-md font-medium text-sm sm:text-base text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer active:scale-95 transition-all flex items-center justify-center"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex justify-between gap-1">
          {row3.map((char, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleKeyClick(char)}
              className="flex-1 min-w-[22px] h-8 sm:h-9 bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#dadce0] dark:border-slate-700 rounded-md font-medium text-sm sm:text-base text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer active:scale-95 transition-all flex items-center justify-center"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Row 4 (With Shift keys on both ends) */}
        <div className="flex justify-between gap-1 items-center">
          <button
            type="button"
            onClick={() => setIsShift(!isShift)}
            className={`w-10 sm:w-12 h-8 sm:h-9 border rounded-md font-bold text-xs shadow-2xs cursor-pointer flex items-center justify-center shrink-0 active:scale-95 transition-all ${
              isShift
                ? 'bg-[#03594e] text-white border-[#03594e]'
                : 'bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border-[#dadce0] dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Shift / التشكيل"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          {row4.map((char, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleKeyClick(char)}
              className="flex-1 min-w-[22px] h-8 sm:h-9 bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#dadce0] dark:border-slate-700 rounded-md font-medium text-sm sm:text-base text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer active:scale-95 transition-all flex items-center justify-center"
            >
              {char}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsShift(!isShift)}
            className={`w-10 sm:w-12 h-8 sm:h-9 border rounded-md font-bold text-xs shadow-2xs cursor-pointer flex items-center justify-center shrink-0 active:scale-95 transition-all ${
              isShift
                ? 'bg-[#03594e] text-white border-[#03594e]'
                : 'bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border-[#dadce0] dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Shift / التشكيل"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Row 5: Spacebar & Ctrl+Alt */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <button
            type="button"
            onClick={() => setIsShift(!isShift)}
            className="px-2 sm:px-3 h-8 sm:h-9 bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#dadce0] dark:border-slate-700 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-400 shrink-0 cursor-pointer"
          >
            Ctrl + Alt
          </button>

          <button
            type="button"
            onClick={() => handleKeyClick(' ')}
            className="flex-1 h-8 sm:h-9 bg-[#f8f9fa] hover:bg-[#e8eaed] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#dadce0] dark:border-slate-700 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer flex items-center justify-center transition-all"
          >
            مسافة
          </button>

          <button
            type="button"
            onClick={onClear}
            className="px-2 sm:px-3 h-8 sm:h-9 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-md text-[11px] font-bold shrink-0 cursor-pointer"
          >
            مسح الكل
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArabicKeyboard;
