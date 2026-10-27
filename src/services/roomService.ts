import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { RoomDocument, PlayerPublic, Character } from '../types/game';
import { harryPotterDeck } from '../data/harryPotterDeck';

// Generar código único de 6 caracteres (ej: HP-4821)
export const generateRoomCode = (prefix: string = 'GW'): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomDigits}`;
};

// Generar ID único para el jugador
export const generatePlayerId = (): string => {
  return `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
};

/**
 * 1. createRoom: Crea una nueva sala con código de 6 caracteres, estado 'waiting' y asigna al Host y temática.
 */
export const createRoom = async (
  hostName: string,
  deckId: string = 'harry-potter-deck',
  deckName: string = 'Harry Potter',
  characters: Character[] = harryPotterDeck.characters
): Promise<{ roomId: string; roomCode: string; playerId: string }> => {
  const roomRef = doc(collection(db, 'rooms'));
  const roomId = roomRef.id;

  // Prefijo del código según la temática
  let prefix = 'HP';
  if (deckId.includes('superhero')) prefix = 'SH';
  else if (deckId.includes('classic')) prefix = 'CL';

  const roomCode = generateRoomCode(prefix);
  const hostId = generatePlayerId();

  const hostPlayer: PlayerPublic = {
    id: hostId,
    name: hostName.trim() || 'Anfitrión',
    isHost: true,
    connected: true,
    eliminatedCount: 0,
    ready: true,
  };

  const newRoom: RoomDocument = {
    id: roomId,
    code: roomCode,
    status: 'waiting',
    deckId,
    deckName,
    boardSize: characters.length,
    characters: characters,
    players: {
      player1: hostPlayer,
    },
    currentTurnPlayerId: null,
    winnerId: null,
    createdAt: Date.now(),
    lastActive: Date.now(),
  };

  await setDoc(roomRef, newRoom);
  console.log('⚡ [Firebase] ¡Sala creada con éxito en Firestore!', { roomId, roomCode, host: hostPlayer.name, theme: deckName });

  return { roomId, roomCode, playerId: hostId };
};

/**
 * 2. joinRoom: Busca una sala por su código de acceso y une al segundo jugador.
 */
export const joinRoom = async (
  roomCode: string,
  playerName: string
): Promise<{ roomId: string; playerId: string }> => {
  const cleanCode = roomCode.trim().toUpperCase();
  const roomsRef = collection(db, 'rooms');
  const q = query(roomsRef, where('code', '==', cleanCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('No se encontró ninguna sala con el código ingresado.');
  }

  const roomDocSnap = querySnapshot.docs[0];
  const roomData = roomDocSnap.data() as RoomDocument;

  if (roomData.players.player2) {
    throw new Error('La sala ya tiene 2 jugadores y está llena.');
  }

  const guestId = generatePlayerId();
  const guestPlayer: PlayerPublic = {
    id: guestId,
    name: playerName.trim() || 'Segundo Jugador',
    isHost: false,
    connected: true,
    eliminatedCount: 0,
    ready: true,
  };

  const roomDocRef = doc(db, 'rooms', roomDocSnap.id);
  await updateDoc(roomDocRef, {
    'players.player2': guestPlayer,
    status: 'ready',
    lastActive: Date.now(),
  });
  console.log('⚡ [Firebase] ¡Segundo jugador unido a la sala!', { roomId: roomDocSnap.id, guest: guestPlayer.name });

  return { roomId: roomDocSnap.id, playerId: guestId };
};

/**
 * 3. subscribeToAvailableRooms: Escucha en tiempo real todas las salas activas en espera
 */
export const subscribeToAvailableRooms = (
  onRoomsUpdate: (rooms: RoomDocument[]) => void
): (() => void) => {
  const roomsRef = collection(db, 'rooms');
  const q = query(roomsRef, where('status', '==', 'waiting'));

  return onSnapshot(
    q,
    (snapshot) => {
      const activeRooms: RoomDocument[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<RoomDocument, 'id'>),
      }));

      // Ordenar por más recientes
      activeRooms.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onRoomsUpdate(activeRooms);
    },
    (err) => {
      console.error('Error al escuchar salas disponibles:', err);
    }
  );
};

/**
 * 4. startGame: Reparte/asigna el personaje secreto a cada jugador en su subcolección privada
 */
export const startGame = async (
  roomId: string,
  manualSecretCharacterIds?: { [playerId: string]: string }
): Promise<void> => {
  const roomDocRef = doc(db, 'rooms', roomId);
  const roomSnap = await getDoc(roomDocRef);

  if (!roomSnap.exists()) {
    throw new Error('La sala no existe.');
  }

  const roomData = roomSnap.data() as RoomDocument;
  const p1 = roomData.players.player1;
  const p2 = roomData.players.player2;

  if (!p1 || !p2) {
    throw new Error('Se necesitan 2 jugadores conectados para iniciar la partida.');
  }

  const availableChars: Character[] = roomData.characters || harryPotterDeck.characters;

  const getRandomCharId = () => {
    const idx = Math.floor(Math.random() * availableChars.length);
    return availableChars[idx].id;
  };

  const p1Secret = manualSecretCharacterIds?.[p1.id] || getRandomCharId();
  const p2Secret = manualSecretCharacterIds?.[p2.id] || getRandomCharId();

  const p1PrivateRef = doc(db, 'rooms', roomId, 'private_players', p1.id);
  await setDoc(p1PrivateRef, {
    playerId: p1.id,
    secretCharacterId: p1Secret,
    boardState: {},
    updatedAt: Date.now(),
  });

  const p2PrivateRef = doc(db, 'rooms', roomId, 'private_players', p2.id);
  await setDoc(p2PrivateRef, {
    playerId: p2.id,
    secretCharacterId: p2Secret,
    boardState: {},
    updatedAt: Date.now(),
  });

  await updateDoc(roomDocRef, {
    status: 'playing',
    currentTurnPlayerId: p1.id,
    lastActive: Date.now(),
  });
};

/**
 * 5. leaveRoom: Permite abandonar la sala y limpiar el estado
 */
export const leaveRoom = async (roomId: string, playerId: string): Promise<void> => {
  try {
    const roomDocRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomDocRef);

    if (!roomSnap.exists()) return;

    const data = roomSnap.data() as RoomDocument;

    // Si estaba en espera y era el anfitrión, eliminamos la sala
    if (data.status === 'waiting' && data.players.player1?.id === playerId) {
      await deleteDoc(roomDocRef);
    } else {
      // Marcar partida como terminada o desconectada
      await updateDoc(roomDocRef, {
        status: 'finished',
        lastActive: Date.now(),
      });
    }
  } catch (err) {
    console.error('Error al salir de la sala:', err);
  }
};
