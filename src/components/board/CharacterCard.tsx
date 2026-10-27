import React, { useState } from 'react';
import { Character } from '../../types/game';

interface CharacterCardProps {
  character: Character;
  isFlipped: boolean;
  onToggle: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFlipped,
  onToggle,
}) => {
  const [imgSrc, setImgSrc] = useState(character.imageUrl);

  // Fallback en caso de que alguna URL externa no cargue
  const handleImageError = () => {
    setImgSrc(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(character.name)}`);
  };

  return (
    <div
      onClick={onToggle}
      className="group relative h-48 sm:h-56 xl:h-64 2xl:h-72 w-full cursor-pointer select-none [perspective:1000px]"
      title={`${character.name} - Clic para ${isFlipped ? 'restaurar' : 'descartar'}`}
    >
      {/* Contenedor con efecto 3D flip */}
      <div
        className={`relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] shadow-lg ${
          isFlipped ? '[transform:rotateY(180deg)]' : 'hover:-translate-y-1 hover:shadow-amber-500/20'
        }`}
      >
        {/* CARA FRONTAL (Activa / Arriba) */}
        <div className="absolute inset-0 h-full w-full rounded-xl border-2 border-amber-600/70 bg-gradient-to-b from-stone-900 via-neutral-900 to-amber-950/80 p-2 [backface-visibility:hidden] flex flex-col items-center justify-between shadow-inner">
          {/* Adorno superior estilo Hogwarts */}
          <div className="flex w-full items-center justify-between px-1 text-[10px] uppercase tracking-widest text-amber-400/80 font-serif">
            <span>✦</span>
            <span className="truncate px-1 font-semibold">{character.name}</span>
            <span>✦</span>
          </div>

          {/* Marco de Imagen */}
          <div className="relative mt-1 h-32 sm:h-36 xl:h-44 2xl:h-52 w-full overflow-hidden rounded-lg border border-amber-500/40 bg-stone-950/70 shadow-md">
            <img
              src={imgSrc}
              alt={character.name}
              onError={handleImageError}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
            {/* Viñeta mágica sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Pie de carta con nombre enmarcado */}
          <div className="mt-1 flex w-full items-center justify-center rounded bg-stone-950/80 py-1 px-1 border border-amber-900/40">
            <p className="truncate text-xs font-serif font-bold text-amber-200 tracking-wide text-center">
              {character.name}
            </p>
          </div>
        </div>

        {/* CARA TRASERA (Volteada / Descartada) */}
        <div className="absolute inset-0 h-full w-full rounded-xl border-2 border-stone-800 bg-gradient-to-br from-stone-950 via-zinc-900 to-stone-900 p-2 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center text-center opacity-85 shadow-inner">
          {/* Patrón místico de carta descartada */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-700 bg-stone-900/90 text-stone-500 shadow-inner mb-2">
            <span className="text-xl font-serif text-stone-600">✕</span>
          </div>

          <p className="line-through text-xs font-serif font-bold text-stone-400 tracking-wider px-2">
            {character.name}
          </p>

          <span className="mt-2 inline-block rounded-full bg-stone-800/80 px-2 py-0.5 text-[9px] uppercase tracking-widest text-stone-400 border border-stone-700/60 font-mono">
            Descartado
          </span>
        </div>
      </div>
    </div>
  );
};
