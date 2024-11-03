// routes/notificationsRoutes.ts
import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { type Notification } from '@mingling/types';
import { User } from '../models/user';
import { authenticate } from '../middleware/auth';

const router = express.Router();

export async function createNotification(userId: string, notificationData: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> {
	const notification: Notification = {
		...notificationData,
		id: new mongoose.Types.ObjectId().toHexString(),
		timestamp: new Date(),
	};

	const user = await User.findById(userId);

	if (!user) throw new Error('User not found');

	user.notifications.push(notification);
	await user.save();

	return notification;
}

export async function updateNotification(
	userId: string,
	notificationId: string,
	updateData: Partial<Omit<Notification, 'id' | 'timestamp'>>,
): Promise<Notification> {
	const user = await User.findById(userId);

	if (!user) throw new Error('User not found');

	const notificationIndex = user.notifications.findIndex((n) => n.id === notificationId);

	if (notificationIndex === -1) throw new Error('Notification not found');

	const existingNotification = user.notifications[notificationIndex] as unknown as mongoose.Document;

	Object.assign(existingNotification, updateData, {
		timestamp: existingNotification.get('timestamp') || new Date(),
	});

	await user.save();

	return existingNotification.toObject() as Notification;
}

export async function deleteNotification(userId: string, notificationId: string): Promise<{ message: string }> {
	const user = await User.findById(userId);

	if (!user) throw new Error('User not found');

	user.notifications = user.notifications.filter((n) => n.id !== notificationId);
	await user.save();

	return { message: 'Notification removed successfully' };
}

router.delete('/delete/:notificationId', authenticate, async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { notificationId } = req.params;

	if (!userId || !notificationId) {
		res.status(400).json({ error: 'User ID and notification ID are required' });

		return;
	}

	try {
		const result = await deleteNotification(userId, notificationId);

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while trying to remove notification' });
	}
});

export default router;
