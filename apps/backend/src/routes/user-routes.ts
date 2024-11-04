/* eslint-disable @typescript-eslint/no-explicit-any */
// routes/userRoutes.ts
import express, { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Server } from 'socket.io'; // Import Socket.io type

import { setUserOnlineStatus } from '../helpers/redis-helpers';
import { User } from '../models/user';
import { authenticate } from '../middleware/auth';
import { emitFriendStatusChange } from '../helpers/socket-emitters'; // Import the emitter for friend status

export const createUserRoutes = (io: Server) => {
	const router = express.Router();

	router.post('/register', async (req: Request, res: Response) => {
		const { firstName, lastName, email, country, gender, age, password } = req.body;

		if (!firstName || !lastName || !email || !country || !gender || !age || !password) {
			res.status(400).json({ error: 'All fields are required' });

			return;
		}

		try {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const newUser = new User({ firstName, lastName, email, country, gender, age, password: hashedPassword });

			await newUser.save();

			res.status(201).json({ message: 'User registered successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });

			return;
		}
	});

	router.post('/login', async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ error: 'Email and password are required' });

			return;
		}

		try {
			const user = await User.findOne({ email });

			if (!user || !(await bcrypt.compare(password, user.password))) {
				res.status(400).json({ error: 'Invalid email or password' });

				return;
			}

			const sessionToken = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN_KEY as string, { expiresIn: '30m' });

			user.sessionToken = sessionToken;
			user.isOnline = true;
			await user.save();

			await setUserOnlineStatus(user._id.toString(), true);

			// Emit online status change to friends
			await emitFriendStatusChange(io, user._id.toString(), true); // Emit online status change

			res.setHeader('x-access-token', sessionToken);
			res.status(200).json({ message: 'Login successful', ok: true, data: { user } });
		} catch (error) {
			res.status(500).json({ error: (error as any).message });
		}
	});

	router.post('/logout', authenticate, async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			res.status(400).json({ error: 'User not found' });

			return;
		}

		user.sessionToken = '';
		user.isOnline = false;
		await user.save();

		// Update offline status in Redis
		await setUserOnlineStatus(user._id.toString(), false);

		// Emit offline status change to friends
		await emitFriendStatusChange(io, user._id.toString(), false); // Emit offline status change

		res.status(200).json({ message: 'Logout successful' });
	});

	router.get('/is-auth', authenticate, (_req, res) => {
		res.status(200).json({ message: 'OK' });
	});

	router.get('/user/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const user = await User.findById(id).select('-password -sessionToken -friendsList -notifications').exec();

			if (!user) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			res.status(200).json({ data: { user } });
		} catch (error) {
			res.status(500).json({ error: (error as any).message });
		}
	});

	return router;
};
