// config/socket-config.ts
import type { Server, Socket } from 'socket.io';

export function configureSockets(io: Server) {
	const playgroundQueue: Map<string, string> = new Map(); // { socketId: userId }

	io.on('connection', (socket: Socket) => {
		console.log(`User connected: ${socket.id}`);

		// When a user joins the playground, add them to the queue
		socket.on('join-playground', (userId: string) => {
			playgroundQueue.set(socket.id, userId);

			// Check if there’s another user available for a match
			const otherUserSocket = Array.from(playgroundQueue.keys()).find((id) => id !== socket.id);

			if (otherUserSocket) {
				const otherUserId = playgroundQueue.get(otherUserSocket)!;

				console.log('Matching with otherUserId:', otherUserId);

				// Notify both users to start a WebRTC connection
				socket.emit('start-connection', { to: otherUserSocket });
				io.to(otherUserSocket).emit('start-connection', { to: socket.id });

				// Remove users from the playground queue
				playgroundQueue.delete(socket.id);
				playgroundQueue.delete(otherUserSocket);
			}
		});

		// Handle WebRTC signaling events (offer, answer, ICE candidates)
		// Robust signal handling
		socket.on('signal', ({ to, type, offer, answer, candidate }) => {
			if (!to) {
				console.warn(`Received signal with undefined 'to' field from ${socket.id}`);

				return;
			}

			console.log(`Relaying signal from ${socket.id} to ${to}, Type: ${type}`);

			io.to(to).emit('signal', {
				from: socket.id,
				type,
				...(offer && { offer }),
				...(answer && { answer }),
				...(candidate && { candidate }),
			});
		});

		// Handle chat message events
		socket.on('message', (data) => {
			const { to, message } = data;

			if (to) {
				io.to(to).emit('message', { from: socket.id, message });
			}
		});

		// Allow a user to look for a new match after ending a session
		socket.on('next-user', () => {
			playgroundQueue.delete(socket.id);
			socket.emit('leave-queue', { message: 'You will be back in 1 minute' });

			// Re-add user to queue after 1 minute
			setTimeout(() => playgroundQueue.set(socket.id, playgroundQueue.get(socket.id)!), 60000);
		});

		// Remove the user from the queue upon disconnection
		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`);
			playgroundQueue.delete(socket.id);
			io.emit('user-disconnected', socket.id);
		});
	});
}
