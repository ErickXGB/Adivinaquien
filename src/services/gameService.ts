import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { QuickAnswer, GameMessage, RoomDocument, PlayerPrivate } from '../types/game';

/**
 * 1. sendQuestion: Guarda la pregunta en /rooms/{roomId}/messages y conmuta el turno al oponente.
 */
export const sendQuestion = async (
  roomId: string,
  senderId: string,
  senderName: string,
  questionText: string
): Promise<void> => {
  const roomDocRef = doc(db, 'rooms', roomId);
  const roomSnap = await getDoc(roomDocRef);

  if (!roomSnap.exists()) throw new Error('La sala no existe');
  const roomData = roomSnap.data() as RoomDocument;

  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  const newMsg: Omit<GameMessage, 'id'> = {
    senderId,
    senderName,
    type: 'question',
    content: questionText.trim(),
    createdAt: Date.now(),
  };

  await addDoc(messagesRef, newMsg);

  // Conmutar turno al oponente para que responda
  const opponentId =
    roomData.players.player1?.id === senderId
      ? roomData.players.player2?.id
      : roomData.players.player1?.id;

  if (opponentId) {
    await updateDoc(roomDocRef, {
      currentTurnPlayerId: opponentId,
      lastActive: Date.now(),
    });
  }
};

/**
 * 2. sendAnswer: Guarda la respuesta rápida y devuelve el turno al preguntante.
 */
export const sendAnswer = async (
  roomId: string,
  senderId: string,
  senderName: string,
  answer: QuickAnswer
): Promise<void> => {
  const roomDocRef = doc(db, 'rooms', roomId);
  const roomSnap = await getDoc(roomDocRef);

  if (!roomSnap.exists()) throw new Error('La sala no existe');
  const roomData = roomSnap.data() as RoomDocument;

  const textMap: Record<QuickAnswer, string> = {
    yes: '¡Sí!',
    no: '¡No!',
    not_applicable: 'No aplica / Se desconoce',
  };

  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  const newMsg: Omit<GameMessage, 'id'> = {
    senderId,
    senderName,
    type: 'answer',
    content: textMap[answer],
    quickAnswer: answer,
    createdAt: Date.now(),
  };

  await addDoc(messagesRef, newMsg);

  // Devolver el turno al jugador que hizo la pregunta
  const askerId =
    roomData.players.player1?.id === senderId
      ? roomData.players.player2?.id
      : roomData.players.player1?.id;

  if (askerId) {
    await updateDoc(roomDocRef, {
      currentTurnPlayerId: askerId,
      lastActive: Date.now(),
    });
  }
};

/**
 * 3. updatePlayerBoardFlip: Actualiza el estado de volteo de una carta en la subcolección privada.
 */
export const updatePlayerBoardFlip = async (
  roomId: string,
  playerId: string,
  characterId: string,
  isFlipped: boolean,
  currentEliminatedCount: number,
  isPlayer1: boolean
): Promise<void> => {
  const privateRef = doc(db, 'rooms', roomId, 'private_players', playerId);
  await updateDoc(privateRef, {
    [`boardState.${characterId}`]: isFlipped,
    updatedAt: Date.now(),
  });

  // Actualizar recuento de cartas descartadas públicas en la sala
  const roomRef = doc(db, 'rooms', roomId);
  const fieldToUpdate = isPlayer1
    ? 'players.player1.eliminatedCount'
    : 'players.player2.eliminatedCount';

  await updateDoc(roomRef, {
    [fieldToUpdate]: currentEliminatedCount,
  });
};

/**
 * 4. guessOpponentCharacter: Arriesga adivinar el personaje rival.
 */
export const guessOpponentCharacter = async (
  roomId: string,
  guesserId: string,
  guesserName: string,
  opponentId: string,
  guessedCharacterId: string,
  guessedCharacterName: string
): Promise<{ isWinner: boolean }> => {
  const opponentPrivateRef = doc(db, 'rooms', roomId, 'private_players', opponentId);
  const oppSnap = await getDoc(opponentPrivateRef);

  if (!oppSnap.exists()) {
    throw new Error('No se pudo verificar el personaje del rival.');
  }

  const oppData = oppSnap.data() as PlayerPrivate;
  const isWinner = oppData.secretCharacterId === guessedCharacterId;

  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  const roomDocRef = doc(db, 'rooms', roomId);

  if (isWinner) {
    // Victoria
    await addDoc(messagesRef, {
      senderId: guesserId,
      senderName: guesserName,
      type: 'system',
      content: `🏆 ¡${guesserName} ha adivinado correctamente que el personaje era ${guessedCharacterName}! ¡Ha ganado la partida!`,
      createdAt: Date.now(),
    });

    await updateDoc(roomDocRef, {
      status: 'finished',
      winnerId: guesserId,
      lastActive: Date.now(),
    });
  } else {
    // Falló la adivinanza
    await addDoc(messagesRef, {
      senderId: guesserId,
      senderName: guesserName,
      type: 'system',
      content: `❌ ${guesserName} arriesgó que era ${guessedCharacterName}, ¡pero era incorrecto!`,
      createdAt: Date.now(),
    });

    // Pasa el turno al oponente
    await updateDoc(roomDocRef, {
      currentTurnPlayerId: opponentId,
      lastActive: Date.now(),
    });
  }

  return { isWinner };
};
