/* eslint-disable @typescript-eslint/no-explicit-any */
// src/helpers/redis-helpers.ts

import redisClient from '../config/redis-config';
import type { GroupData } from '../types/playground';

// Set or remove user's online status in Redis
export const setUserOnlineStatus = async (userId: string, isOnline: boolean): Promise<void> => {
	await redisClient.hSet('onlineUsers', userId, isOnline ? '1' : '0');
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

export const createGroup = async (groupId: string, groupData: GroupData): Promise<void> => {
	await redisClient.hSet(`group:${groupId}`, {
		groupId: groupData.groupId,
		inPlayground: groupData.inPlayground ? '1' : '0',
		inChat: groupData.inChat ? '1' : '0',
		chatPartnerGroupId: groupData.chatPartnerGroupId || '',
	});

	// Store memberSocketIds as a Redis Set
	const memberSocketsKey = `group:${groupId}:memberSocketIds`;

	if (groupData.memberSocketIds && groupData.memberSocketIds.size > 0) {
		const members = Array.from(groupData.memberSocketIds) as string[];

		await redisClient.sAdd(memberSocketsKey, members);
	}
};

export const getGroup = async (groupId: string): Promise<GroupData | null> => {
	const groupKey = `group:${groupId}`;
	const groupData = await redisClient.hGetAll(groupKey);

	if (Object.keys(groupData).length === 0) {
		return null;
	}

	const memberSocketsKey = `group:${groupId}:memberSocketIds`;
	const memberSocketIds = await redisClient.sMembers(memberSocketsKey);

	if (!groupData['groupId']) return null;

	return {
		groupId: groupData['groupId'],
		memberSocketIds: new Set(memberSocketIds),
		inPlayground: groupData['inPlayground'] === '1',
		inChat: groupData['inChat'] === '1',
		chatPartnerGroupId: groupData['chatPartnerGroupId'] || null,
	};
};

export const updateGroup = async (groupId: string, updates: Partial<GroupData>): Promise<void> => {
	const groupKey = `group:${groupId}`;
	const updatesToSet: { [key: string]: string } = {};

	if (updates.inPlayground !== undefined) {
		updatesToSet['inPlayground'] = updates.inPlayground ? '1' : '0';
	}

	if (updates.inChat !== undefined) {
		updatesToSet['inChat'] = updates.inChat ? '1' : '0';
	}

	if (updates.chatPartnerGroupId !== undefined) {
		updatesToSet['chatPartnerGroupId'] = updates.chatPartnerGroupId || '';
	}

	if (updates.groupId !== undefined) {
		updatesToSet['groupId'] = updates.groupId;
	}

	if (Object.keys(updatesToSet).length > 0) {
		await redisClient.hSet(groupKey, updatesToSet);
	}

	if (updates.memberSocketIds) {
		const memberSocketsKey = `group:${groupId}:memberSocketIds`;
		// Replace the set with the new values

		await redisClient.del(memberSocketsKey);

		if (updates.memberSocketIds.size > 0) {
			const members = Array.from(updates.memberSocketIds) as string[];

			await redisClient.sAdd(memberSocketsKey, members);
		}
	}
};

export const deleteGroup = async (groupId: string): Promise<void> => {
	const groupKey = `group:${groupId}` as any;
	const memberSocketsKey = `group:${groupId}:memberSocketIds`;

	await redisClient.del(groupKey, memberSocketsKey);
};

export const addGroupToAvailableGroups = async (groupId: string): Promise<void> => {
	await redisClient.sAdd('availableGroups', groupId);
};

export const removeGroupFromAvailableGroups = async (groupId: string): Promise<void> => {
	await redisClient.sRem('availableGroups', groupId);
};

export const setSocketGroupId = async (socketId: string, groupId: string): Promise<void> => {
	await redisClient.set(`socketGroup:${socketId}`, groupId);
};

export const getSocketGroupId = async (socketId: string): Promise<string | null> => {
	return await redisClient.get(`socketGroup:${socketId}`);
};

export const deleteSocketGroupId = async (socketId: string): Promise<void> => {
	await redisClient.del(`socketGroup:${socketId}`);
};

export const getAvailableGroupToMatch = async (excludeGroupId: string) => {
	// Get all available groups excluding the current groupId
	const availableGroups = await redisClient.sMembers('availableGroups');
	const otherGroupIds = availableGroups.filter((id) => id !== excludeGroupId);

	return otherGroupIds.length > 0 ? otherGroupIds[0] : null;
};
