// src/hooks/useSocketListeners.ts
import { useEffect } from 'react';
import type { FriendDetails, UserDetails, Notification } from '@mingling/types';
import type { Socket } from 'socket.io-client';
import { useNotificationsStore } from '@/lib/store/useNotificationsStore';
import { useFriendsStore } from '../store/useFriendsStore';

const useSocketListeners = (socket: Socket | null) => {
	const { showNotification } = useNotificationsStore();
	const { setFriendsList } = useFriendsStore();

	useEffect(() => {
		if (!socket) return;

		// Handle incoming notifications
		const handleNotification = (notification: Notification) => {
			showNotification(notification);
		};

		// Handle full friends list updates
		const handleFriendsListUpdate = (updatedFriendsList: FriendDetails[]) => {
			console.log('updatedFriendsList', updatedFriendsList);
			setFriendsList(updatedFriendsList); // Update the friends list in state
		};

		// Handle individual friend updates (online status, profile picture, etc.)
		const handleFriendUpdate = (updatedFriend: { userId: string } & Partial<UserDetails>) => {
			const { userId, ...updatedFields } = updatedFriend;

			setFriendsList((prevFriends) => {
				const updatedFriendsList = prevFriends.map((friend) => {
					if (friend.userDetails._id === userId) {
						return {
							...friend,
							userDetails: {
								...friend.userDetails,
								...updatedFields,
							},
						};
					}

					return friend;
				});

				console.log('updatedFriendsList with changes:', updatedFriendsList);

				return updatedFriendsList;
			});
		};

		// Register listeners
		socket.on('notification', handleNotification);
		socket.on('friendsListUpdate', handleFriendsListUpdate);
		socket.on('friendUpdate', handleFriendUpdate);

		// Cleanup on unmount
		return () => {
			socket.off('notification', handleNotification);
			socket.off('friendsListUpdate', handleFriendsListUpdate);
			socket.off('friendUpdate', handleFriendUpdate);
		};
	}, [socket, showNotification, setFriendsList]);
};

export default useSocketListeners;
