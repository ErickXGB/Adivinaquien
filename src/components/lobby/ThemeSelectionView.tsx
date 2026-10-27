import React, { useState } from 'react';
import { AVAILABLE_THEMES, ThemeMetadata } from '../../data/allDecks';

interface ThemeSelectionViewProps {
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onSelectTheme: (theme: ThemeMetadata) => void;
  onOpenRoomsLobby: () => void;
  availableRoomsCount: number;
  loading: boolean;
}

export const ThemeSelectionView: React.FC<ThemeSelectionViewProps> = ({
  playerName,
  onUpdatePlayerName,
  onSelectTheme,
  onOpenRoomsLobby,
  availableRoomsCount,
  loading,
}) => {
  const [nameError, setNameError] = useState('');

  const handleCardClick = (theme: ThemeMetadata) => {
    if (!playerName.trim()) {
      setNameError('¡Por favor ingresa tu nombre de jugador antes de elegir una temática!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setNameError('');
    onSelectTheme(theme);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Barra de Navegación Superior */}
      <nav className="sticky top-0 z-40 border-b border-amber-900/40 bg-stone-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">🎭</span>
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-black tracking-wide text-amber-300">
                Adivina Quién Online
              </h1>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Juego de deducción multijugador en tiempo real
              </p>
            </div>
          </div>

          {/* Esquina Superior Derecha: Botón de Salas Activas + Input de Nombre */}
          <div className="flex items-center gap-3">
            {/* Input de Nombre Rápido */}
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900/80 px-3 py-1.5">
              <span className="text-xs text-amber-400 font-serif">👤 Jugador:</span>
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  onUpdatePlayerName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="Tu apodo..."
                className="w-28 sm:w-36 bg-transparent text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
              />
            </div>

            {/* BOTÓN SALAS DESTACADO (ESQUINA SUPERIOR DERECHA) */}
            <button
              onClick={onOpenRoomsLobby}
              className="relative flex items-center gap-2 rounded-xl border border-amber-500 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 px-3.5 sm:px-4 py-2 text-xs font-serif font-black uppercase tracking-wider text-amber-950 shadow-lg shadow-amber-600/30 transition-all hover:brightness-110 active:scale-95"
              title="Ver todas las salas esperando jugador"
            >
              <span>⚔️</span>
              <span>Salas de Juego</span>
              {availableRoomsCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-950 text-[10px] font-mono font-bold text-amber-400 border border-amber-400/80 animate-bounce">
                  {availableRoomsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 pb-4 text-center">
        <span className="inline-block rounded-full bg-amber-950/70 border border-amber-600/40 px-3.5 py-1 text-xs font-serif font-semibold text-amber-300 mb-3 shadow-inner">
          ✦ Selecciona una Temática para Crear tu Sala Automáticamente ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow">
          Elige el Tablero de tu Partida
        </h2>
        <p className="mt-2 text-sm text-stone-400 max-w-xl mx-auto">
          Al hacer clic sobre cualquier temática se generará de inmediato tu sala con 24 tarjetas listas para jugar.
        </p>

        {/* Input móvil para nombre */}
        <div className="mt-5 md:hidden max-w-xs mx-auto">
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              onUpdatePlayerName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Ingresa tu nombre para jugar..."
            className="w-full rounded-xl border border-amber-600/60 bg-stone-900/90 px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 text-center focus:border-amber-400 focus:outline-none"
          />
        </div>

        {nameError && (
          <div className="mt-3 inline-block rounded-xl border border-rose-600/70 bg-rose-950/80 px-4 py-2 text-xs text-rose-200 font-serif animate-bounce">
            ⚠️ {nameError}
          </div>
        )}
      </header>

      {/* Cuadrícula de Temáticas */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {AVAILABLE_THEMES.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleCardClick(theme)}
              className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-amber-900/50 bg-stone-900/80 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer backdrop-blur-sm"
            >
              {/* Imagen de Portada con Gradiente */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-950">
                <img
                  src={theme.coverImage}
                  alt={theme.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

                {/* Badge de Tarjetas */}
                <span className="absolute top-3 right-3 rounded-xl bg-stone-950/80 px-3 py-1 font-mono text-xs font-bold text-amber-300 border border-amber-700/60 backdrop-blur-md">
                  {theme.deck.characters.length} Tarjetas
                </span>

                {/* Icono temático */}
                <div className="absolute bottom-3 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/60 bg-stone-900/90 text-2xl shadow-lg">
                  {theme.icon}
                </div>
              </div>

              {/* Contenido de la Card */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <h3 className="text-xl font-serif font-black tracking-wide text-amber-200 group-hover:text-amber-300 transition-colors">
                    {theme.name}
                  </h3>
                  <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                {/* Botón de Acción en la Tarjeta */}
                <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-serif text-stone-500">
                    2 Jugadores • Online
                  </span>

                  <button
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-600/80 bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-xs font-serif font-bold text-amber-100 shadow-md transition-all group-hover:border-amber-400 group-hover:from-amber-600 group-hover:to-amber-800 group-hover:text-white"
                  >
                    <span>Crear Sala</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
