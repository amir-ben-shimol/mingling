/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
// routes/userRoutes.ts
import { Readable } from 'node:stream';
import express, { type Request, type Response } from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { setUserOnlineStatus } from '@mingling/redis';
import { emitFriendUpdate } from '@mingling/socket';
import { UserDB } from '@mingling/database';
import { DeleteObjectCommand, ListObjectsCommand, type PutObjectRequest } from '@aws-sdk/client-s3';

import s3 from '../config/s3-config';
import { generateProfileImageKey } from '../helpers/s3-helpers';
import { getUserIdFromHeaders } from '../helpers/headers';

export const createUserRoutes = () => {
	const router = express.Router();
	const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to keep the file in memory

	router.post('/register', async (req: Request, res: Response) => {
		const { firstName, lastName, email, country, gender, age, password } = req.body;

		if (!firstName || !lastName || !email || !country || !gender || !age || !password) {
			res.status(400).json({ error: 'All fields are required' });

			return;
		}

		try {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const newUser = new UserDB({ firstName, lastName, email, country, gender, age, password: hashedPassword });

			await newUser.save();

			res.status(201).json({ message: 'User registered successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });

			return;
		}
	});

	router.post('/login', async (req: Request, res: Response) => {
		const { email, password } = req.body;

		console.log('Inside login');

		if (!email || !password) {
			res.status(400).json({ error: 'Email and password are required' });

			return;
		}

		try {
			const user = await UserDB.findOne({ email });

			if (!user || !(await bcrypt.compare(password, user.password))) {
				res.status(400).json({ error: 'Invalid email or password' });

				return;
			}

			const sessionToken = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN_KEY as string, { expiresIn: '30m' });

			user.sessionToken = sessionToken;
			await user.save();

			await setUserOnlineStatus(user._id.toString(), true);

			// Emit online status change to friends
			await emitFriendUpdate(user._id.toString(), { isOnline: true });

			res.setHeader('x-access-token', sessionToken);
			res.status(200).json({ message: 'Login successful', ok: true, data: { user } });
		} catch (error) {
			res.status(500).json({ error: (error as any).message });
		}
	});

	router.post('/logout', async (req: Request, res: Response) => {
		console.log('Inside logout');
		console.log('Received headers:', req.headers);
		console.log('Received body:', req.body); // Expecting {}

		const userId = getUserIdFromHeaders(req);

		console.log('User ID:', userId);

		if (!userId) {
			res.status(404).json({ message: 'User not found' });

			return;
		}

		const user = await UserDB.findById(userId);

		console.log('User:', user);

		if (!user) {
			res.status(404).json({ error: 'User not found' });

			return;
		}

		user.sessionToken = '';
		await user.save();

		await setUserOnlineStatus(user._id.toString(), false);
		await emitFriendUpdate(user._id.toString(), { isOnline: false });

		res.status(200).json({ data: 'ok', message: 'Logout successful' });
	});

	router.get('/is-auth', (_req, res) => {
		res.status(200).json({ message: 'OK' });
	});

	router.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			res.status(400).json({ error: 'User ID is required' });

			return;
		}

		try {
			const user = await UserDB.findById(id).select('-password -sessionToken -friendsList -notifications').exec();

			if (!user) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			res.status(200).json({ data: user });
		} catch (error) {
			res.status(500).json({ error: (error as any).message });
		}
	});

	router.post('/upload-profile-picture', upload.single('profilePicture'), async (req: Request, res: Response) => {
		const userId = getUserIdFromHeaders(req);

		console.log('inside of upload-profile-picture with userId:', userId);

		if (!userId) {
			res.status(400).json({ error: 'User ID is required' });

			return;
		}

		const file = req.file;

		if (!file) {
			res.status(400).json({ error: 'No file uploaded' });

			return;
		}

		console.log('File:', file);

		const bucketName = process.env.S3_BUCKET_NAME;
		const key = generateProfileImageKey(userId, file); // Unique key with timestamp

		console.log('Key:', key, 'Bucket:', bucketName);

		try {
			// Step 1: List existing images in the user's folder
			const listParams = {
				Bucket: bucketName,
				Prefix: `${userId}/assets/profile`, // Look for files in the user’s profile folder
			};

			const listedObjects = await s3.send(new ListObjectsCommand(listParams));

			// Step 2: Delete any existing images found in the user’s profile folder
			if (listedObjects.Contents && listedObjects.Contents.length > 0) {
				const deletePromises = listedObjects.Contents.map((object) => s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key! })));

				await Promise.all(deletePromises);
			}

			// Step 3: Upload the new profile picture
			const params: PutObjectRequest = {
				Bucket: bucketName,
				Key: key,
				Body: Readable.from(file.buffer),
				ContentType: file.mimetype,
				ACL: 'public-read',
			};

			const upload = new Upload({
				client: s3,
				params,
			});

			const response = await upload.done();

			const profilePictureUrl = response.Location || `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`;

			if (process.env.NODE_ENV === 'production') {
				await UserDB.findByIdAndUpdate(userId, { profilePictureUrl: profilePictureUrl }, { new: true });
				await emitFriendUpdate(userId.toString(), { profilePictureUrl: profilePictureUrl });
			} else {
				const currentIp = process.env.CURRENT_IP || 'localhost';
				const localProfilePictureUrl = profilePictureUrl.replace('minio', currentIp);

				await UserDB.findByIdAndUpdate(userId, { profilePictureUrl: localProfilePictureUrl });
				await emitFriendUpdate(userId.toString(), { profilePictureUrl: localProfilePictureUrl });
			}

			res.status(200).json({ message: 'Profile picture uploaded successfully', ok: true });
		} catch (error) {
			console.error('Error uploading file:', error);
			res.status(500).json({ error: 'An error occurred during file upload' });
		}
	});

	return router;
};
