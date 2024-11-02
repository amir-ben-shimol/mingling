/* eslint-disable @typescript-eslint/no-explicit-any */
// routes/userRoutes.ts
import express, { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { authenticate } from '../middleware/auth';

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
		await user.save();

		res.setHeader('x-access-token', sessionToken);

		res.status(200).json({ message: 'Login successful', ok: true, data: { user } });
	} catch (error) {
		res.status(500).json({ error: (error as any).message });
	}
});

router.get('/is-auth', authenticate, (_req, res) => {
	res.status(200).json({ message: 'OK' });
});

export default router;
