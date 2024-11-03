import express, { type Request, type Response } from 'express';
import { type Notification } from '@mingling/types'; // Import Notification type
import { type Server } from 'socket.io';
import { User } from '../models/user';
import { authenticate } from '../middleware/auth';
import { emitFriendsListUpdate } from '../helpers/socket-emiters';
import { getSocketIdByUserId, getUserIdBySocketId } from '../config/socket-config';
import { createNotification, updateNotification } from './notifications-routes';

const router = express.Router();

export function createFriendRoutes(io: Server) {
	// Send a friend request
	router.post('/request', authenticate, async (req: Request, res: Response) => {
		const requesterId = req.user?.id;
		const { partnerSocketId } = req.body;

		try {
			const resolvedFriendUserId = getUserIdBySocketId(partnerSocketId);

			if (!resolvedFriendUserId) {
				res.status(404).json({ error: 'User not found for given socket ID' });

				return;
			}

			const requester = await User.findById(requesterId);
			const recipient = await User.findById(resolvedFriendUserId);

			if (!requester || !recipient) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			// Check for existing pending friend request
			const existingRequest = requester.friendsList.find((friend) => friend.userId === resolvedFriendUserId && friend.status === 'pending');

			if (existingRequest) {
				res.status(400).json({ error: 'Friend request already pending' });

				return;
			}

			// Add friend request to requester's friendsList with 'pending' status
			requester.friendsList.push({ userId: resolvedFriendUserId, status: 'pending' });
			recipient.friendsList.push({ userId: requesterId, status: 'incoming' });

			await recipient.save();
			await requester.save();

			// Create and emit a notification for the recipient
			const notification: Notification = await createNotification(resolvedFriendUserId, {
				varient: 'info',
				type: 'friend-request',
				title: 'Friend Request',
				content: `${requester.firstName} ${requester.lastName} sent you a friend request.`,
				fromUserId: requesterId,
			});

			const recipientSocketId = getSocketIdByUserId(resolvedFriendUserId);

			if (recipientSocketId) {
				io.to(recipientSocketId).emit('notification', notification);
			}

			// Emit updated friends list for both users
			await emitFriendsListUpdate(io, requesterId);
			await emitFriendsListUpdate(io, resolvedFriendUserId);

			res.status(200).json({ message: 'Friend request sent successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred' });
		}
	});

	// Accept or decline a friend request
	router.post('/response/:recipientNotificationId', authenticate, async (req: Request, res: Response) => {
		const recipientId = req.user?.id;
		const { recipientNotificationId } = req.params;
		const { status, friendId } = req.body;

		if (!['approved', 'declined'].includes(status)) {
			res.status(400).json({ error: 'Invalid status' });

			return;
		}

		try {
			const recipient = await User.findById(recipientId);
			const requester = await User.findById(friendId);

			if (!recipient || !requester || !recipientNotificationId) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			console.log('recipient', recipient);

			console.log('requester', requester);

			const recipientFriend = recipient.friendsList.find((f) => f.userId.toString() === friendId);
			const requesterFriend = requester.friendsList.find((f) => f.userId.toString() === recipientId);

			console.log('recipientFriend', recipientFriend);

			console.log('requesterFriend', requesterFriend);

			if (requesterFriend) requesterFriend.status = status;

			if (recipientFriend) recipientFriend.status = status;

			await recipient.save();
			await requester.save();

			// Update notification for the recipient
			const recipientNotification: Notification = await updateNotification(recipientId, recipientNotificationId, {
				title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
				content:
					status === 'approved'
						? `${requester.firstName} ${recipient.lastName} is now your friend.`
						: `You declined ${requester.firstName} ${recipient.lastName}'s friend request.`,
				type: 'system',
			});

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

			const requesterSocketId = getSocketIdByUserId(friendId);
			const recipientSocketId = getSocketIdByUserId(recipientId);

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

	// Get friends list
	router.get('/friends-list', authenticate, async (req: Request, res: Response) => {
		const userId = req.user?.id;

		try {
			// Find the user and get only the friendsList field
			const user = await User.findById(userId).select('friendsList').populate({
				path: 'friendsList.userId',
				select: 'firstName lastName email country gender age',
			});

			if (!user) {
				res.status(404).json({ error: 'User not found' });

				return;
			}

			const friendsListWithDetails = user.friendsList.map((friend) => ({
				status: friend.status,
				userDetails: friend.userId, // Assign the populated user data to 'userDetails'
			}));

			// const approvedFriends = user.friendsList.filter((friend) => friend.status === 'approved');

			res.status(200).json({ data: friendsListWithDetails });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred' });
		}
	});

	return router;
}
