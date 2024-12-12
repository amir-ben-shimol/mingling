import { UserDB } from '@mingling/database';
import type { Notification, UserDetails } from '@mingling/types';
import { getUserIdBySocketId, getOnlineFriends } from '@mingling/redis';
import { emitFriendsListUpdate } from '@mingling/socket';
import { addNotificationToQueue } from '../rabbitmq/publisher/notification';

/**
 * Send a friend request.
 */
export const sendFriendRequest = async (requesterId: string, partnerSocketId: string) => {
	const resolvedFriendUserId = await getUserIdBySocketId(partnerSocketId);

	if (!resolvedFriendUserId) throw new Error('User not found for given socket ID');

	const requester = await UserDB.findById(requesterId);
	const recipient = await UserDB.findById(resolvedFriendUserId);

	if (!requester || !recipient) throw new Error('User not found');

	const isAlreadyFriend = requester.friendsList.some((friend) => friend.userId.toString() === resolvedFriendUserId && friend.status === 'approved');
	const isRequestReceived = recipient.friendsList.some((friend) => friend.userId.toString() === requesterId && friend.status === 'incoming');

	if (isAlreadyFriend || isRequestReceived) throw new Error('Friend request already sent or exists');

	requester.friendsList.push({ userId: resolvedFriendUserId, status: 'pending' });
	recipient.friendsList.push({ userId: requesterId, status: 'incoming' });

	await requester.save();
	await recipient.save();

	const notification: Omit<Notification, 'id' | 'timestamp'> = {
		varient: 'info',
		type: 'friend-request',
		title: 'Friend Request',
		content: `${requester.firstName} ${requester.lastName} sent you a friend request.`,
		fromUserId: requesterId,
		toUserId: resolvedFriendUserId,
	};

	await addNotificationToQueue(notification);
	await emitFriendsListUpdate(requesterId);
	await emitFriendsListUpdate(resolvedFriendUserId);

	return { message: 'Friend request sent successfully' };
};

/**
 * Respond to a friend request.
 */
export const respondToFriendRequest = async (recipientId: string, friendId: string, status: 'approved' | 'declined', recipientNotificationId?: string) => {
	const recipient = await UserDB.findById(recipientId);
	const requester = await UserDB.findById(friendId);

	if (!recipient || !requester) throw new Error('User not found');

	const recipientFriend = recipient.friendsList.find((f) => f.userId.toString() === friendId);
	const requesterFriend = requester.friendsList.find((f) => f.userId.toString() === recipientId);

	if (recipientFriend) recipientFriend.status = status;

	if (requesterFriend) requesterFriend.status = status;

	await recipient.save();
	await requester.save();

	const notificationContent =
		status === 'approved'
			? `${requester.firstName} ${requester.lastName} is now your friend.`
			: `You declined ${requester.firstName} ${requester.lastName}'s friend request.`;

	if (recipientNotificationId) {
		const updatedNotification: Omit<Notification, 'timestamp'> = {
			title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
			content: notificationContent,
			type: 'system',
			toUserId: recipientId,
			fromUserId: friendId,
			id: recipientNotificationId,
		};

		await addNotificationToQueue(updatedNotification);
	} else {
		const recipientNotification: Omit<Notification, 'id' | 'timestamp'> = {
			varient: 'info',
			type: 'system',
			fromUserId: friendId,
			toUserId: recipientId,
			title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
			content: notificationContent,
		};

		await addNotificationToQueue(recipientNotification);
	}

	const requesterNotification: Omit<Notification, 'id' | 'timestamp'> = {
		varient: 'info',
		type: 'system',
		fromUserId: recipientId,
		toUserId: friendId,
		title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
		content:
			status === 'approved'
				? `${recipient.firstName} ${recipient.lastName} approved your friend request.`
				: `${recipient.firstName} ${recipient.lastName} declined your friend request.`,
	};

	await addNotificationToQueue(requesterNotification);

	await emitFriendsListUpdate(recipientId);
	await emitFriendsListUpdate(friendId);

	return { message: `Friend request ${status}` };
};

/**
 * Remove a friend.
 */
export const removeFriend = async (userId: string, friendId: string) => {
	const user = await UserDB.findById(userId);
	const friend = await UserDB.findById(friendId);

	if (!user || !friend) throw new Error('User or friend not found');

	const userFriendIndex = user.friendsList.findIndex((f) => f.userId.toString() === friendId);
	const friendUserIndex = friend.friendsList.findIndex((f) => f.userId.toString() === userId);

	if (userFriendIndex === -1 || friendUserIndex === -1) throw new Error('Not friends with the specified user');

	user.friendsList.splice(userFriendIndex, 1);
	friend.friendsList.splice(friendUserIndex, 1);

	await user.save();
	await friend.save();

	const notification: Omit<Notification, 'id' | 'timestamp'> = {
		varient: 'success',
		type: 'system',
		title: 'Friend Removed',
		content: `You removed ${friend.firstName} ${friend.lastName} from your friends list.`,
		fromUserId: userId,
		toUserId: friendId,
	};

	await addNotificationToQueue(notification);

	await emitFriendsListUpdate(userId);
	await emitFriendsListUpdate(friendId);

	return { message: 'Friend removed successfully' };
};

/**
 * Get the friends list.
 */
export const getFriendsList = async (userId: string) => {
	const user = await UserDB.findById(userId).select('friendsList').populate({
		path: 'friendsList.userId',
		select: 'firstName lastName email country gender age profilePictureUrl',
	});

	if (!user) throw new Error('User not found');

	const friendsIdList = user.friendsList.map((friend) => (friend.userId as unknown as UserDetails)._id.toString());
	const onlineFriendsList = await getOnlineFriends(friendsIdList);

	const friendsListWithDetails = user.friendsList.map((friend) => ({
		status: friend.status,
		userDetails: {
			...JSON.parse(JSON.stringify(friend.userId)),
			isOnline: onlineFriendsList.includes((friend.userId as unknown as UserDetails)._id.toString()),
		},
	}));

	return { data: friendsListWithDetails };
};
