// src/helpers/redis-helpers.ts
import redisClient from '../config/redis-config';

// Online status functions
export const setUserOnlineStatus = async (userId: string, isOnline: boolean): Promise<void> => {
	await redisClient.hSet('onlineUsers', userId, isOnline ? '1' : '0');
};

export const getUserOnlineStatus = async (userId: string): Promise<boolean> => {
	const status = await redisClient.hGet('onlineUsers', userId);

	return status === '1';
};

export const getOnlineFriends = async (friendIds: string[]): Promise<string[]> => {
	const statuses = await redisClient.hmGet('onlineUsers', friendIds);

	return friendIds.filter((_, index) => statuses[index] === '1');
};

// User-socket mapping functions
export const setUserSocket = async (userId: string, socketId: string): Promise<void> => {
	// Map userId to socketId
	await redisClient.set(`userSocket:${userId}`, socketId);
	// Map socketId to userId
	await redisClient.set(`socketUser:${socketId}`, userId);
};

export const getSocketIdByUserId = async (userId: string): Promise<string | null> => {
	// Retrieve socketId by userId
	return await redisClient.get(`userSocket:${userId}`);
};

export const deleteUserSocket = async (userId: string): Promise<void> => {
	// Retrieve the socketId before deletion to also remove the reverse mapping
	const socketId = await getSocketIdByUserId(userId);

	if (socketId) {
		await redisClient.del(`socketUser:${socketId}`);
	}

	await redisClient.del(`userSocket:${userId}`);
};

export const setSocketUser = async (socketId: string, userId: string): Promise<void> => {
	// Map socketId to userId
	await redisClient.set(`socketUser:${socketId}`, userId);
	// Map userId to socketId
	await redisClient.set(`userSocket:${userId}`, socketId);
};

export const getUserIdBySocketId = async (socketId: string): Promise<string | null> => {
	// Retrieve userId by socketId
	return await redisClient.get(`socketUser:${socketId}`);
};

export const deleteSocketUser = async (socketId: string): Promise<void> => {
	// Retrieve the userId before deletion to also remove the reverse mapping
	const userId = await getUserIdBySocketId(socketId);

	if (userId) {
		await redisClient.del(`userSocket:${userId}`);
	}

	await redisClient.del(`socketUser:${socketId}`);
};

// src/helpers/redis-helpers.ts
// import redisClient from '../config/redis-config';

// // Online status functions
// export const setUserOnlineStatus = async (userId: string, isOnline: boolean) => {
// 	await redisClient.hSet('onlineUsers', userId, isOnline ? '1' : '0');
// };

// export const getUserOnlineStatus = async (userId: string): Promise<boolean> => {
// 	const status = await redisClient.hGet('onlineUsers', userId);

// 	return status === '1';
// };

// export const getOnlineFriends = async (friendIds: string[]): Promise<string[]> => {
// 	const statuses = await redisClient.hmGet('onlineUsers', friendIds);

// 	return friendIds.filter((_, index) => statuses[index] === '1');
// };

// // User-socket mapping functions using hash tables
// export const setUserSocket = async (userId: string, socketId: string) => {
// 	await redisClient.hSet('userSocket', userId, socketId);
// 	await redisClient.hSet('socketUser', socketId, userId);
// };

// export const getSocketIdByUserId = async (userId: string) => {
// 	try {
// 		const socketId = await redisClient.hGet('userSocket', userId);

// 		return socketId;
// 	} catch (error) {
// 		console.error('Error getting socketId by userId:', error);

// 		return;
// 	}
// };

// export const deleteUserSocket = async (userId: string) => {
// 	const socketId = await getSocketIdByUserId(userId);

// 	if (socketId) {
// 		await redisClient.hDel('socketUser', socketId);
// 	}

// 	await redisClient.hDel('userSocket', userId);
// };

// export const setSocketUser = async (socketId: string, userId: string) => {
// 	await redisClient.hSet('socketUser', socketId, userId);
// 	await redisClient.hSet('userSocket', userId, socketId);
// };

// export const getUserIdBySocketId = async (socketId: string) => {
// 	const userId = await redisClient.hGet('socketUser', socketId);

// 	return userId;
// };

// export const deleteSocketUser = async (socketId: string) => {
// 	const userId = await getUserIdBySocketId(socketId);

// 	if (userId) {
// 		await redisClient.hDel('userSocket', userId);
// 	}

// 	await redisClient.hDel('socketUser', socketId);
// };
