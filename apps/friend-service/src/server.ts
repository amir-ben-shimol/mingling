/* eslint-disable import/first */
// server.ts
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { connectToDatabase } from '@mingling/database';
import { createFriendRoutes } from './routes/friend-routes';

const app = express();

app.use((_req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use(express.json());

app.use((req, _res, next) => {
	console.log('Incoming request:', {
		method: req.method,
		path: req.path,
		headers: req.headers,
		body: req.body,
	});
	next();
});

const server = http.createServer(app);

connectToDatabase();

// Use user routes
app.use('/api/friends', createFriendRoutes());

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
