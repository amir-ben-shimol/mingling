import type { Server } from 'socket.io';
import { User } from '../models/user';
import { getSocketIdByUserId } from './redis-helpers';

// Helper function to emit friends list updates
export async function emitFriendsListUpdate(io: Server, userId: string) {
	console.log(`Emitting friends list update for user ${userId}`);

	try {
		const user = await User.findById(userId).select('friendsList').populate({
			path: 'friendsList.userId',
			select: 'firstName lastName email country gender age isOnline',
		});

		if (user) {
			const userSocketId = await getSocketIdByUserId(userId);

			if (userSocketId) {
				const friendsListWithDetails = user.friendsList.map((friend) => ({
					status: friend.status,
					userDetails: friend.userId,
				}));

				io.to(userSocketId).emit('friendsListUpdate', friendsListWithDetails);
			}
		}
	} catch (error) {
		console.error(`Failed to emit friends list update: ${error}`);
	}
}

export async function emitFriendStatusChange(io: Server, userId: string, isOnline: boolean) {
	console.log(`Emitting friend status change for user ${userId}`);
	const user = await User.findById(userId).select('friendsList');

	console.log('user', user);

	if (user) {
		for (const friend of user.friendsList) {
			if (friend.status === 'approved') {
				console.log("Found friend's status to update with userId", friend.userId);
				const friendSocketId = await getSocketIdByUserId(friend.userId);

				console.log('friendSocketId', friendSocketId);

				if (friendSocketId) {
					io.to(friendSocketId).emit('friendStatusChange', { userId, isOnline });
				}
			}
		}
	}
}
