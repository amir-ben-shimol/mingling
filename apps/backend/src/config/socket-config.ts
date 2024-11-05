// config/socket-config.ts
import type { Server, Socket } from 'socket.io';
import { deleteSocketUser, setSocketUser, setUserSocket, getUserIdBySocketId, setUserOnlineStatus, deleteUserSocket } from '../helpers/redis-helpers';
import { emitFriendUpdate } from '../helpers/socket-emitters';

type UserSocketData = {
	userId: string;
	inPlayground: boolean;
	inChat: boolean;
	chatPartnerId: string | null;
};

export function configureSockets(io: Server) {
	const users = new Map<string, UserSocketData>();
	const availableUsers = new Set<string>();

	io.on('connection', (socket: Socket) => {
		// Function to handle when a user leaves the playground or disconnects
		function handleUserLeaving(socket: Socket, isNextUser = false) {
			const userData = users.get(socket.id);

			if (!userData) return;

			if (userData.chatPartnerId) {
				const partnerSocket = io.sockets.sockets.get(userData.chatPartnerId);

				if (partnerSocket) {
					partnerSocket.emit('partnerLeft');
					const partnerData = users.get(userData.chatPartnerId);

					if (partnerData) {
						partnerData.inChat = false;
						partnerData.chatPartnerId = null;

						if (partnerData.inPlayground) {
							availableUsers.add(partnerSocket.id);
						}
					}
				}
			}

			userData.inChat = false;
			userData.chatPartnerId = null;

			if (!isNextUser) {
				userData.inPlayground = false;
				availableUsers.delete(socket.id);
			}
		}

		// Match users in the playground for chat
		async function matchUsers() {
			while (availableUsers.size >= 2) {
				const [socketId1, socketId2] = Array.from(availableUsers).slice(0, 2);

				if (!socketId1 || !socketId2) return;

				availableUsers.delete(socketId1);
				availableUsers.delete(socketId2);

				const user1 = users.get(socketId1);
				const user2 = users.get(socketId2);

				if (user1 && user2) {
					user1.inChat = true;
					user1.chatPartnerId = socketId2;
					user2.inChat = true;
					user2.chatPartnerId = socketId1;

					const user1Id = await getUserIdBySocketId(socketId1);
					const user2Id = await getUserIdBySocketId(socketId2);

					io.to(socketId1).emit('matched', { partnerSocketId: socketId2, partnerUserId: user2Id });
					io.to(socketId2).emit('matched', { partnerSocketId: socketId1, partnerUserId: user1Id });
				}
			}
		}

		// Map userId to socketId in Redis upon initial login
		socket.on('login', async ({ userId }) => {
			await setUserSocket(userId, socket.id); // Maps userId to socketId in Redis
			await setSocketUser(socket.id, userId); // Maps socketId to userId in Redis
			await setUserOnlineStatus(userId, true);
			emitFriendUpdate(io, userId, { isOnline: true });
		});

		// Remove socket-user mapping from Redis on logout
		socket.on('logout', async () => {
			console.log(`User with socket ${socket.id} logged out`);
			await deleteSocketUser(socket.id); // Removes the socket-user mapping from Redis
			const userId = await getUserIdBySocketId(socket.id);

			if (userId) {
				await setUserOnlineStatus(userId, false);
				await deleteUserSocket(userId);
				emitFriendUpdate(io, userId, { isOnline: false });
			}
		});

		// When app moves to background, set user as offline
		socket.on('app-background', async (userId) => {
			await setUserOnlineStatus(userId, false);
			emitFriendUpdate(io, userId, { isOnline: false });
		});

		// When app moves to foreground, set user as online
		socket.on('app-foreground', async (userId) => {
			await setUserOnlineStatus(userId, true);
			emitFriendUpdate(io, userId, { isOnline: true });
		});

		// User joins the playground (no need to re-set socket mappings)
		socket.on('joinPlayground', (userId: string) => {
			console.log(`User ${userId} joined the playground with socket ${socket.id}`);

			// Store user data locally for playground functionality
			users.set(socket.id, {
				userId,
				inPlayground: true,
				inChat: false,
				chatPartnerId: null,
			});
			availableUsers.add(socket.id);
			matchUsers();
		});

		// Handle when a user leaves the playground
		socket.on('leavePlayground', () => {
			handleUserLeaving(socket);
			users.delete(socket.id); // Remove local data
			availableUsers.delete(socket.id);
		});

		// Handle moving to the next user
		socket.on('nextUser', () => {
			handleUserLeaving(socket, true);
			const user = users.get(socket.id);

			if (user) {
				user.inPlayground = true;
				availableUsers.add(socket.id);
				matchUsers();
			}
		});

		// Handle signaling for WebRTC connections
		socket.on('signal', ({ to, data }) => {
			io.to(to).emit('signal', { from: socket.id, data });
		});

		// Handle disconnects (only removes mapping if it’s unexpected)
		socket.on('disconnect', async () => {
			console.log(`Socket ${socket.id} disconnected`);
			const userId = await getUserIdBySocketId(socket.id);

			if (userId) {
				await deleteSocketUser(socket.id); // Only delete mapping if this disconnect is unexpected
				users.delete(socket.id); // Cleanup local playground data if applicable

				availableUsers.delete(socket.id);

				handleUserLeaving(socket);
			}
		});

		// Handle chat messages
		socket.on('chatMessage', ({ to, message }) => {
			io.to(to).emit('chatMessage', message);
		});
	});
}
