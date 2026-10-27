import { Deck } from '../types/game';
import { harryPotterDeck } from './harryPotterDeck';
import { DEFAULT_CLASSIC_DECK } from './defaultDecks';

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
    { id: 'sh1', name: 'Spider-Man', imageUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh2', name: 'Iron Man', imageUrl: 'https://images.unsplash.com/photo-1626278664285-f796b9ee7806?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh3', name: 'Batman', imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh4', name: 'Superman', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh5', name: 'Capitán América', imageUrl: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh6', name: 'Thor', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh7', name: 'Hulk', imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh8', name: 'Black Widow', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh9', name: 'Wolverine', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh10', name: 'Deadpool', imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh11', name: 'Joker', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh12', name: 'Wonder Woman', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh13', name: 'Flash', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh14', name: 'Doctor Strange', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh15', name: 'Black Panther', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh16', name: 'Thanos', imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh17', name: 'Aquaman', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh18', name: 'Scarlet Witch', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh19', name: 'Loki', imageUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh20', name: 'Green Lantern', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh21', name: 'Groot', imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh22', name: 'Harley Quinn', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh23', name: 'Hawkeye', imageUrl: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?auto=format&fit=crop&w=400&q=80' },
    { id: 'sh24', name: 'Magneto', imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80' },
  ],
};

export const AVAILABLE_THEMES: ThemeMetadata[] = [
  {
    id: 'harry-potter-deck',
    name: 'Harry Potter',
    description: 'Duelo mágico entre hechiceros, brujas y criaturas de Hogwarts.',
    coverImage: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&w=800&q=80',
    icon: '⚡',
    accentColor: 'from-amber-700 to-amber-950 border-amber-500/60 text-amber-300',
    deck: harryPotterDeck,
  },
  {
    id: 'superheroes-deck',
    name: 'Superhéroes & Villanos',
    description: 'Adivina los héroes y villanos más poderosos de los cómics.',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
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
];
