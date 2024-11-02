/* eslint-disable @typescript-eslint/no-explicit-any */
// routes/userRoutes.ts
import express, { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

const router = express.Router();

// Register user
router.post('/register', async (req: Request, res: Response) => {
	console.log('inside of register route', req.body);
	const { firstName, lastName, email, country, gender, age, password } = req.body;

	if (!firstName || !lastName || !email || !country || !gender || !age || !password) {
		res.status(400).json({ error: 'All fields are required' });

		return;
	}

	try {
		// Hash the password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create a new user with hashed password
		const newUser = new User({ firstName, lastName, email, country, gender, age, password: hashedPassword });

		await newUser.save();

		res.status(201).json({ message: 'User registered successfully' });
	} catch (error: any) {
		res.status(400).json({ error: error.message });

		return;
	}
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ error: 'Email and password are required' });

		return;
	}

	try {
		// Find user by email
		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).json({ error: 'Invalid email or password' });

			return;
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			res.status(400).json({ error: 'Invalid email or password' });

			return;
		}

		// Send success response
		res.status(200).json({ message: 'Login successful', user });
	} catch (error) {
		res.status(500).json({ error: 'An error occurred during login' });
	}
});

export default router;
