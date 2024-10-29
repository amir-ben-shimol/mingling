import type { Server as SocketIOServer, Socket } from 'socket.io';
import { handleSignaling } from '../controllers/webRTC';

export const configureSockets = (io: SocketIOServer) => {
	io.on('connection', (socket: Socket) => {
		console.log(`User connected: ${socket.id}`);

		// Handle signaling events
		handleSignaling(socket, io);

		// Handle chat messages
		socket.on('message', (message) => {
			// Broadcast the message to all users
			socket.broadcast.emit('message', message);
		});

		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`);
		});
	});
};
