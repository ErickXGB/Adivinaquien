import React from 'react';
import { QuickAnswer } from '../../types/game';

interface QuickAnswerBarProps {
  onAnswer: (answer: QuickAnswer) => void;
  disabled?: boolean;
}

export const QuickAnswerBar: React.FC<QuickAnswerBarProps> = ({
  onAnswer,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2 pt-2.5 border-t border-stone-800">
      <span className="text-xs font-serif uppercase tracking-wider text-stone-300 mr-1 hidden sm:inline">
        Respuesta rápida:
      </span>

      {/* Botón SÍ */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onAnswer('yes')}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600/60 bg-gradient-to-b from-emerald-900/60 to-emerald-950/80 px-4 py-2.5 text-sm font-serif font-bold text-emerald-200 shadow-md transition-all hover:border-emerald-400 hover:from-emerald-800 hover:text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>✓</span>
        <span>Sí</span>
      </button>

      {/* Botón NO */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onAnswer('no')}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-600/60 bg-gradient-to-b from-rose-900/60 to-rose-950/80 px-4 py-2.5 text-sm font-serif font-bold text-rose-200 shadow-md transition-all hover:border-rose-400 hover:from-rose-800 hover:text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>✕</span>
        <span>No</span>
      </button>

      {/* Botón NO APLICA */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onAnswer('not_applicable')}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-600/60 bg-gradient-to-b from-amber-900/60 to-amber-950/80 px-4 py-2.5 text-sm font-serif font-bold text-amber-200 shadow-md transition-all hover:border-amber-400 hover:from-amber-800 hover:text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>~</span>
        <span className="truncate">No aplica</span>
      </button>
    </div>
  );
};
