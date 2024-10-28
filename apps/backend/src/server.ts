import http from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import type { User } from '@mingling/types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Basic routes for health check
// app.get('/', (_req, res) => res.send('Server is running'));

const onlineUsers: Map<string, User> = new Map();

io.on('connection', (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on('join', (user: User) => {
		onlineUsers.set(socket.id, user);
		socket.broadcast.emit('user-joined', user);
	});

	socket.on('start-chat', () => {
		// Match with an online user
		const availableUsers = Array.from(onlineUsers.values());

		console.log('availableUsers -->', availableUsers);
		// Logic to match users here, e.g., using random pairing
		// Emit event to the matched users
	});

	socket.on('disconnect', () => {
		onlineUsers.delete(socket.id);
		socket.broadcast.emit('user-left', socket.id);
	});
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
