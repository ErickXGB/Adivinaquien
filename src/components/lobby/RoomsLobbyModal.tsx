import React, { useState } from 'react';
import { RoomDocument } from '../../types/game';

interface RoomsLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRooms: RoomDocument[];
  onJoinRoom: (roomCode: string, playerName: string) => Promise<void>;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  loading: boolean;
}

export const RoomsLobbyModal: React.FC<RoomsLobbyModalProps> = ({
  isOpen,
  onClose,
  availableRooms,
  onJoinRoom,
  playerName,
  onUpdatePlayerName,
  loading,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleJoinByCode = async (code: string) => {
    if (!playerName.trim()) {
      setError('Por favor ingresa tu nombre de jugador antes de unirte.');
      return;
    }
    if (!code.trim()) {
      setError('Ingresa un código de sala válido.');
      return;
    }
    setError('');
    try {
      await onJoinRoom(code.trim(), playerName.trim());
    } catch (err: any) {
      setError(err.message || 'Error al unirse a la sala.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-2xl rounded-3xl border-2 border-amber-600/70 bg-stone-950 p-6 shadow-2xl shadow-amber-950/80">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚔️</span>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-black uppercase tracking-wider text-amber-200">
                Salas Activas de Juego
              </h2>
              <p className="text-xs text-stone-400">
                Únete a una sala creada por otro jugador o busca por código privado.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-700 bg-stone-900 text-stone-400 hover:border-amber-500 hover:text-amber-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Nombre del Jugador */}
        <div className="mt-4 rounded-2xl border border-stone-800 bg-stone-900/60 p-3.5">
          <label className="block text-xs font-serif font-bold uppercase tracking-wider text-amber-300 mb-1">
            Tu Nombre para la partida:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => onUpdatePlayerName(e.target.value)}
            placeholder="Escribe tu nombre o apodo..."
            className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mt-3 rounded-xl border border-rose-600/60 bg-rose-950/70 p-2.5 text-xs text-rose-200 font-serif text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Unirse con Código Manual */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            placeholder="Código privado (ej: HP-3891)..."
            maxLength={10}
            className="flex-1 rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2 text-xs font-mono uppercase text-amber-300 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="button"
            disabled={loading || !manualCode.trim()}
            onClick={() => handleJoinByCode(manualCode)}
            className="rounded-xl border border-amber-600 bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-xs font-serif font-bold text-amber-100 hover:border-amber-400 hover:text-white transition-all shadow-md active:scale-95 disabled:opacity-40"
          >
            {loading ? 'Entrando...' : 'Entrar con Código'}
          </button>
        </div>

        {/* Lista de Salas en Espera */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-400 px-1 font-serif">
            <span>Partidas esperando oponente ({availableRooms.length}):</span>
            <span className="text-[10px] text-amber-400/80">● Actualizado en vivo</span>
          </div>

          {availableRooms.length === 0 ? (
            <div className="py-12 text-center text-stone-500 rounded-2xl border border-dashed border-stone-800 bg-stone-900/30">
              <span className="text-3xl block mb-2 opacity-50">🏰</span>
              <p className="text-xs font-serif text-stone-400">No hay salas esperando jugadores en este momento.</p>
              <p className="text-[11px] text-stone-500 mt-1">
                ¡Elige una temática en la pantalla principal para ser el anfitrión de una nueva sala!
              </p>
            </div>
          ) : (
            availableRooms.map((r) => {
              const hostName = r.players.player1?.name || 'Anfitrión';
              const themeName = r.deckName || 'Harry Potter';

              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-900/40 bg-stone-900/70 p-3.5 transition-all hover:border-amber-500/70 hover:bg-stone-900/90 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-amber-200">
                        Sala de {hostName}
                      </span>
                      <span className="rounded-md bg-stone-950 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-400 border border-amber-900/40">
                        {r.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1 text-stone-300">
                        <span>🏷️</span> {themeName}
                      </span>
                      <span className="text-[11px] text-emerald-400">
                        ● Esperando oponente
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinByCode(r.code)}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500 bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-xs font-serif font-black text-amber-950 hover:from-amber-400 hover:to-amber-500 hover:text-stone-950 transition-all shadow-md active:scale-95 disabled:opacity-40"
                  >
                    <span>⚔️</span>
                    <span>Unirse</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Pie */}
        <div className="mt-4 flex justify-end border-t border-stone-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-serif text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
          >
            Volver a Temáticas
          </button>
        </div>
      </div>
    </div>
  );
};
