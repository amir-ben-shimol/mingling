// src/helpers/redis-helpers.ts

import redisClient from '../config/redis-config';

// Set or remove user's online status in Redis
export const setUserOnlineStatus = async (userId: string, isOnline: boolean): Promise<void> => {
	await redisClient.hSet('onlineUsers', userId, isOnline ? '1' : '0');
};

// Check if a user is currently online in Redis
export const getUserOnlineStatus = async (userId: string): Promise<boolean> => {
	const status = await redisClient.hGet('onlineUsers', userId);

	return status === '1';
};

// Get online status for multiple friends
export const getOnlineFriends = async (friendIds: string[]): Promise<string[]> => {
	const statuses = await redisClient.hmGet('onlineUsers', friendIds);

	return friendIds.filter((_, index) => statuses[index] === '1');
};

// User-socket mapping functions
export const setUserSocket = async (userId: string, socketId: string): Promise<void> => {
	await redisClient.set(`userSocket:${userId}`, socketId);
	await redisClient.set(`socketUser:${socketId}`, userId);
};

export const getSocketIdByUserId = async (userId: string): Promise<string | null> => {
	return await redisClient.get(`userSocket:${userId}`);
};

export const deleteUserSocket = async (userId: string): Promise<void> => {
	const socketId = await getSocketIdByUserId(userId);

	if (socketId) await redisClient.del(`socketUser:${socketId}`);

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
