import React, { useState } from 'react';
import { Character } from '../../types/game';

interface GuessModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onConfirmGuess: (character: Character) => void;
}

export const GuessModal: React.FC<GuessModalProps> = ({
  isOpen,
  onClose,
  characters,
  onConfirmGuess,
}) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedChar) return;
    onConfirmGuess(selectedChar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-2xl rounded-2xl border-2 border-amber-500 bg-stone-950 p-6 shadow-2xl shadow-amber-950/90">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-pulse">🔮</span>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-black uppercase tracking-wider text-amber-300">
                ¡Arriesgar Adivinanza!
              </h2>
              <p className="text-xs text-stone-400">
                Si aciertas, ganas la partida. Si fallas, cederás tu turno.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700 bg-stone-900 text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Buscador */}
        <div className="mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sospechoso a acusar..."
            className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Cuadrícula de Selección */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filtered.map((char) => {
              const isSelected = selectedChar?.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(char)}
                  className={`flex flex-col items-center rounded-xl border-2 p-2 text-center transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/60 shadow-lg shadow-amber-500/40 scale-105'
                      : 'border-stone-800 bg-stone-900/60 hover:border-amber-700'
                  }`}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-lg border border-amber-600/30 bg-stone-950">
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(char.name)}`;
                      }}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-serif font-bold text-amber-200 truncate w-full">
                    {char.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pie con Selección y Confirmación */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800 pt-4">
          <div className="text-xs text-stone-300">
            {selectedChar ? (
              <p>
                Acusar a:{' '}
                <strong className="text-amber-300 font-serif text-sm">
                  {selectedChar.name}
                </strong>
              </p>
            ) : (
              <p className="text-stone-500">Selecciona un personaje de la lista para continuar.</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-serif text-stone-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              disabled={!selectedChar}
              onClick={handleConfirm}
              className="rounded-xl border border-amber-500 bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2 text-xs font-serif font-black text-amber-950 hover:from-amber-400 hover:to-amber-500 hover:text-stone-950 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ¡Confirmar Adivinanza!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
