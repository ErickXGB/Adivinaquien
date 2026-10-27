import React from 'react';
import { PlayerPublic } from '../../types/game';

interface TurnIndicatorProps {
  currentTurnPlayerId: string | null;
  myPlayerId: string;
  player1?: PlayerPublic;
  player2?: PlayerPublic;
  lastMessageType?: 'question' | 'answer' | 'guess' | 'system';
  onGuessClick?: () => void;
  disabled?: boolean;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentTurnPlayerId,
  myPlayerId,
  player1,
  player2,
  lastMessageType,
  onGuessClick,
  disabled = false,
}) => {
  const isMyTurn = currentTurnPlayerId === myPlayerId;
  const isP1 = myPlayerId === player1?.id;
  const opponent = isP1 ? player2 : player1;

  // Determinar la fase o mensaje específico del turno
  let turnMessage = '';
  let subMessage = '';

  if (isMyTurn) {
    if (lastMessageType === 'question') {
      turnMessage = '¡Es tu turno de responder!';
      subMessage = 'Elige una de las respuestas rápidas: Sí, No o No aplica.';
    } else {
      turnMessage = '¡Es tu turno de interrogar!';
      subMessage = 'Formula una pregunta sobre el personaje rival o atrévete a adivinar.';
    }
  } else {
    if (lastMessageType === 'question') {
      turnMessage = `Esperando respuesta de ${opponent?.name || 'tu oponente'}...`;
      subMessage = 'Preparando deducción mágica.';
    } else {
      turnMessage = `Turno de ${opponent?.name || 'tu oponente'}`;
      subMessage = 'Tu rival está formulando su pregunta de deducción...';
    }
  }

  return (
    <div
      className={`rounded-2xl border-2 p-4 shadow-xl backdrop-blur-md transition-all duration-300 ${
        isMyTurn
          ? 'border-amber-400 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-900/40 shadow-amber-500/20'
          : 'border-stone-800 bg-stone-900/80'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Jugador Actual y Estado de Turno */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl shadow-inner ${
              isMyTurn
                ? 'border-amber-400 bg-amber-500/20 text-amber-300 animate-pulse'
                : 'border-stone-700 bg-stone-800 text-stone-400'
            }`}
          >
            {isMyTurn ? '⚡' : '⏳'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  isMyTurn ? 'bg-amber-400 animate-ping' : 'bg-stone-500'
                }`}
              />
              <h2
                className={`text-base sm:text-lg font-serif font-black tracking-wide ${
                  isMyTurn ? 'text-amber-200' : 'text-stone-300'
                }`}
              >
                {turnMessage}
              </h2>
            </div>
            <p className="text-xs text-stone-400 font-sans mt-0.5">{subMessage}</p>
          </div>
        </div>

        {/* Resumen de Jugadores y Botón de Adivinar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Ficha Oponente */}
          {opponent && (
            <div className="flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-950/70 px-3 py-1.5 text-xs text-stone-400">
              <span className="font-serif font-bold text-stone-300">{opponent.name}</span>
              <span className="text-[10px] text-stone-500">
                (Descartes: {opponent.eliminatedCount})
              </span>
            </div>
          )}

          {/* Botón para Arriesgar / Adivinar Personaje */}
          {onGuessClick && (
            <button
              onClick={onGuessClick}
              disabled={disabled || !isMyTurn}
              className="flex items-center gap-2 rounded-xl border border-amber-500 bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-xs font-serif font-black text-amber-950 hover:from-amber-400 hover:to-amber-500 hover:text-stone-950 transition-all shadow-lg shadow-amber-600/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              title={isMyTurn ? 'Arriesga adivinar el personaje rival' : 'Solo puedes adivinar en tu turno'}
            >
              <span>🔮</span>
              <span>¡Adivinar Personaje!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
