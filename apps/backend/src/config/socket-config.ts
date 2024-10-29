// config/socket-config.ts
import type { Server, Socket } from 'socket.io';

export function configureSockets(io: Server) {
	const playgroundQueue: Map<string, string> = new Map(); // { socketId: userId }

	io.on('connection', (socket: Socket) => {
		console.log(`User connected: ${socket.id}`);

		socket.on('join-playground', (userId: string) => {
			playgroundQueue.set(socket.id, userId);

			// Check if there’s another user available
			const otherUserSocket = Array.from(playgroundQueue.keys()).find((id) => id !== socket.id);

			if (otherUserSocket) {
				const otherUserId = playgroundQueue.get(otherUserSocket)!;

				console.log('otherUserId', otherUserId);

				// Notify both users to start a WebRTC connection
				socket.emit('start-connection', { to: otherUserSocket });
				io.to(otherUserSocket).emit('start-connection', { to: socket.id });

				// Remove users from playground queue
				playgroundQueue.delete(socket.id);
				playgroundQueue.delete(otherUserSocket);
			}
		});

		socket.on('signal', ({ to, signal }) => {
			io.to(to).emit('signal', { from: socket.id, signal });
		});

		socket.on('message', (data) => {
			const { to, message } = data;
			// Emit message only to the recipient specified in `to`

			if (to) {
				io.to(to).emit('message', { from: socket.id, message });
			}
		});

		socket.on('next-user', () => {
			playgroundQueue.delete(socket.id);
			socket.emit('leave-queue', { message: 'You will be back in 1 minute' });

			// Re-add user to queue after 1 minute
			setTimeout(() => playgroundQueue.set(socket.id, playgroundQueue.get(socket.id)!), 60000);
		});

		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`);
			playgroundQueue.delete(socket.id);
			io.emit('user-disconnected', socket.id);
		});
	});
}
