import type { Request, Response, NextFunction } from 'express';
import * as friendService from '../services/friend-service';
import { getUserIdFromHeaders } from '../helpers/headers';

/**
 * Controller for sending a friend request.
 */
export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const requesterId = getUserIdFromHeaders(req);

		if (!requesterId) {
			res.status(401).json({ error: 'Unauthorized' });

			return;
		}

		const { partnerSocketId } = req.body;

		if (!partnerSocketId) {
			res.status(400).json({ error: 'partnerSocketId is required' });

			return;
		}

		const result = await friendService.sendFriendRequest(requesterId, partnerSocketId);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

/**
 * Controller for responding to a friend request.
 */
export const respondToFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const recipientId = getUserIdFromHeaders(req);

		if (!recipientId) {
			res.status(401).json({ error: 'Unauthorized' });

			return;
		}

		const { status, friendId, recipientNotificationId } = req.body;

		if (!friendId || !status) {
			res.status(400).json({ error: 'friendId and status are required' });

			return;
		}

		if (!['approved', 'declined'].includes(status)) {
			res.status(400).json({ error: 'Invalid status' });

			return;
		}

		const result = await friendService.respondToFriendRequest(recipientId, friendId, status, recipientNotificationId);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

/**
 * Controller for removing a friend.
 */
export const removeFriend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = getUserIdFromHeaders(req);

		if (!userId) {
			res.status(401).json({ error: 'Unauthorized' });

			return;
		}

		const { friendId } = req.params;

		if (!friendId) {
			res.status(400).json({ error: 'friendId is required' });

			return;
		}

		const result = await friendService.removeFriend(userId, friendId);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

/**
 * Controller for retrieving the friends list.
 */
export const getFriendsList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = getUserIdFromHeaders(req);

		if (!userId) {
			res.status(401).json({ error: 'Unauthorized' });

			return;
		}

		const result = await friendService.getFriendsList(userId);

		res.status(200).json(result);
	} catch (error) {
		console.log('inside of getFriendsList');
		next(error);
	}
};
