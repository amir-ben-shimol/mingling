// server.ts
import http from 'node:http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { configureSockets } from './config/socket-config';
import userRoutes from './routes/user-routes';

dotenv.config();

const app = express();

app.use(express.json()); // This middleware parses JSON bodies

const server = http.createServer(app);

const io = new SocketIOServer(server, {
	cors: {
		origin: '*', // Replace with your frontend URL in production
		methods: ['GET', 'POST'],
	},
});

const mongoUri = process.env.DATABASE_URL;

mongoose
	.connect(mongoUri)
	.then(() => console.log('Connected to MongoDB'))
	.catch((error) => console.error('Error connecting to MongoDB:', error));

app.get('/', (_, res) => {
	res.send('WebRTC Signaling Server is running');
});

// Use user routes
app.use('/api/users', userRoutes);

// Configure Socket.io with custom socket events
configureSockets(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
