import { listenToQueue, NOTIFICATIONS_QUEUE } from '@mingling/rabbitmq';
import type { Notification } from '@mingling/types';
import { createNotification, updateNotification } from '../../services/notification-service';

export const setupNotificationQueueListener = async () => {
	await listenToQueue(NOTIFICATIONS_QUEUE, async (message) => {
		if (!message) {
			console.warn('Received null message from notifications queue');

			return;
		}

		const notification: Omit<Notification, 'timestamp'> = JSON.parse(message.content.toString());

		console.log('Processing notification:', notification);

		if (!notification.toUserId) {
			console.warn('Received notification without a recipient:', notification);

			return;
		}

		if (notification.id) {
			await updateNotification(notification);
		} else {
			await createNotification(notification.toUserId, notification);
		}
	});
};
