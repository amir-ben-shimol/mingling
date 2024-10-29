// src/context/SocketProvider.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

type SocketContextType = {
	socket: Socket | null;
};

type SocketProviderProps = {
	children: ReactNode;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io('http://10.0.0.1:3000'); // Replace with your server URL

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
	const context = useContext(SocketContext);

	if (!context) throw new Error('useSocket must be used within a SocketProvider');

	return context;
};
