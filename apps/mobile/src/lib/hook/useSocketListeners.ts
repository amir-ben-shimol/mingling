// src/hooks/useSocketListeners.ts
import { useEffect } from 'react';
import type { FriendDetails, Notification } from '@mingling/types';
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

		// Handle individual friend status changes (online/offline updates)
		const handleFriendStatusChange = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
			setFriendsList((prevFriends) => {
				const updatedFriendsList = prevFriends.map((friend) =>
					friend.userDetails._id === userId ? { ...friend, userDetails: { ...friend.userDetails, isOnline } } : friend,
				);

				// Log the updated friends list before setting it
				console.log('updatedFriendsList with status change:', updatedFriendsList);

				return updatedFriendsList;
			});
		};

		// Register listeners
		socket.on('notification', handleNotification);
		socket.on('friendsListUpdate', handleFriendsListUpdate);
		socket.on('friendStatusChange', handleFriendStatusChange); // New listener for individual friend status changes

		// Cleanup on unmount
		return () => {
			socket.off('notification', handleNotification);
			socket.off('friendsListUpdate', handleFriendsListUpdate);
			socket.off('friendStatusChange', handleFriendStatusChange); // Cleanup for new listener
		};
	}, [socket, showNotification, setFriendsList]);
};

export default useSocketListeners;
