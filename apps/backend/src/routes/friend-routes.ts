// routes/friendRoutes.ts
import express, { type Request, type Response } from 'express';
import { type Notification } from '@mingling/types'; // Import Notification type
import { type Server } from 'socket.io';
import { User } from '../models/user';
import { authenticate } from '../middleware/auth';
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

			requester.friendsList.push({ userId: resolvedFriendUserId, status: 'pending' });
			await requester.save();

			const notification: Notification = await createNotification(resolvedFriendUserId, {
				varient: 'info',
				type: 'friend-request',
				title: 'Friend Request',
				content: `${requester.firstName} ${requester.lastName} sent you a friend request.`,
				fromUserId: requesterId,
			});

			console.log('generated notification', notification);

			const recipientSocketId = getSocketIdByUserId(resolvedFriendUserId);

			if (recipientSocketId) {
				io.to(recipientSocketId).emit('notification', notification);
			}

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

			const recipientFriend = recipient.friendsList.find((f) => f.userId === friendId);
			const requesterFriend = requester.friendsList.find((f) => f.userId === recipientId);

			if (requesterFriend) requesterFriend.status = status;

			if (recipientFriend) recipientFriend.status = status;

			await recipient.save();
			await requester.save();

			const recipientNotification: Notification = await updateNotification(recipientId, recipientNotificationId, {
				title: status === 'approved' ? 'Friend Request Accepted' : 'Friend Request Declined',
				content:
					status === 'approved'
						? `${requester.firstName} ${recipient.lastName} is now your friend.`
						: `You declined ${requester.firstName} ${recipient.lastName}'s friend request.`,
				type: 'system',
			});

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

			if (requesterSocketId && recipientSocketId) {
				io.to(requesterSocketId).emit('notification', requesterNotification);
				io.to(recipientSocketId).emit('notification', recipientNotification);
			}

			res.status(200).json({ message: `Friend request ${status}` });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred' });
		}
	});

	return router;
}
