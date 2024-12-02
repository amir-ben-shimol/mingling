import { UserDB } from '@mingling/database';
import type { UserDetails } from '@mingling/types';
import { getOnlineFriends } from '@mingling/redis';
import { notifyUser } from '../rabbitmq/publisher/notify-user';

// Helper function to emit friends list updates
export async function emitFriendsListUpdate(userId: string) {
	try {
		const user = await UserDB.findById(userId).select('friendsList').populate({
			path: 'friendsList.userId',
			select: 'firstName lastName email country gender age profilePictureUrl',
		});

		if (user) {
			const friendsIdList = user.friendsList.map((friend) => (friend.userId as unknown as UserDetails)._id.toString());

			const onlineFriendsList = friendsIdList.length > 0 ? await getOnlineFriends(friendsIdList) : [];

			const friendsListWithDetails = user.friendsList.map((friend) => ({
				status: friend.status,
				userDetails: {
					...JSON.parse(JSON.stringify(friend.userId)),
					isOnline: onlineFriendsList.includes((friend.userId as unknown as UserDetails)._id.toString()),
				},
			}));

			notifyUser(userId, 'friendsListUpdate', friendsListWithDetails);
		}
	} catch (error) {
		console.error(`Failed to emit friends list update: ${error}`);
	}
}

export async function emitFriendUpdate(userId: string, updatedFields: Partial<UserDetails>) {
	const user = await UserDB.findById(userId).select('friendsList');

	if (user) {
		for (const friend of user.friendsList) {
			if (friend.status === 'approved') {
				notifyUser(friend.userId, 'friendUpdate', { userId, ...updatedFields });
			}
		}
	}
}
