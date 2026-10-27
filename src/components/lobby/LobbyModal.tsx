import React, { useState } from 'react';
import { RoomDocument } from '../../types/game';

interface LobbyModalProps {
  isOpen: boolean;
  onCreateRoom: (hostName: string) => Promise<void>;
  onJoinRoom: (roomCode: string, playerName: string) => Promise<void>;
  onStartGame: () => Promise<void>;
  onLeaveRoom?: () => Promise<void>;
  room: RoomDocument | null;
  myPlayerId: string | null;
  loading: boolean;
}

export const LobbyModal: React.FC<LobbyModalProps> = ({
  isOpen,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
  onLeaveRoom,
  room,
  myPlayerId,
  loading,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const isHost = room?.players.player1?.id === myPlayerId;
  const isWaitingRoom = room && (room.status === 'waiting' || room.status === 'ready');

  const handleCopyCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setLocalError('Por favor ingresa tu nombre de mago o bruja.');
      return;
    }
    setLocalError('');
    try {
      await onCreateRoom(playerName.trim());
    } catch (err: any) {
      setLocalError(err.message || 'Error al crear la sala');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setLocalError('Por favor ingresa tu nombre.');
      return;
    }
    if (!roomCodeInput.trim()) {
      setLocalError('Por favor ingresa el código de la sala.');
      return;
    }
    setLocalError('');
    try {
      await onJoinRoom(roomCodeInput.trim(), playerName.trim());
    } catch (err: any) {
      setLocalError(err.message || 'Error al unirse a la sala');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-600/80 bg-stone-950 p-6 sm:p-8 shadow-2xl shadow-amber-950/80">
        {/* Encabezado Mágico */}
        <div className="text-center pb-4 border-b border-amber-800/40">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/50 bg-stone-900 shadow-inner mb-2 text-3xl">
            🏰
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wider text-amber-200">
            Adivina Quién Online
          </h1>
          <p className="text-xs text-amber-400/80 font-serif italic mt-0.5">
            Duelo de Magos y Brujas en Tiempo Real
          </p>
        </div>

        {/* Mensaje de Error */}
        {localError && (
          <div className="mt-4 rounded-xl border border-rose-600/60 bg-rose-950/70 p-3 text-xs text-rose-200 font-serif text-center">
            ⚠️ {localError}
          </div>
        )}

        {/* Si ya está en una sala esperando */}
        {isWaitingRoom ? (
          <div className="mt-6 space-y-5 text-center">
            <div className="rounded-2xl border border-amber-500/40 bg-stone-900/90 p-4 shadow-inner">
              <span className="text-[11px] uppercase tracking-widest text-stone-400 font-serif">
                Código de Acceso a la Sala:
              </span>
              <div className="my-2 flex items-center justify-center gap-3">
                <span className="font-mono text-3xl font-black text-amber-400 tracking-wider">
                  {room.code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="rounded-lg border border-amber-500/40 bg-stone-950 px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-900 hover:text-white transition-colors"
                  title="Copiar código al portapapeles"
                >
                  {copied ? '✓ ¡Copiado!' : '📋 Copiar'}
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Comparte este código con tu amigo para que se conecte desde su dispositivo.
              </p>
            </div>

            {/* Estado de los dos jugadores */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                <span className="text-stone-300 flex items-center gap-2">
                  <span className="text-amber-400">👑 Host:</span> {room.players.player1?.name}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">● Conectado</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                <span className="text-stone-300 flex items-center gap-2">
                  <span className="text-stone-400">⚔️ Rival:</span>
                  {room.players.player2?.name || (
                    <span className="italic text-stone-500 animate-pulse">Esperando rival...</span>
                  )}
                </span>
                {room.players.player2 ? (
                  <span className="text-[10px] text-emerald-400 font-mono">● Conectado</span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-mono">⏳ Pendiente</span>
                )}
              </div>
            </div>

            {/* Botón de Iniciar */}
            {isHost ? (
              <button
                disabled={!room.players.player2 || loading}
                onClick={onStartGame}
                className="w-full rounded-2xl border border-amber-500 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 py-3 text-sm font-serif font-black uppercase tracking-wider text-amber-950 shadow-xl shadow-amber-600/30 transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Preparando Sala...' : '🪄 ¡Comenzar Duelo!'}
              </button>
            ) : (
              <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-3 text-xs text-amber-300 font-serif">
                ⏳ El Anfitrión iniciará la partida en breve...
              </div>
            )}

            {/* Botón de Cancelar / Salir de la Sala */}
            {onLeaveRoom && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onLeaveRoom}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900/80 py-2.5 text-xs font-serif text-stone-400 hover:border-rose-700 hover:text-rose-300 transition-colors"
                >
                  🚪 Cancelar Sala y Volver a Temáticas
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Pestañas: Crear Sala o Unirse */
          <div className="mt-5 space-y-5">
            <div className="flex rounded-xl border border-stone-800 bg-stone-900/80 p-1">
              <button
                onClick={() => setTab('create')}
                className={`flex-1 rounded-lg py-2 text-xs font-serif font-bold transition-all ${
                  tab === 'create'
                    ? 'bg-amber-600/80 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Crear Sala
              </button>
              <button
                onClick={() => setTab('join')}
                className={`flex-1 rounded-lg py-2 text-xs font-serif font-bold transition-all ${
                  tab === 'join'
                    ? 'bg-amber-600/80 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Unirse con Código
              </button>
            </div>

            {/* Formulario de Crear Sala */}
            {tab === 'create' ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-amber-300 mb-1">
                    Tu Nombre o Apodo:
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Ej: Harry, Hermione, Ron..."
                    className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !playerName.trim()}
                  className="w-full rounded-2xl border border-amber-600 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 py-3 text-xs font-serif font-black uppercase tracking-wider text-amber-100 shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
                >
                  {loading ? 'Generando Sala...' : '✨ Crear Sala y Obtener Código'}
                </button>
              </form>
            ) : (
              /* Formulario de Unirse a Sala */
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-amber-300 mb-1">
                    Tu Nombre o Apodo:
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Ej: Draco, Ginny, Luna..."
                    className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold uppercase tracking-wider text-amber-300 mb-1">
                    Código de Acceso (6 caracteres):
                  </label>
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="Ej: HP-3891"
                    maxLength={10}
                    className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2.5 text-xs font-mono uppercase text-amber-300 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !playerName.trim() || !roomCodeInput.trim()}
                  className="w-full rounded-2xl border border-amber-600 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 py-3 text-xs font-serif font-black uppercase tracking-wider text-amber-100 shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
                >
                  {loading ? 'Conectando...' : '🚪 Entrar a la Sala'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
