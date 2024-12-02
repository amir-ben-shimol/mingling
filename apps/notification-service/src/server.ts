/* eslint-disable import/first */
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { connectToDatabase } from '@mingling/database';
import notificationsRoutes from './routes/notifications-routes';
import { createQueueListener } from './rabbitmq/listener';

const app = express();

app.use(express.json());

const server = http.createServer(app);

connectToDatabase();
createQueueListener();

// Use user routes
app.use('/api/notifications', notificationsRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
