import type { Server } from 'socket.io';
import { getSocketIdByUserId } from '../config/socket-config';
import { User } from '../models/user';

// Helper function to emit friends list updates
export async function emitFriendsListUpdate(io: Server, userId: string) {
	console.log(`Emitting friends list update for user ${userId}`);

	try {
		const user = await User.findById(userId).select('friendsList').populate({
			path: 'friendsList.userId',
			select: 'firstName lastName email country gender age',
		});

		if (user) {
			const userSocketId = getSocketIdByUserId(userId);

			if (userSocketId) {
				// Map over friendsList to replace 'userId' with 'userDetails'
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
