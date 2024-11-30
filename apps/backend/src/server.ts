/* eslint-disable import/first */
// server.ts
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { connectToDatabase } from '@mingling/database';
import { configureSockets, configureSocketServer } from '@mingling/socket';
import { createUserRoutes } from './routes/user-routes';
import { createFriendRoutes } from './routes/friend-routes';
import notificationsRoutes from './routes/notifications-routes';

const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = configureSocketServer(server);

connectToDatabase();
configureSockets(io);

// Use user routes
app.use('/api/users', createUserRoutes(io));
app.use('/api/friends', createFriendRoutes(io));
app.use('/api/notifications', notificationsRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
