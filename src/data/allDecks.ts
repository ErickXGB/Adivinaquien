import { Deck } from '../types/game';
import { harryPotterDeck } from './harryPotterDeck';
import { DEFAULT_CLASSIC_DECK } from './defaultDecks';
import { peanutsDeck } from './peanutsDeck';
import { disneyPrincessesDeck } from './disneyPrincessesDeck';
import { carsDeck } from './carsDeck';

export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  icon: string;
  accentColor: string;
  deck: Deck;
}

export const superHeroesDeck: Deck = {
  id: 'superheroes-deck',
  name: 'Superhéroes y Villanos',
  isCustom: false,
  characters: [
    { id: 'sh1', name: 'Spider-Man', imageUrl: '/characters/superheroes/sh1.webp' },
    { id: 'sh2', name: 'Iron Man', imageUrl: '/characters/superheroes/sh2.webp' },
    { id: 'sh3', name: 'Capitán América', imageUrl: '/characters/superheroes/sh3.webp' },
    { id: 'sh4', name: 'Thor', imageUrl: '/characters/superheroes/sh4.webp' },
    { id: 'sh5', name: 'Hulk', imageUrl: '/characters/superheroes/sh5.webp' },
    { id: 'sh6', name: 'Black Widow', imageUrl: '/characters/superheroes/sh6.webp' },
    { id: 'sh7', name: 'Hawkeye', imageUrl: '/characters/superheroes/sh7.webp' },
    { id: 'sh8', name: 'Doctor Strange', imageUrl: '/characters/superheroes/sh8.webp' },
    { id: 'sh9', name: 'Black Panther', imageUrl: '/characters/superheroes/sh9.webp' },
    { id: 'sh10', name: 'Thanos', imageUrl: '/characters/superheroes/sh10.webp' },
    { id: 'sh11', name: 'Scarlet Witch', imageUrl: '/characters/superheroes/sh11.webp' },
    { id: 'sh12', name: 'Loki', imageUrl: '/characters/superheroes/sh12.webp' },
    { id: 'sh13', name: 'Groot', imageUrl: '/characters/superheroes/sh13.webp' },
    { id: 'sh14', name: 'Ant-Man', imageUrl: '/characters/superheroes/sh14.webp' },
    { id: 'sh15', name: 'Captain Marvel', imageUrl: '/characters/superheroes/sh15.webp' },
    { id: 'sh16', name: 'Star-Lord', imageUrl: '/characters/superheroes/sh16.webp' },
    { id: 'sh17', name: 'Gamora', imageUrl: '/characters/superheroes/sh17.webp' },
    { id: 'sh18', name: 'Batman', imageUrl: '/characters/superheroes/sh18.webp' },
    { id: 'sh19', name: 'Superman', imageUrl: '/characters/superheroes/sh19.webp' },
    { id: 'sh20', name: 'Wonder Woman', imageUrl: '/characters/superheroes/sh20.webp' },
    { id: 'sh21', name: 'Joker', imageUrl: '/characters/superheroes/sh21.webp' },
    { id: 'sh22', name: 'Harley Quinn', imageUrl: '/characters/superheroes/sh22.webp' },
    { id: 'sh23', name: 'Aquaman', imageUrl: '/characters/superheroes/sh23.webp' },
    { id: 'sh24', name: 'Flash', imageUrl: '/characters/superheroes/sh24.webp' },
  ],
};

export const AVAILABLE_THEMES: ThemeMetadata[] = [
  {
    id: 'harry-potter-deck',
    name: 'Harry Potter',
    description: 'Duelo mágico entre hechiceros, brujas y criaturas de Hogwarts.',
    coverImage: '/characters/harry-potter/hp1.webp',
    icon: '⚡',
    accentColor: 'from-amber-700 to-amber-950 border-amber-500/60 text-amber-300',
    deck: harryPotterDeck,
  },
  {
    id: 'superheroes-deck',
    name: 'Superhéroes & Villanos',
    description: 'Adivina los héroes y villanos más poderosos de los cómics.',
    coverImage: '/characters/superheroes/sh1.webp',
    icon: '🦸‍♂️',
    accentColor: 'from-blue-700 to-indigo-950 border-blue-500/60 text-blue-300',
    deck: superHeroesDeck,
  },
  {
    id: 'classic-deck',
    name: 'Personajes Clásicos',
    description: 'La experiencia retro tradicional del juego de mesa original.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    icon: '🎭',
    accentColor: 'from-emerald-700 to-emerald-950 border-emerald-500/60 text-emerald-300',
    deck: DEFAULT_CLASSIC_DECK,
  },
  {
    id: 'peanuts-deck',
    name: 'Peanuts (Snoopy y su pandilla)',
    description: 'Charlie Brown, Snoopy, Lucy y toda la pandilla en un duelo de deducción.',
    coverImage: '/characters/peanuts/pn1.webp',
    icon: '🐶',
    accentColor: 'from-yellow-700 to-amber-950 border-yellow-500/60 text-yellow-300',
    deck: peanutsDeck,
  },
  {
    id: 'disney-princesses-deck',
    name: 'Princesas de Disney',
    description: 'Blancanieves, Cenicienta, Ariel y las heroínas más queridas de Disney.',
    coverImage: '/characters/disney-princesses/dp1.webp',
    icon: '👑',
    accentColor: 'from-pink-700 to-purple-950 border-pink-500/60 text-pink-300',
    deck: disneyPrincessesDeck,
  },
  {
    id: 'cars-deck',
    name: 'Cars (Pixar)',
    description: 'Rayo McQueen, Mater y los habitantes de Radiador Springs.',
    coverImage: '/characters/cars/cr1.webp',
    icon: '🏎️',
    accentColor: 'from-red-700 to-stone-950 border-red-500/60 text-red-300',
    deck: carsDeck,
  },
];
