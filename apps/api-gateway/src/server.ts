/* eslint-disable import/first */
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { configureSockets, configureSocketServer } from '@mingling/socket';
import { connectToDatabase } from '@mingling/database';
import { createQueueListener } from './rabbitmq/listener';
import proxyMiddleware from './middleware/proxy';
import { authenticate } from './middleware/auth';

const app = express();

app.use(express.json());

const server = http.createServer(app);
const io = configureSocketServer(server);

configureSockets(io);
connectToDatabase();
createQueueListener();

app.use((req, _res, next) => {
	console.log('Incoming request:', {
		method: req.method,
		path: req.path,
		headers: req.headers,
		body: req.body,
	});
	next();
});

app.use('/api/user/register', proxyMiddleware('http://user_service:8080'));
app.use('/api/user/login', proxyMiddleware('http://user_service:8080'));
app.use('/api/user', authenticate, proxyMiddleware('http://user_service:8080'));
app.use('/api/friends', authenticate, proxyMiddleware('http://friend_service:3001'));
app.use('/api/notifications', authenticate, proxyMiddleware('http://notification_service:4000'));

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`API Gateway is running on http://localhost:${PORT}`);
});
