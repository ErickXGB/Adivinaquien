import React, { useState } from 'react';
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
  onAddCharacter: (character: Character) => void;
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
  onAddCharacter,
  onSendMessage,
  onGuessOpponent,
  onLeaveRoom,
}) => {
  // Estado local para cartas volteadas/descartadas: { [characterId]: boolean }
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  // Modales
  const [isSelectSecretOpen, setIsSelectSecretOpen] = useState(false);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

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

  // Jugador actual
  const isP1 = myPlayerId === room?.players.player1?.id;
  const myPlayer = isP1 ? room?.players.player1 : room?.players.player2;
  const lastMsg = messages[messages.length - 1];

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
                Interroga, deduce y voltea cartas para descubrir la identidad secreta del oponente.
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

            {/* Botón para Añadir Personaje Personalizado */}
            <button
              onClick={() => setIsAddCustomOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-600/70 bg-gradient-to-r from-amber-950/80 to-stone-900 px-3 py-2 text-xs font-serif font-bold text-amber-200 transition-all hover:border-amber-400 hover:text-white active:scale-95 shadow-md"
              title="Añadir un nuevo personaje al mazo actual"
            >
              <span>✨</span>
              <span>Añadir Personaje</span>
            </button>

            {/* Botón de restablecer */}
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

        {/* Banner de Turno en Tiempo Real */}
        {room && myPlayerId && (
          <TurnIndicator
            currentTurnPlayerId={room.currentTurnPlayerId}
            myPlayerId={myPlayerId}
            player1={room.players.player1}
            player2={room.players.player2}
            lastMessageType={lastMsg?.type}
            onGuessClick={() => setIsGuessModalOpen(true)}
          />
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

            {/* Interrogatorio y Chat con Botones de Respuesta Rápida */}
            <ChatBox
              messages={messages}
              onSendMessage={onSendMessage || (() => {})}
              currentPlayerName={myPlayer?.name || 'Tú'}
            />
          </aside>
        </div>
      </div>

      {/* MODAL: Selector Manual de Personaje Secreto */}
      <SelectSecretModal
        isOpen={isSelectSecretOpen}
        onClose={() => setIsSelectSecretOpen(false)}
        characters={characters}
        currentSecretId={secretCharacter.id}
        onSelectCharacter={onSelectSecretCharacter}
        onSelectRandom={onRandomSecretCharacter}
      />

      {/* MODAL: Creador de Personajes Personalizados */}
      <DeckCustomizer
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAddCharacter={onAddCharacter}
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
