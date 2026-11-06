import React, { useState, useEffect } from 'react';
import { Character, GameMessage, QuickAnswer, RoomDocument } from '../../types/game';
import { CharacterCard } from './CharacterCard';
import { SecretCard } from './SecretCard';
import { SelectSecretModal } from './SelectSecretModal';
import { DeckCustomizer } from '../lobby/DeckCustomizer';
import { ChatBox } from '../gameplay/ChatBox';
import { TurnIndicator } from '../gameplay/TurnIndicator';
import { GuessModal } from '../gameplay/GuessModal';

interface GameBoardProps {
  characters: Character[];
  secretCharacter: Character;
  room?: RoomDocument | null;
  myPlayerId?: string | null;
  messages?: GameMessage[];
  onSelectSecretCharacter: (character: Character) => void;
  onRandomSecretCharacter: () => void;
  onReplaceCharacter: (newChar: Character, replaceId: string) => void;
  onSendMessage?: (content: string, type: 'question' | 'answer' | 'guess', quickAnswer?: QuickAnswer) => void;
  onGuessOpponent?: (character: Character) => void;
  onLeaveRoom?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  characters,
  secretCharacter,
  room,
  myPlayerId,
  messages = [],
  onSelectSecretCharacter,
  onRandomSecretCharacter,
  onReplaceCharacter,
  onSendMessage,
  onGuessOpponent,
  onLeaveRoom,
}) => {
  // Estado local para cartas volteadas/descartadas: { [characterId]: boolean }
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  // Modales
  const [isSelectSecretOpen, setIsSelectSecretOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(true);

  // Detectar ganador y jugadores
  const isFinished = room?.status === 'finished';
  const winnerId = room?.winnerId;
  const isWinner = isFinished && !!winnerId && winnerId === myPlayerId;
  const isP1 = myPlayerId === room?.players.player1?.id;
  const myPlayer = isP1 ? room?.players.player1 : room?.players.player2;
  const opponent = isP1 ? room?.players.player2 : room?.players.player1;
  const winnerName = winnerId === room?.players.player1?.id
    ? room?.players.player1?.name
    : room?.players.player2?.name;

  const lastMsg = messages[messages.length - 1];

  // Si la partida finaliza, abrir automáticamente el modal de ganador
  useEffect(() => {
    if (isFinished && winnerId) {
      setShowWinnerModal(true);
    }
  }, [isFinished, winnerId]);

  // Alternar volteo de una carta
  const handleToggleCard = (characterId: string) => {
    setFlippedMap((prev) => ({
      ...prev,
      [characterId]: !prev[characterId],
    }));
  };

  // Restablecer todas las cartas
  const handleResetBoard = () => {
    setFlippedMap({});
  };

  const totalCards = characters.length;
  const flippedCount = Object.values(flippedMap).filter(Boolean).length;
  const activeCount = totalCards - flippedCount;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      <div className="px-3 sm:px-6 xl:px-10 2xl:px-16 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Encabezado Mágico y Barra de Controles */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-600/30 bg-stone-900/80 p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-bounce">🪄</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-amber-300 drop-shadow">
                  Adivina Quién • Harry Potter
                </h1>
                {room?.code && (
                  <span className="rounded-lg border border-amber-500/50 bg-stone-950 px-2 py-0.5 font-mono text-xs font-bold text-amber-400">
                    Sala: {room.code}
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-300">
                Interroga por turnos, deduce y voltea cartas para descubrir la identidad secreta del oponente.
              </p>
            </div>
          </div>

          {/* Estadísticas de Cartas y Botones de Acción */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Contador de sospechosos */}
            <div className="flex items-center space-x-2 rounded-xl border border-amber-500/40 bg-stone-950 px-3.5 py-1.5 shadow-inner">
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Activos:
              </span>
              <span className="text-base font-serif font-black text-amber-400">
                {activeCount}
              </span>
              <span className="text-xs text-stone-500">/ {totalCards}</span>
            </div>

            {/* Botón para Reemplazar Tarjeta manteniendo el tamaño del tablero */}
            <button
              onClick={() => setIsReplaceModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-600/70 bg-gradient-to-r from-amber-950/80 to-stone-900 px-3 py-2 text-xs font-serif font-bold text-amber-200 transition-all hover:border-amber-400 hover:text-white active:scale-95 shadow-md"
              title="Reemplaza un personaje del tablero manteniendo el mismo tamaño de cuadrícula"
            >
              <span>🔄</span>
              <span>Reemplazar Tarjeta</span>
            </button>

            {/* Botón de restablecer cartas volteadas */}
            <button
              onClick={handleResetBoard}
              className="rounded-xl border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-serif font-bold text-stone-300 transition-all hover:border-amber-500 hover:text-amber-200 active:scale-95 shadow-md"
              title="Voltear todas las cartas hacia arriba"
            >
              🔄 Restablecer
            </button>

            {/* Botón Salir de la Sala */}
            {onLeaveRoom && (
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-rose-900/60 bg-rose-950/40 px-3.5 py-2 text-xs font-serif font-bold text-rose-300 hover:border-rose-600 hover:bg-rose-900/60 hover:text-white transition-all shadow-md active:scale-95"
                title="Salir de la partida y volver al menú principal"
              >
                <span>🚪</span>
                <span>Salir</span>
              </button>
            )}
          </div>
        </header>

        {/* Banner de Ganador Permanente o Turno en Tiempo Real */}
        {isFinished && winnerId ? (
          <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 p-4 sm:p-5 shadow-2xl shadow-amber-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-amber-400 bg-amber-500/20 text-3xl shadow-lg">
                  👑
                </div>
                <div>
                  <span className="text-xs uppercase font-serif font-black tracking-widest text-amber-400">
                    ¡Partida Finalizada!
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-200">
                    GANADOR: <span className="text-amber-300 uppercase">{winnerName || 'Jugador'}</span>
                  </h2>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    {isWinner
                      ? '¡Felicitaciones! Has descubierto la identidad secreta del rival.'
                      : `${winnerName || 'Tu oponente'} ha ganado la partida.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowWinnerModal(true)}
                  className="rounded-xl border border-amber-500/80 bg-amber-500/10 px-4 py-2 text-xs font-serif font-bold text-amber-300 hover:bg-amber-500/20 transition-all shadow-md active:scale-95"
                >
                  🏆 Ver Anuncio
                </button>
                {onLeaveRoom && (
                  <button
                    onClick={onLeaveRoom}
                    className="rounded-xl border border-rose-600 bg-rose-950/80 px-4 py-2 text-xs font-serif font-bold text-rose-200 hover:bg-rose-900 transition-all shadow-md active:scale-95"
                  >
                    🚪 Menú Principal
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          room && myPlayerId && (
            <TurnIndicator
              currentTurnPlayerId={room.currentTurnPlayerId}
              myPlayerId={myPlayerId}
              player1={room.players.player1}
              player2={room.players.player2}
              lastMessageType={lastMsg?.type}
              onGuessClick={() => setIsGuessModalOpen(true)}
            />
          )
        )}

        {/* Layout Principal: Tablero + Panel Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_480px] gap-6 items-start">
          {/* CUADRÍCULA DE CARTAS */}
          <main>
            <div className="rounded-2xl border border-amber-900/30 bg-stone-900/40 p-4 sm:p-5 shadow-2xl backdrop-blur-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                {characters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isFlipped={!!flippedMap[character.id]}
                    onToggle={() => handleToggleCard(character.id)}
                  />
                ))}
              </div>
            </div>
          </main>

          {/* PANEL LATERAL: CARTA SECRETA + INTERROGATORIO (CHAT) — sticky en desktop */}
          <aside className="lg:sticky lg:top-4 w-full space-y-5">
            {/* Tarjeta del Personaje Secreto Asignado */}
            <SecretCard
              character={secretCharacter}
              onChangeCharacterClick={() => setIsSelectSecretOpen(true)}
            />

            {/* Interrogatorio y Chat con Respeto de Turnos Estricto */}
            <ChatBox
              messages={messages}
              onSendMessage={onSendMessage || (() => {})}
              currentPlayerName={myPlayer?.name || 'Tú'}
              currentTurnPlayerId={room?.currentTurnPlayerId}
              myPlayerId={myPlayerId}
              opponentName={opponent?.name}
              isGameFinished={isFinished}
            />
          </aside>
        </div>
      </div>

      {/* MODAL GIGANTE DE GANADOR EN PANTALLA */}
      {isFinished && winnerId && showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.35)]">
            {/* Botón cerrar para inspeccionar el tablero */}
            <button
              onClick={() => setShowWinnerModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700 bg-stone-900/80 text-stone-400 hover:border-amber-500 hover:text-amber-200 transition-colors"
              title="Cerrar para ver el tablero final"
            >
              ✕
            </button>

            {/* Ícono animado de trofeo */}
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-500/20 text-5xl shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce">
              🏆
            </div>

            {/* Título de Fin de Partida */}
            <h2 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-wider text-amber-300 drop-shadow">
              {isWinner ? '¡Victoria Mágica!' : '¡Partida Finalizada!'}
            </h2>

            {/* RECUADRO GIGANTE DEL GANADOR CON EL USERNAME */}
            <div className="my-6 rounded-2xl border-2 border-amber-500/80 bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 p-5 sm:p-6 shadow-inner">
              <span className="text-xs sm:text-sm font-serif font-black uppercase tracking-widest text-amber-400/90 block mb-1">
                👑 GANADOR
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-amber-200 tracking-wide uppercase drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)] break-words">
                {winnerName || 'Jugador'}
              </div>
              {isWinner ? (
                <p className="mt-2 text-xs sm:text-sm text-emerald-300 font-serif font-semibold">
                  ¡Felicitaciones! Has descubierto la identidad secreta del rival.
                </p>
              ) : (
                <p className="mt-2 text-xs sm:text-sm text-stone-400 font-serif">
                  {winnerName} ha descubierto la identidad secreta y se corona campeón.
                </p>
              )}
            </div>

            {/* Detalle o último mensaje del sistema */}
            {lastMsg?.type === 'system' && (
              <div className="mb-6 rounded-xl border border-stone-800 bg-stone-900/70 p-3 text-xs sm:text-sm font-serif text-stone-300">
                {lastMsg.content}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => setShowWinnerModal(false)}
                className="rounded-xl border border-stone-700 bg-stone-900 px-5 py-2.5 text-xs sm:text-sm font-serif text-stone-300 hover:border-amber-500 hover:text-amber-200 transition-all"
              >
                🔍 Ver Tablero Final
              </button>

              {onLeaveRoom && (
                <button
                  onClick={onLeaveRoom}
                  className="rounded-xl border border-amber-500 bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-2.5 text-xs sm:text-sm font-serif font-black text-amber-950 hover:from-amber-400 hover:to-amber-500 hover:text-stone-950 transition-all shadow-lg shadow-amber-600/30 active:scale-95"
                >
                  🚪 Volver al Menú Principal
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Selector Manual de Personaje Secreto */}
      <SelectSecretModal
        isOpen={isSelectSecretOpen}
        onClose={() => setIsSelectSecretOpen(false)}
        characters={characters}
        currentSecretId={secretCharacter.id}
        onSelectCharacter={onSelectSecretCharacter}
        onSelectRandom={onRandomSecretCharacter}
      />

      {/* MODAL: Reemplazar Tarjeta del Tablero */}
      <DeckCustomizer
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        onReplaceCharacter={onReplaceCharacter}
        existingCharacters={characters}
      />

      {/* MODAL: Adivinar Personaje Rival */}
      <GuessModal
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        characters={characters}
        onConfirmGuess={(char) => {
          if (onGuessOpponent) {
            onGuessOpponent(char);
          }
        }}
      />

      {/* MODAL: Confirmación de Salir de la Sala */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border-2 border-rose-600/70 bg-stone-950 p-6 text-center shadow-2xl shadow-rose-950/80">
            <span className="text-4xl block mb-2">🚪</span>
            <h3 className="text-base font-serif font-bold text-amber-200">
              ¿Deseas salir de la sala?
            </h3>
            <p className="mt-2 text-xs text-stone-400">
              Si sales ahora se cancelará la partida actual y volverás a la página principal de temáticas.
            </p>
            <div className="mt-5 flex gap-3 justify-center">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-serif text-stone-300 hover:text-white"
              >
                Continuar Jugando
              </button>
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  if (onLeaveRoom) onLeaveRoom();
                }}
                className="rounded-xl border border-rose-600 bg-rose-900/90 px-4 py-2 text-xs font-serif font-bold text-rose-100 hover:bg-rose-800 transition-all shadow-md active:scale-95"
              >
                Sí, Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
