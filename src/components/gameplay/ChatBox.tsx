import React, { useState, useRef, useEffect } from 'react';
import { GameMessage, QuickAnswer } from '../../types/game';
import { QuickAnswerBar } from './QuickAnswerBar';

interface ChatBoxProps {
  messages: GameMessage[];
  onSendMessage: (content: string, type: 'question' | 'answer' | 'guess', quickAnswer?: QuickAnswer) => void;
  currentPlayerName?: string;
  currentTurnPlayerId?: string | null;
  myPlayerId?: string | null;
  opponentName?: string;
  isGameFinished?: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  currentPlayerName = 'Tú',
  currentTurnPlayerId,
  myPlayerId,
  opponentName = 'tu oponente',
  isGameFinished = false,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al recibir nuevos mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Lógica de turnos para el chat
  const isMyTurn = !!myPlayerId && currentTurnPlayerId === myPlayerId;
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const isWaitingForAnswer = lastMsg?.type === 'question';
  const isMyQuestionWaiting = isWaitingForAnswer && lastMsg?.senderId === myPlayerId;
  const isOpponentQuestionWaiting = isWaitingForAnswer && lastMsg?.senderId !== myPlayerId;

  // Solo se puede preguntar si es mi turno, no ha terminado la partida y no hay una pregunta pendiente
  const canAsk = !isGameFinished && isMyTurn && !isWaitingForAnswer;

  // Solo se puede responder con Sí/No si es mi turno y hay una pregunta pendiente del rival
  const canAnswer = !isGameFinished && isMyTurn && isOpponentQuestionWaiting;

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAsk) return;
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed, 'question');
    setInputText('');
  };

  const handleQuickAnswer = (answer: QuickAnswer) => {
    if (!canAnswer) return;
    const textMap: Record<QuickAnswer, string> = {
      yes: '¡Sí!',
      no: '¡No!',
      not_applicable: 'No aplica o se desconoce',
    };

    onSendMessage(textMap[answer], 'answer', answer);
  };

  // Determinar placeholder dinámico
  let inputPlaceholder = 'Formula tu pregunta (ej: ¿Tiene barba?)...';
  if (isGameFinished) {
    inputPlaceholder = 'Partida finalizada.';
  } else if (isMyQuestionWaiting) {
    inputPlaceholder = `Esperando respuesta de ${opponentName}...`;
  } else if (isOpponentQuestionWaiting && isMyTurn) {
    inputPlaceholder = 'Responde a la pregunta pendiente con los botones de abajo...';
  } else if (!isMyTurn) {
    inputPlaceholder = `Turno de ${opponentName}. Espera tu turno...`;
  }

  // Sugerencias rápidas temáticas de Harry Potter
  const suggestions = [
    '¿Usa lentes?',
    '¿Es de Gryffindor?',
    '¿Es un profesor?',
    '¿Tiene cabello rubio o pelirrojo?',
  ];

  return (
    <div className="flex flex-col h-[480px] xl:h-[560px] 2xl:h-[640px] rounded-2xl border border-amber-900/40 bg-stone-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Encabezado del Chat */}
      <div className="flex items-center justify-between border-b border-amber-800/40 bg-stone-950/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xl">🦩</span>
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold uppercase tracking-wider text-amber-200">
              Interrogatorio Mágico
            </h3>
            <p className="text-xs text-stone-300 font-sans">
              Preguntas por turnos y respuestas de deducción
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-950/80 px-2.5 py-1 text-xs font-mono text-amber-400 border border-amber-800/50">
          {messages.length} msgs
        </span>
      </div>

      {/* Feed de Mensajes con Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 py-8">
            <span className="text-4xl mb-3 opacity-60">📜</span>
            <p className="text-sm font-serif text-stone-300">Aún no se han formulado preguntas.</p>
            <p className="text-xs text-stone-400 mt-1.5 max-w-[240px]">
              Escribe una pregunta abajo o elige una sugerencia para comenzar la deducción.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderName === currentPlayerName || msg.senderName === 'Tú';

            // Estilos según el tipo de mensaje
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block rounded-full bg-stone-950/90 px-3 py-1 text-[10px] font-serif text-amber-400/90 border border-amber-900/40">
                    ⚡ {msg.content}
                  </span>
                </div>
              );
            }

            if (msg.type === 'answer') {
              const bgColors: Record<string, string> = {
                yes: 'bg-emerald-950/80 border-emerald-600/70 text-emerald-200',
                no: 'bg-rose-950/80 border-rose-600/70 text-rose-200',
                not_applicable: 'bg-amber-950/80 border-amber-600/70 text-amber-200',
              };

              const badgeColor = msg.quickAnswer
                ? bgColors[msg.quickAnswer] || 'bg-stone-800 border-stone-600 text-stone-200'
                : 'bg-stone-800 border-stone-600 text-stone-200';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-xs text-stone-300 mb-1 px-1 font-serif">
                    {msg.senderName} respondió:
                  </span>
                  <div
                    className={`rounded-2xl border px-4 py-2.5 text-sm font-serif font-bold shadow-md ${badgeColor}`}
                  >
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            }

            // Pregunta habitual
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs text-stone-300 mb-1 px-1 font-serif">
                  {msg.senderName}:
                </span>
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 text-sm shadow-md border ${
                    isMe
                      ? 'bg-gradient-to-r from-amber-900/80 to-stone-900 border-amber-600/60 text-amber-100 rounded-tr-none'
                      : 'bg-stone-950 border-stone-800 text-stone-200 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Sugerencias Rápidas de Preguntas */}
      <div className="border-t border-stone-800/80 bg-stone-950/60 px-3 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs text-amber-400 font-serif whitespace-nowrap">💡 Ideas:</span>
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              disabled={!canAsk}
              onClick={() => setInputText(sug)}
              className="rounded-full border border-stone-700/60 bg-stone-900/80 px-3 py-1 text-xs text-stone-200 hover:border-amber-500 hover:text-amber-200 whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Input para redactar pregunta y Barra de Respuestas Rápidas */}
      <div className="border-t border-amber-900/40 bg-stone-950/90 p-3.5 space-y-2.5">
        {/* Tira informativa de turno */}
        <div className="flex items-center justify-between px-1 text-[11px] font-serif">
          {canAsk ? (
            <span className="text-amber-300 font-bold flex items-center gap-1.5 animate-pulse">
              <span>🪄</span>
              <span>Es tu turno de preguntar. Escribe abajo o elige una idea:</span>
            </span>
          ) : canAnswer ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
              <span>⚡</span>
              <span>¡{lastMsg?.senderName || 'Tu rival'} preguntó! Responde abajo con Sí o No:</span>
            </span>
          ) : isMyQuestionWaiting ? (
            <span className="text-stone-400 flex items-center gap-1.5">
              <span>⏳</span>
              <span>Pregunta enviada. Esperando respuesta de {opponentName}...</span>
            </span>
          ) : isGameFinished ? (
            <span className="text-amber-400/80 font-bold flex items-center gap-1.5">
              <span>🏆</span>
              <span>Partida concluida.</span>
            </span>
          ) : (
            <span className="text-stone-400 flex items-center gap-1.5">
              <span>⏳</span>
              <span>Turno de {opponentName}. Espera tu turno para preguntar...</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            disabled={!canAsk}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={inputPlaceholder}
            className="flex-1 rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 disabled:bg-stone-950 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!canAsk || !inputText.trim()}
            className="rounded-xl border border-amber-600/80 bg-gradient-to-b from-amber-800 to-stone-900 px-5 py-2.5 text-sm font-serif font-bold text-amber-200 shadow-md transition-all hover:border-amber-400 hover:from-amber-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            Preguntar
          </button>
        </form>

        {/* Botones Sí, No, No aplica para responder a la última pregunta */}
        <QuickAnswerBar onAnswer={handleQuickAnswer} disabled={!canAnswer} />
      </div>
    </div>
  );
};
