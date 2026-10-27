import React, { useState, useEffect } from 'react';
import { harryPotterDeck } from './data/harryPotterDeck';
import { ThemeMetadata } from './data/allDecks';
import { GameBoard } from './components/board/GameBoard';
import { LobbyModal } from './components/lobby/LobbyModal';
import { ThemeSelectionView } from './components/lobby/ThemeSelectionView';
import { RoomsLobbyModal } from './components/lobby/RoomsLobbyModal';
import { Character, QuickAnswer, RoomDocument } from './types/game';
import { useRoom } from './hooks/useRoom';
import {
  createRoom,
  joinRoom,
  startGame,
  leaveRoom,
  subscribeToAvailableRooms,
} from './services/roomService';
import { sendQuestion, sendAnswer, guessOpponentCharacter } from './services/gameService';

export const App: React.FC = () => {
  // Nombre del jugador persistido
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('gw_player_name') || 'Mago Anónimo';
  });

  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('gw_player_name', name);
  };

  // Salas activas disponibles para unirse en tiempo real
  const [availableRooms, setAvailableRooms] = useState<RoomDocument[]>([]);
  const [isRoomsLobbyOpen, setIsRoomsLobbyOpen] = useState(false);

  // Lista dinámica de personajes
  const [characters, setCharacters] = useState<Character[]>(
    harryPotterDeck.characters
  );

  // Personaje secreto asignado
  const [secretCharacter, setSecretCharacter] = useState<Character>(
    harryPotterDeck.characters[0]
  );

  // Estado de sesión de sala multijugador
  const [roomId, setRoomId] = useState<string | null>(() => {
    return sessionStorage.getItem('gw_room_id') || null;
  });
  const [myPlayerId, setMyPlayerId] = useState<string | null>(() => {
    return sessionStorage.getItem('gw_player_id') || null;
  });

  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Suscripción a salas disponibles en tiempo real para el Lobby
  useEffect(() => {
    const unsubscribe = subscribeToAvailableRooms((rooms) => {
      setAvailableRooms(rooms);
    });
    return () => unsubscribe();
  }, []);

  // Hook en tiempo real de Firestore para la sala actual
  const { room, messages, mySecretCharacterId, loading: roomLoading } = useRoom(
    roomId,
    myPlayerId
  );

  // Actualizar el personaje secreto cuando Firestore lo asigne en la subcolección privada
  useEffect(() => {
    if (mySecretCharacterId) {
      const found = characters.find((c) => c.id === mySecretCharacterId);
      if (found) {
        setSecretCharacter(found);
      }
    }
  }, [mySecretCharacterId, characters]);

  // Si la sala tiene personajes específicos guardados
  useEffect(() => {
    if (room?.characters && room.characters.length > 0) {
      setCharacters(room.characters);
    }
  }, [room?.characters]);

  // 1. Crear Sala Automática al Elegir Temática desde la Página Principal
  const handleSelectTheme = async (theme: ThemeMetadata) => {
    setActionLoading(true);
    try {
      const result = await createRoom(
        playerName,
        theme.id,
        theme.name,
        theme.deck.characters
      );
      setCharacters(theme.deck.characters);
      setRoomId(result.roomId);
      setMyPlayerId(result.playerId);
      sessionStorage.setItem('gw_room_id', result.roomId);
      sessionStorage.setItem('gw_player_id', result.playerId);
    } catch (err: any) {
      console.error('Error al crear sala con temática:', err);
      alert('Error al crear sala: ' + (err.message || 'Verifica tu conexión'));
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Unirse a Sala desde el Lobby de Salas o por Código
  const handleJoinRoom = async (roomCode: string, nameToUse: string) => {
    setActionLoading(true);
    handleUpdatePlayerName(nameToUse);
    try {
      const result = await joinRoom(roomCode, nameToUse);
      setRoomId(result.roomId);
      setMyPlayerId(result.playerId);
      sessionStorage.setItem('gw_room_id', result.roomId);
      sessionStorage.setItem('gw_player_id', result.playerId);
      setIsRoomsLobbyOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Iniciar Partida (Host)
  const handleStartGame = async () => {
    if (!roomId) return;
    setActionLoading(true);
    try {
      await startGame(roomId);
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Salir de la Sala y Volver a la Página Principal de Temáticas
  const handleLeaveRoom = async () => {
    if (roomId && myPlayerId) {
      await leaveRoom(roomId, myPlayerId);
    }
    setRoomId(null);
    setMyPlayerId(null);
    sessionStorage.removeItem('gw_room_id');
    sessionStorage.removeItem('gw_player_id');
  };

  // 5. Enviar Pregunta o Respuesta Rápida
  const handleSendMessage = async (
    content: string,
    type: 'question' | 'answer' | 'guess',
    quickAnswer?: QuickAnswer
  ) => {
    if (!roomId || !myPlayerId) return;

    const isP1 = myPlayerId === room?.players.player1?.id;
    const senderName = isP1
      ? room?.players.player1?.name || 'Jugador 1'
      : room?.players.player2?.name || 'Jugador 2';

    try {
      if (type === 'question') {
        await sendQuestion(roomId, myPlayerId, senderName, content);
      } else if (type === 'answer' && quickAnswer) {
        await sendAnswer(roomId, myPlayerId, senderName, quickAnswer);
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  // 6. Arriesgar Adivinanza del personaje rival
  const handleGuessOpponent = async (guessedChar: Character) => {
    if (!roomId || !myPlayerId || !room) return;

    const isP1 = myPlayerId === room.players.player1?.id;
    const guesserName = isP1
      ? room.players.player1?.name || 'Jugador 1'
      : room.players.player2?.name || 'Jugador 2';
    const opponent = isP1 ? room.players.player2 : room.players.player1;

    if (!opponent) return;

    try {
      await guessOpponentCharacter(
        roomId,
        myPlayerId,
        guesserName,
        opponent.id,
        guessedChar.id,
        guessedChar.name
      );
    } catch (err) {
      console.error('Error al arriesgar personaje:', err);
    }
  };

  // VISTA 1: Si no hay sala creada o unida -> Mostrar Página Principal de Temáticas
  if (!roomId || !room) {
    return (
      <div className="relative">
        <ThemeSelectionView
          playerName={playerName}
          onUpdatePlayerName={handleUpdatePlayerName}
          onSelectTheme={handleSelectTheme}
          onOpenRoomsLobby={() => setIsRoomsLobbyOpen(true)}
          availableRoomsCount={availableRooms.length}
          loading={actionLoading}
        />

        {/* Modal con el listado en vivo de todas las salas esperando oponente */}
        <RoomsLobbyModal
          isOpen={isRoomsLobbyOpen}
          onClose={() => setIsRoomsLobbyOpen(false)}
          availableRooms={availableRooms}
          onJoinRoom={handleJoinRoom}
          playerName={playerName}
          onUpdatePlayerName={handleUpdatePlayerName}
          loading={actionLoading}
        />
      </div>
    );
  }

  // VISTA 2: Si la sala está en espera o lista para iniciar -> Mostrar Pantalla de Espera con código
  const isWaitingOrReady = room.status === 'waiting' || room.status === 'ready';

  return (
    <div className="relative">
      {/* Modal de Espera con código de sala y botón de comenzar duelo */}
      {isWaitingOrReady && (
        <LobbyModal
          isOpen={true}
          onCreateRoom={async () => {}}
          onJoinRoom={handleJoinRoom}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
          room={room}
          myPlayerId={myPlayerId}
          loading={actionLoading || roomLoading}
        />
      )}

      {/* Tablero de Juego (activo durante la partida o visible de fondo) */}
      <GameBoard
        characters={characters}
        secretCharacter={secretCharacter}
        room={room}
        myPlayerId={myPlayerId}
        messages={messages}
        onSelectSecretCharacter={(c) => setSecretCharacter(c)}
        onRandomSecretCharacter={() => {
          const rand = characters[Math.floor(Math.random() * characters.length)];
          setSecretCharacter(rand);
        }}
        onAddCharacter={(newChar) => setCharacters((prev) => [...prev, newChar])}
        onSendMessage={handleSendMessage}
        onGuessOpponent={handleGuessOpponent}
        onLeaveRoom={handleLeaveRoom}
      />
    </div>
  );
};

export default App;
