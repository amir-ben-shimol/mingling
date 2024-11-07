import type { Server } from 'socket.io';
import type { UserDetails } from '@mingling/types';
import { User } from '../models/user';
import { getOnlineFriends, getSocketIdByUserId } from './redis-helpers';

// Helper function to emit friends list updates
export async function emitFriendsListUpdate(io: Server, userId: string) {
	console.log(`Emitting friends list update for user ${userId}`);

	try {
		const user = await User.findById(userId).select('friendsList').populate({
			path: 'friendsList.userId',
			select: 'firstName lastName email country gender age profilePictureUrl',
		});

		if (user) {
			const userSocketId = await getSocketIdByUserId(userId);
			const friendsIdList = user.friendsList.map((friend) => (friend.userId as unknown as UserDetails)._id.toString());

			const onlineFriendsList = friendsIdList.length > 0 ? await getOnlineFriends(friendsIdList) : [];

			if (userSocketId) {
				const friendsListWithDetails = user.friendsList.map((friend) => ({
					status: friend.status,
					userDetails: {
						...JSON.parse(JSON.stringify(friend.userId)),
						isOnline: onlineFriendsList.includes((friend.userId as unknown as UserDetails)._id.toString()),
					},
				}));

				io.to(userSocketId).emit('friendsListUpdate', friendsListWithDetails);
			}
		}
	} catch (error) {
		console.error(`Failed to emit friends list update: ${error}`);
	}
}

export async function emitFriendUpdate(io: Server, userId: string, updatedFields: Partial<UserDetails>) {
	console.log(`Emitting friend update for user ${userId}`);
	const user = await User.findById(userId).select('friendsList');

	console.log('user', user);

	if (user) {
		for (const friend of user.friendsList) {
			if (friend.status === 'approved') {
				console.log("Found friend's status to update with userId", friend.userId);
				const friendSocketId = await getSocketIdByUserId(friend.userId);

				if (friendSocketId) {
					io.to(friendSocketId).emit('friendUpdate', { userId, ...updatedFields });
				}
			}
		}
	}
}
