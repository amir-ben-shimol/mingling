/* eslint-disable import/first */
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { connectToDatabase } from '@mingling/database';
import { configureSockets, configureSocketServer } from '@mingling/socket';
import notificationsRoutes from './routes/notifications-routes';

const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = configureSocketServer(server);

connectToDatabase();
configureSockets(io);

// Use user routes
app.use('/api/notifications', notificationsRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
