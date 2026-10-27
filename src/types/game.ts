/**
 * TIPOS Y MODELOS DE DATOS: "ADIVINA QUIÉN" (GUESS WHO?)
 */

export type RoomStatus = 'waiting' | 'selecting_deck' | 'ready' | 'playing' | 'finished';

export type QuickAnswer = 'yes' | 'no' | 'not_applicable';

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  tags?: Record<string, boolean | string>; // Opcional: { glasses: true, hair: 'brown' }
}

export interface Deck {
  id: string;
  name: string;
  isCustom: boolean;
  createdBy?: string;
  characters: Character[]; // Mínimo 24 personajes recomendados
}

export interface PlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
  eliminatedCount: number; // Cantidad de cartas descartadas/volteadas
  ready: boolean;
}

export interface PlayerPrivate {
  playerId: string;
  secretCharacterId: string; // Personaje secreto asignado
  boardState: Record<string, boolean>; // { [characterId]: isFlipped }
}

export interface GameMessage {
  id: string;
  senderId: string;
  senderName: string;
  type: 'question' | 'answer' | 'guess' | 'system';
  content: string;
  quickAnswer?: QuickAnswer;
  createdAt: number;
}

export interface RoomDocument {
  id: string;
  code: string; // Código de 6 caracteres ej: "GW-7842"
  status: RoomStatus;
  deckId: string;
  deckName?: string;
  boardSize: number; // 16, 20 o 24 cartas
  characters: Character[]; // Los 16-24 personajes seleccionados para la partida actual
  players: {
    player1?: PlayerPublic;
    player2?: PlayerPublic;
  };
  currentTurnPlayerId: string | null;
  winnerId: string | null;
  createdAt: number;
  lastActive: number;
}
