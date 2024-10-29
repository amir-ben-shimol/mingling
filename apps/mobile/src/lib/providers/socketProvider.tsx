import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { type Socket } from 'socket.io-client';

type SocketContextType = {
	socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io('http://localhost:3000'); // replace with your server URL

		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, []);

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
