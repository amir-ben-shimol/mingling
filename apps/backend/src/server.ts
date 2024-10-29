import http from 'node:http';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { configureSockets } from './config/socket-config';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
	cors: {
		origin: '*', // Set your frontend origin here
		methods: ['GET', 'POST'],
	},
});

app.get('/', (_, res) => {
	res.send('WebRTC Signaling Server is running');
});

// Configure Socket.io
configureSockets(io);

const PORT = 3000;

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
