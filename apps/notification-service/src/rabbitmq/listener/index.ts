import { setupNotificationQueueListener } from './notification';

export const createQueueListener = async () => {
	await Promise.all([setupNotificationQueueListener()]);
};
