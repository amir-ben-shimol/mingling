import { publishToQueue, NOTIFICATIONS_QUEUE } from '@mingling/rabbitmq';
import type { Notification } from '@mingling/types';

export const addNotificationToQueue = async (notification: Omit<Notification, 'id' | 'timestamp'> | Omit<Notification, 'timestamp'>) => {
	try {
		await publishToQueue(NOTIFICATIONS_QUEUE, notification);
		console.log('Notification added to queue:', notification);
	} catch (error) {
		console.error('Failed to publish notification:', error);

		throw error;
	}
};
