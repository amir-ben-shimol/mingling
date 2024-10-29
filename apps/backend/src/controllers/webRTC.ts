import type { Server as SocketIOServer, Socket } from 'socket.io';

export const handleSignaling = (socket: Socket, io: SocketIOServer) => {
	console.log(`User connected: ${socket.id}`);
	console.log('User io: ' + io);
	// Receive offer from a peer and broadcast it to the other peer
	socket.on('offer', (offer) => {
		socket.broadcast.emit('offer', offer);
	});

	// Receive answer from a peer and broadcast it to the other peer
	socket.on('answer', (answer) => {
		socket.broadcast.emit('answer', answer);
	});

	// Receive ICE candidate and broadcast it to the other peer
	socket.on('candidate', (candidate) => {
		socket.broadcast.emit('candidate', candidate);
	});
};
