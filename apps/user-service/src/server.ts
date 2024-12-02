/* eslint-disable import/first */
// server.ts
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { connectToDatabase } from '@mingling/database';
import { createUserRoutes } from './routes/user-routes';

const app = express();

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

app.use('/api/user', createUserRoutes());

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
