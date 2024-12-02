import { setupSocketEventListener } from './socket-event';

export const createQueueListener = async () => {
	await Promise.all([setupSocketEventListener()]);
};
