/* eslint-disable max-lines */
import express, { type Request, type Response } from 'express';
import type { UserDetails, Notification } from '@mingling/types';
import { UserDB } from '@mingling/database';
import { type Server } from 'socket.io';
import { getOnlineFriends, getSocketIdByUserId, getUserIdBySocketId } from '../helpers/redis-helpers';
import { authenticate } from '../middleware/auth';
import { emitFriendsListUpdate } from '../helpers/socket-emitters';
import { createNotification, updateNotification } from './notifications-routes';

const router = express.Router();

export function createFriendRoutes(io: Server) {
	// Send a friend request
	router.post('/request', authenticate, async (req: Request, res: Response) => {
		const requesterId = req.user?.id;
		const { partnerSocketId } = req.body;

		try {
			const resolvedFriendUserId = await getUserIdBySocketId(partnerSocketId);

			if (!resolvedFriendUserId) {
				res.status(404).json({ error: 'User not found for given socket ID' });

				return;
			}

			const requester = await UserDB.findById(requesterId);
			const recipient = await UserDB.findById(resolvedFriendUserId);

			if (!requester || !recipient) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			// Prevent duplicate entries: Check if friend exists in both users' friend lists
			const isAlreadyFriend = requester.friendsList.some((friend) => friend.userId.toString() === resolvedFriendUserId);
			const isRequestReceived = recipient.friendsList.some((friend) => friend.userId.toString() === requesterId);

			if (isAlreadyFriend || isRequestReceived) {
				res.status(400).json({ error: 'Friend request already sent or exists' });

				return;
			}

			// Add friend request to requester's friendsList with 'pending' status
			requester.friendsList.push({ userId: resolvedFriendUserId, status: 'pending' });
			recipient.friendsList.push({ userId: requesterId, status: 'incoming' });

			await recipient.save();
			await requester.save();

			// Emit notifications and friends list updates as before
			// Create and emit a notification for the recipient
			const notification: Notification = await createNotification(resolvedFriendUserId, {
				varient: 'info',
				type: 'friend-request',
				title: 'Friend Request',
				content: `${requester.firstName} ${requester.lastName} sent you a friend request.`,
				fromUserId: requesterId,
			});

			const recipientSocketId = await getSocketIdByUserId(resolvedFriendUserId);

			if (recipientSocketId) {
				io.to(recipientSocketId).emit('notification', notification);
			}

			await emitFriendsListUpdate(io, requesterId);
			await emitFriendsListUpdate(io, resolvedFriendUserId);

			res.status(200).json({ message: 'Friend request sent successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred' });
		}
	});

	// Accept or decline a friend request
	router.post('/response', authenticate, async (req: Request, res: Response) => {
		const recipientId = req.user?.id;
		const { status, friendId, recipientNotificationId } = req.body;

		if (!['approved', 'declined'].includes(status)) {
			res.status(400).json({ error: 'Invalid status' });

			return;
		}

		try {
			const recipient = await UserDB.findById(recipientId);
			const requester = await UserDB.findById(friendId);

			if (!recipient || !requester) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			// Find and update the friend entries for both recipient and requester
			const recipientFriend = recipient.friendsList.find((f) => f.userId.toString() === friendId);
			const requesterFriend = requester.friendsList.find((f) => f.userId.toString() === recipientId);

			if (recipientFriend) recipientFriend.status = status;

			if (requesterFriend) requesterFriend.status = status;

			await recipient.save();
			await requester.save();

			// Update notification for the recipient
			let recipientNotification: Notification | null = null;

			if (recipientNotificationId) {
				recipientNotification = await updateNotification(recipientId, recipientNotificationId, {
					title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
					content:
						status === 'approved'
							? `${requester.firstName} ${requester.lastName} is now your friend.`
							: `You declined ${requester.firstName} ${requester.lastName}'s friend request.`,
					type: 'system',
				});
			} else {
				recipientNotification = await createNotification(recipientId, {
					varient: 'info',
					type: 'system',
					fromUserId: friendId,
					title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
					content:
						status === 'approved'
							? `${requester.firstName} ${requester.lastName} is now your friend.`
							: `You declined ${requester.firstName} ${requester.lastName}'s friend request.`,
				});
			}

			// Create and emit a notification for the requester
			const requesterNotification: Notification = await createNotification(friendId, {
				varient: 'info',
				type: 'system',
				fromUserId: recipientId,
				title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
				content:
					status === 'approved'
						? `${recipient.firstName} ${recipient.lastName} approved your friend request.`
						: `${recipient.firstName} ${recipient.lastName} declined your friend request.`,
			});

			const requesterSocketId = await getSocketIdByUserId(friendId);
			const recipientSocketId = await getSocketIdByUserId(recipientId);

			if (requesterSocketId) {
				io.to(requesterSocketId).emit('notification', requesterNotification);
			}

			if (recipientSocketId) {
				io.to(recipientSocketId).emit('notification', recipientNotification);
			}

			// Emit updated friends list for both users
			await emitFriendsListUpdate(io, recipientId);
			await emitFriendsListUpdate(io, friendId);

			res.status(200).json({ message: `Friend request ${status}` });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred' });
		}
	});

	// Remove a friend
	router.delete('/remove-friend/:friendId', authenticate, async (req: Request, res: Response) => {
		const userId = req.user?.id;
		const { friendId } = req.params;

		if (!friendId) {
			res.status(400).json({ error: 'Friend ID is required' });

			return;
		}

		try {
			const user = await UserDB.findById(userId);
			const friend = await UserDB.findById(friendId);

			if (!user || !friend) {
				res.status(404).json({ error: 'User or friend not found' });

				return;
			}

			// Check if they are friends
			const userFriendIndex = user.friendsList.findIndex((f) => f.userId.toString() === friendId);
			const friendUserIndex = friend.friendsList.findIndex((f) => f.userId.toString() === userId);

			if (userFriendIndex === -1 || friendUserIndex === -1) {
				res.status(400).json({ error: 'Not friends with the specified user' });

				return;
			}

			// Remove the friendship from both users' friends lists
			user.friendsList.splice(userFriendIndex, 1);
			friend.friendsList.splice(friendUserIndex, 1);

			await user.save();
			await friend.save();

			const notification: Notification = await createNotification(friendId, {
				varient: 'success',
				type: 'system',
				title: 'Friend Removed',
				content: `You removed ${friend.firstName} ${friend.lastName} from your friends list.`,
				fromUserId: userId,
			});

			const userSocketId = await getSocketIdByUserId(userId);

			if (userSocketId) {
				io.to(userSocketId).emit('notification', notification);
			}

			await emitFriendsListUpdate(io, userId);
			await emitFriendsListUpdate(io, friendId);

			res.status(200).json({ message: 'Friend removed successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred' });
		}
	});

	// Get friends list
	router.get('/friends-list', authenticate, async (req: Request, res: Response) => {
		const userId = req.user?.id;

		try {
			// Find the user and get only the friendsList field
			const user = await UserDB.findById(userId).select('friendsList').populate({
				path: 'friendsList.userId',
				select: 'firstName lastName email country gender age profilePictureUrl',
			});

			if (!user) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			const friendsIdList = user.friendsList.map((friend) => (friend.userId as unknown as UserDetails)._id.toString());

			const onlineFriendsList = await getOnlineFriends(friendsIdList);

			const friendsListWithDetails = user.friendsList.map((friend) => ({
				status: friend.status,
				userDetails: {
					...JSON.parse(JSON.stringify(friend.userId)),
					isOnline: onlineFriendsList.includes((friend.userId as unknown as UserDetails)._id.toString()),
				},
			}));

			res.status(200).json({ data: friendsListWithDetails });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred' });
		}
	});

	return router;
}
