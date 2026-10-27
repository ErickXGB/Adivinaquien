import React, { useState } from 'react';
import { Character } from '../../types/game';

interface SelectSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  currentSecretId: string;
  onSelectCharacter: (character: Character) => void;
  onSelectRandom: () => void;
}

export const SelectSecretModal: React.FC<SelectSecretModalProps> = ({
  isOpen,
  onClose,
  characters,
  currentSecretId,
  onSelectCharacter,
  onSelectRandom,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-3xl rounded-2xl border-2 border-amber-600/70 bg-stone-950 p-5 shadow-2xl shadow-amber-950/80">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">🧙‍♂️</span>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-black uppercase tracking-wider text-amber-200">
                Elige tu Personaje Secreto
              </h2>
              <p className="text-xs text-stone-400">
                Selecciona a quién vas a defender o elige uno al azar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700 bg-stone-900 text-stone-400 hover:border-amber-500 hover:text-amber-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Buscador y Botón Aleatorio */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="flex-1 rounded-xl border border-stone-700 bg-stone-900/90 px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />

          <button
            onClick={() => {
              onSelectRandom();
              onClose();
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-600/60 bg-gradient-to-r from-amber-900/80 to-stone-900 px-4 py-2 text-xs font-serif font-bold text-amber-200 hover:border-amber-400 hover:text-white transition-all shadow-md active:scale-95"
          >
            <span>🎲</span>
            <span>Elegir al Azar</span>
          </button>
        </div>

        {/* Galería de Selección con Scroll */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {filtered.map((char) => {
              const isSelected = char.id === currentSecretId;

              return (
                <button
                  key={char.id}
                  onClick={() => {
                    onSelectCharacter(char);
                    onClose();
                  }}
                  className={`group relative flex flex-col items-center rounded-xl border-2 p-2 text-left transition-all hover:scale-105 active:scale-95 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/30'
                      : 'border-stone-800 bg-stone-900/70 hover:border-amber-600/70'
                  }`}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-lg border border-amber-500/30 bg-stone-950">
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
                  <p className="mt-2 text-center text-[11px] font-serif font-bold text-amber-200 line-clamp-1 w-full">
                    {char.name}
                  </p>
                  {isSelected && (
                    <span className="mt-1 text-[9px] uppercase tracking-wider text-amber-400 font-mono">
                      ✓ Seleccionado
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-stone-500">
              <p className="text-xs font-serif">No se encontraron personajes con &quot;{search}&quot;</p>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="mt-4 flex justify-end border-t border-stone-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-serif text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
