/* eslint-disable import/first */
// server.ts
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { connectToDatabase } from '@mingling/database';
import friendRoutes from './routes/friend-routes';
// import { errorHandler } from './middlewares/error-handler';

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
app.use('/api/friends', friendRoutes);

// app.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
