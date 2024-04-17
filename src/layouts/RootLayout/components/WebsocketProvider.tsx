import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { socketContext } from '../../../contexts/socketContext.tsx';
import axios, { AxiosError, AxiosResponse } from 'axios';

export interface WebSocketProviderProps {
  children: React.ReactNode;
}

export default function WebSocketProvider({
  children,
}: WebSocketProviderProps) {
  const [socket, setSocket] = useState<null | Socket>(null);

  async function declareSocketId(socketId: string) {
    axios
      .post('/api/me/socketIds', { socketId })
      .then((res: AxiosResponse) => {
        console.log(
          `SocketId ${res.data.socketId} is bind on the UserId ${res.data.userId} on the backend.`
        );
      })
      .catch((err: AxiosError) => {
        console.log('Authentication websocket fail.', err);
      });
  }

  useEffect(() => {
    const URL = import.meta.env.DEV ? 'http://localhost:3000' : '';
    const socket = io(URL, {
      auth: {
        token: 'my-token' + Date.now(),
      },
    });

    socket.on('connect', async () => {
      console.log('Connected to server with socket id:', socket.id);

      if (!socket.id) {
        console.log('Socket is not connected. Please check your connection.');
        return;
      } else {
        await declareSocketId(socket.id);
        socket.emit('authenticate');
        socket.on('authenticated', ({ socketId, user }) => {
          console.log(
            `Socket authenticates this socketId: ${socketId} with user: ${user}`
          );
          setSocket(socket);
        });
      }
    });

    socket.on('connect_error', (error) => {
      console.log(error);
      socket.emit('hello', 'world');
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}
