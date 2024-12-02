/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { UserDB } from '@mingling/database';

export const authenticate = async (req: Request, res: Response, next: any) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		res.status(401).json({ error: 'Unauthorized' });

		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

		const user = await UserDB.findById((decoded as any).id);

		if (!user || user.sessionToken !== token) {
			res.status(401).json({ error: 'Invalid session or logged in elsewhere' });

			return;
		}

		req.headers['x-user-id'] = user.id;

		next();
	} catch (error) {
		res.status(401).json({ error: 'Unauthorized' });
	}
};
