import type { Http2SecureServer, Http2Server } from 'node:http2';
import type http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';

type TServerInstance = http.Server | Http2SecureServer | Http2Server;

let io: SocketIOServer | null = null;

export const configureSocketServer = (server: TServerInstance) => {
	io = new SocketIOServer(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	});

	return io;
};

export const getSocketServer = (): SocketIOServer => {
	if (!io) {
		throw new Error('Socket.IO server is not configured. Call configureSocketServer first.');
	}

	return io;
};

export const emitToUser = (socketId: string, event: string, data: unknown) => {
	const io = getSocketServer();

	io.to(socketId).emit(event, data);
};
