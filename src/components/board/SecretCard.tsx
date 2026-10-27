import React, { useState } from 'react';
import { Character } from '../../types/game';

interface SecretCardProps {
  character: Character;
  onChangeCharacterClick?: () => void;
}

export const SecretCard: React.FC<SecretCardProps> = ({
  character,
  onChangeCharacterClick,
}) => {
  const [isRevealed, setIsRevealed] = useState(true);
  const [imgSrc, setImgSrc] = useState(character.imageUrl);

  // Actualizar imagen si cambia el personaje
  React.useEffect(() => {
    setImgSrc(character.imageUrl);
  }, [character]);

  const handleImageError = () => {
    setImgSrc(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(character.name)}`);
  };

  return (
    <div className="w-full rounded-2xl border-2 border-amber-500/80 bg-gradient-to-b from-stone-900 via-stone-950 to-amber-950/40 p-4 shadow-2xl shadow-amber-950/40 backdrop-blur-md">
      {/* Encabezado Mágico */}
      <div className="flex items-center justify-between border-b border-amber-600/40 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-amber-400 text-lg animate-pulse">⚡</span>
          <div>
            <h3 className="text-base font-serif font-bold uppercase tracking-wider text-amber-200">
              Tu Personaje Secreto
            </h3>
            <p className="text-xs text-amber-400 font-sans">
              ¡Defiéndelo! Tu oponente intenta adivinarlo
            </p>
          </div>
        </div>

        {/* Botones de acción del encabezado */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className="rounded-lg border border-amber-500/30 bg-stone-900/80 px-2 py-1 text-xs font-serif text-amber-300 transition-colors hover:bg-amber-950/80 hover:text-amber-100"
            title="Ocultar para evitar miradas indiscretas"
          >
            {isRevealed ? '🙈 Ocultar' : '👁️ Revelar'}
          </button>
        </div>
      </div>

      {/* Contenido de la Carta Secreta */}
      <div className="mt-4 flex flex-col items-center">
        {isRevealed ? (
          <div className="relative group w-full flex flex-col items-center rounded-xl border-2 border-amber-400/90 bg-stone-950 p-3 shadow-lg shadow-amber-500/20">
            {/* Halo Mágico Resplandeciente */}
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 opacity-30 blur group-hover:opacity-60 transition duration-500 -z-10" />

            {/* Imagen del personaje */}
            <div className="relative h-52 w-full overflow-hidden rounded-lg border border-amber-500/60 bg-stone-900">
              <img
                src={imgSrc}
                alt={character.name}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Nombre */}
            <div className="mt-3 w-full text-center">
              <p className="text-lg font-serif font-extrabold text-amber-200 tracking-wide">
                {character.name}
              </p>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">
                Identidad Oculta
              </span>
            </div>
          </div>
        ) : (
          /* Vista Oculta / Modo Privacidad */
          <div className="flex h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-600/50 bg-stone-900/70 p-4 text-center">
            <span className="text-4xl mb-3 text-amber-400">🛡️</span>
            <p className="text-sm font-serif font-semibold text-amber-300">
              Carta Protegida
            </p>
            <p className="mt-1.5 text-xs text-stone-300">
              Pulsa &quot;Revelar&quot; cuando tu oponente no esté mirando tu pantalla.
            </p>
          </div>
        )}
      </div>

      {/* Botón para cambiar o elegir manualmente */}
      {onChangeCharacterClick && (
        <div className="mt-4 pt-3 border-t border-amber-900/40 flex justify-center">
          <button
            onClick={onChangeCharacterClick}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-600/60 bg-gradient-to-r from-amber-900/60 to-stone-900 py-2.5 text-sm font-serif font-bold text-amber-200 transition-all hover:border-amber-400 hover:text-white shadow-md active:scale-95"
          >
            <span>✨</span>
            <span>Cambiar Personaje Secreto</span>
          </button>
        </div>
      )}
    </div>
  );
};
