import { listenToQueue, SOCKET_EVENTS_QUEUE } from '@mingling/rabbitmq';
import { emitToUser } from '@mingling/socket';
import { getSocketIdByUserId } from '@mingling/redis';

export const setupSocketEventListener = async () => {
	await listenToQueue(SOCKET_EVENTS_QUEUE, async (message) => {
		if (!message) {
			console.warn('Received null message from socket events queue');

			return;
		}

		try {
			const { userId, event, data } = JSON.parse(message.content.toString());

			if (!userId || !event || !data) {
				throw new Error('Invalid message format: userId, event, and data are required');
			}

			const userSocketId = await getSocketIdByUserId(userId);

			if (!userSocketId) {
				console.warn(`User ${userId} is not connected to the socket server`);

				return;
			}

			emitToUser(userSocketId, event, data);
			console.log(`Event emitted to user ${userId}: ${event}`);
		} catch (error) {
			console.error('Failed to process socket event:', error);
		}
	});
};
