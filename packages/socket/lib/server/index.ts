import type { Http2SecureServer, Http2Server } from 'node:http2';
import type http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';

type TServerInstance = http.Server | Http2SecureServer | Http2Server;

export const configureSocketServer = (server: TServerInstance) => {
	const io = new SocketIOServer(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	});

	return io;
};
