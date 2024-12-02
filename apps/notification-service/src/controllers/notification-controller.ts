import { type Request, type Response } from 'express';
import { createNotification, deleteNotification } from '../services/notification-service';

export const createNotificationHandler = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const notificationData = req.body;

	if (!userId || !notificationData) {
		res.status(400).json({ error: 'User ID and notification data are required' });

		return;
	}

	try {
		const notification = await createNotification(userId, notificationData);

		res.status(201).json(notification);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while creating the notification' });
	}
};

export const deleteNotificationHandler = async (req: Request, res: Response) => {
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
		res.status(500).json({ error: 'An error occurred while deleting the notification' });
	}
};
