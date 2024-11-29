/* eslint-disable import/first */
// server.ts
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { connectToDatabase } from '@mingling/database';
import { configureSockets } from './config/socket-config';
import { createUserRoutes } from './routes/user-routes';
import { createFriendRoutes } from './routes/friend-routes';
import notificationsRoutes from './routes/notifications-routes';

const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
	cors: {
		origin: '*', // Replace with your frontend URL in production
		methods: ['GET', 'POST'],
	},
});

connectToDatabase();

app.get('/', (_, res) => {
	res.send('WebRTC Signaling Server is running');
});

// Use user routes
app.use('/api/users', createUserRoutes(io));
app.use('/api/friends', createFriendRoutes(io));
app.use('/api/notifications', notificationsRoutes);

// Configure Socket.io with custom socket events
configureSockets(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
