import { generateObjectId, UserDB, type Document } from '@mingling/database';
import { type Notification } from '@mingling/types';
import { getSocketServer } from '@mingling/socket';
import { notifyUser } from '../rabbitmq/publisher/notify-user';

export const createNotification = async (userId: string, notificationData: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> => {
	const notification: Notification = {
		...notificationData,
		id: generateObjectId(),
		timestamp: new Date(),
	};

	const user = await UserDB.findById(userId);

	if (!user) throw new Error('User not found');

	user.notifications.push(notification);
	await user.save();

	await notifyUser(userId, 'notification', notificationData);

	return notification;
};

export async function updateNotification(updatedNotification: Partial<Omit<Notification, 'timestamp'>>): Promise<Notification> {
	const user = await UserDB.findById(updatedNotification.toUserId);

	if (!user) throw new Error('User not found');

	const notificationIndex = user.notifications.findIndex((n) => n.id === updatedNotification.id);

	if (notificationIndex === -1) throw new Error('Notification not found');

	const existingNotification = user.notifications[notificationIndex] as unknown as Document;

	Object.assign(existingNotification, updatedNotification, {
		timestamp: existingNotification.get('timestamp') || new Date(),
	});

	await user.save();

	return existingNotification.toObject() as Notification;
}

export const deleteNotification = async (userId: string, notificationId: string): Promise<{ message: string }> => {
	const user = await UserDB.findById(userId);

	if (!user) throw new Error('User not found');

	user.notifications = user.notifications.filter((n) => n.id !== notificationId);
	await user.save();

	const io = getSocketServer();

	io.to(userId).emit('notification-deleted', { notificationId });

	return { message: 'Notification removed successfully' };
};
