// src/hooks/useNotificationListener.ts
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

		const handleNotification = (notification: Notification) => {
			showNotification(notification);
		};

		const handleFriendsListUpdate = (updatedFriendsList: FriendDetails[]) => {
			console.log('updatedFriendsList', updatedFriendsList);
			setFriendsList(updatedFriendsList); // Update the friends list in state
		};

		socket.on('notification', handleNotification);
		socket.on('friendsListUpdate', handleFriendsListUpdate);

		return () => {
			socket.off('notification', handleNotification);
			socket.off('friendsListUpdate', handleFriendsListUpdate);
		};
	}, [socket, showNotification]);
};

export default useSocketListeners;
