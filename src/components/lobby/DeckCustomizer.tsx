import React, { useState } from 'react';
import { Character } from '../../types/game';

interface DeckCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharacter: (character: Character) => void;
}

export const DeckCustomizer: React.FC<DeckCustomizerProps> = ({
  isOpen,
  onClose,
  onAddCharacter,
}) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Generar URL de avatar temático automático si el usuario no tiene una foto a mano
  const handleGenerateMagicAvatar = () => {
    if (!name.trim()) {
      setError('Escribe un nombre primero para generar el avatar mágico.');
      return;
    }
    setError('');
    const generatedUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`;
    setImageUrl(generatedUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Por favor ingresa un nombre para el personaje.');
      return;
    }

    const finalImage = imageUrl.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedName)}`;

    const newChar: Character = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: trimmedName,
      imageUrl: finalImage,
    };

    onAddCharacter(newChar);
    setName('');
    setImageUrl('');
    setError('');
    onClose();
  };

  const previewImage = imageUrl.trim() || (name.trim() ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}` : 'https://images.unsplash.com/photo-1547756536-cde3673fa2e0?auto=format&fit=crop&w=400&q=80');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-amber-600/70 bg-stone-950 p-6 shadow-2xl shadow-amber-950/80">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">✨</span>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-black uppercase tracking-wider text-amber-200">
                Nuevo Personaje Personalizado
              </h2>
              <p className="text-xs text-stone-400">
                Añade tus propios magos, brujas o amigos al tablero.
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

        {/* Formulario y Vista Previa */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-600/60 bg-rose-950/60 p-2.5 text-xs text-rose-200 font-serif">
              ⚠️ {error}
            </div>
          )}

          {/* Nombre del Personaje */}
          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-amber-300 mb-1">
              Nombre del Personaje:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej: Newt Scamander, Luna Lovegood..."
              className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* URL de la Imagen */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                URL de la Foto:
              </label>
              <button
                type="button"
                onClick={handleGenerateMagicAvatar}
                className="text-[11px] text-amber-400 hover:text-amber-200 underline font-serif"
              >
                🪄 Generar Avatar Mágico
              </button>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/mifoto.jpg"
              className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Vista previa en tiempo real */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 flex items-center gap-4">
            <div className="relative h-20 w-16 overflow-hidden rounded-lg border border-amber-500/50 bg-stone-950 flex-shrink-0">
              <img
                src={previewImage}
                alt="Vista previa"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'preview')}`;
                }}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-amber-400 tracking-wider">
                Vista previa:
              </span>
              <p className="font-serif font-bold text-amber-200 text-sm">
                {name.trim() || 'Nombre del mago'}
              </p>
              <p className="text-[11px] text-stone-400">
                Se agregará de inmediato a la cuadrícula de juego.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-serif text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl border border-amber-600 bg-gradient-to-r from-amber-700 to-amber-900 px-5 py-2 text-xs font-serif font-bold text-amber-100 shadow-md transition-all hover:border-amber-400 hover:text-white active:scale-95"
            >
              Agregar al Tablero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
