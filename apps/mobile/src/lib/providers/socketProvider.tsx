// src/context/SocketProvider.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import useSocketListeners from '../hook/useSocketListeners';

type SocketContextType = {
	socket: Socket | null;
};

type SocketProviderProps = {
	children: ReactNode;
	userId: string; // Accept userId as a prop
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, userId }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io(process.env.EXPO_PUBLIC_BACKEND_URL, {
			reconnection: true, // Enables automatic reconnection
			reconnectionAttempts: 5, // Limits reconnection attempts
			timeout: 10000, // Sets timeout for initial connection
			transports: ['websocket'],
		});

		newSocket.on('connect', () => {
			if (userId) {
				newSocket.emit('login', { userId });
			}
		});

		newSocket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
		});

		setSocket(newSocket);

		// Cleanup on unmount
		return () => {
			newSocket.disconnect();
		};
	}, [userId]); // Ensure effect reruns if userId changes

	useSocketListeners(socket);

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
	const context = useContext(SocketContext);

	if (!context) throw new Error('useSocket must be used within a SocketProvider');

	return context;
};
