import { useState, useEffect } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { RoomDocument, GameMessage, PlayerPrivate } from '../types/game';

interface UseRoomResult {
  room: RoomDocument | null;
  messages: GameMessage[];
  mySecretCharacterId: string | null;
  loading: boolean;
  error: string | null;
}

export const useRoom = (roomId: string | null, playerId: string | null): UseRoomResult => {
  const [room, setRoom] = useState<RoomDocument | null>(null);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [mySecretCharacterId, setMySecretCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      setMessages([]);
      setMySecretCharacterId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Escuchar cambios en el documento público de la Sala
    const roomDocRef = doc(db, 'rooms', roomId);
    const unsubscribeRoom = onSnapshot(
      roomDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setRoom(docSnap.data() as RoomDocument);
        } else {
          setError('La sala ya no existe.');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error escuchando sala:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // 2. Escuchar la subcolección de Mensajes de la sala en tiempo real
    const messagesQuery = query(
      collection(db, 'rooms', roomId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: GameMessage[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<GameMessage, 'id'>),
      }));
      setMessages(msgs);
    });

    // 3. Escuchar el documento privado del jugador actual (personaje secreto)
    let unsubscribePrivate: (() => void) | null = null;
    if (playerId) {
      const privateDocRef = doc(db, 'rooms', roomId, 'private_players', playerId);
      unsubscribePrivate = onSnapshot(privateDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as PlayerPrivate;
          setMySecretCharacterId(data.secretCharacterId);
        }
      });
    }

    return () => {
      unsubscribeRoom();
      unsubscribeMessages();
      if (unsubscribePrivate) unsubscribePrivate();
    };
  }, [roomId, playerId]);

  return { room, messages, mySecretCharacterId, loading, error };
};
