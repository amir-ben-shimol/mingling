// src/hooks/useFriendsListListener.ts
import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import type { FriendDetails } from '@mingling/types';
import { useFriendsStore } from '@/lib/store/useFriendsStore';

const useFriendsListListener = (socket: Socket | null) => {
	const { setFriendsList } = useFriendsStore();

	useEffect(() => {
		if (!socket) return;

		// Handler for friends list updates
		const handleFriendsListUpdate = (updatedFriendsList: FriendDetails[]) => {
			console.log('updatedFriendsList', updatedFriendsList);
			setFriendsList(updatedFriendsList); // Update the friends list in state
		};

		// Listen for the friends list update event
		socket.on('friendsListUpdate', handleFriendsListUpdate);

		return () => {
			socket.off('friendsListUpdate', handleFriendsListUpdate);
		};
	}, [socket, setFriendsList]);
};

export default useFriendsListListener;
