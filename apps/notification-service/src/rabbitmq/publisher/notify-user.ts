import { publishToQueue, SOCKET_EVENTS_QUEUE } from '@mingling/rabbitmq';

export const notifyUser = async (userId: string, event: string, data: unknown) => {
	try {
		await publishToQueue(SOCKET_EVENTS_QUEUE, { userId, event, data });
		console.log(`Socket event queued for user ${userId}: ${event}`);
	} catch (error) {
		console.error('Failed to queue socket event:', error);

		throw error;
	}
};
