/* eslint-disable padding-line-between-statements */
/* eslint-disable @typescript-eslint/no-use-before-define */
// config/socket-config.ts
import type { Server, Socket } from 'socket.io';

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
		socket.on('joinPlayground', (userId: string) => {
			users.set(socket.id, {
				userId,
				inPlayground: true,
				inChat: false,
				chatPartnerId: null,
			});
			availableUsers.add(socket.id);
			matchUsers();
		});

		socket.on('leavePlayground', () => {
			handleUserLeaving(socket);
		});

		socket.on('nextUser', () => {
			handleUserLeaving(socket, true);
			users.get(socket.id)!.inPlayground = true;
			availableUsers.add(socket.id);
			matchUsers();
		});

		socket.on('signal', ({ to, data }) => {
			io.to(to).emit('signal', { from: socket.id, data });
		});

		socket.on('disconnect', () => {
			handleUserLeaving(socket);
			users.delete(socket.id);
		});

		socket.on('chatMessage', ({ to, message }) => {
			io.to(to).emit('chatMessage', message);
		});

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

		function matchUsers() {
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

					io.to(socketId1).emit('matched', { partnerSocketId: socketId2 });
					io.to(socketId2).emit('matched', { partnerSocketId: socketId1 });
				}
			}
		}
	});
}
