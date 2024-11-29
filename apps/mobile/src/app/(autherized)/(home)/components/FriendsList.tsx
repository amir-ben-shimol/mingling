import React, { useEffect } from 'react';
import { View } from 'react-native';
import type { FriendDetails } from '@mingling/types';
import { router } from 'expo-router';
import { useFriendsStore } from '@/lib/store/useFriendsStore';
import { BackendService } from '@/lib/utils/backend-service';
import FriendsListSection from './FriendsListSection';

const FriendsList = () => {
	const { friendsList, setFriendsList } = useFriendsStore();

	useEffect(() => {
		const fetchFriends = async () => {
			const response = await BackendService.get<FriendDetails[]>('/api/friends/friends-list');

			if (!response.data) {
				return;
			}

			setFriendsList(response.data);
		};

		fetchFriends();
	}, []);

	const navToUser = (userId: string) => {
		router.push(`/user/${userId}`);
	};

	const handleFriendRequestResponse = async (fromUserId: string, status: 'approved' | 'declined') => {
		if (!fromUserId || !status) return;

		try {
			await BackendService.post('/api/friends/response', {
				friendId: fromUserId,
				status,
			});
		} catch (error) {
			console.error('Error updating friend request:', error);
		}
	};

	return (
		<View className="flex-1 rounded p-4">
			<FriendsListSection
				key="pending"
				data={friendsList.filter((friend) => friend.status === 'pending')}
				title="Pending Friend Requests"
				onPressUser={navToUser}
			/>
			<FriendsListSection
				key="incoming"
				data={friendsList.filter((friend) => friend.status === 'incoming')}
				title="Friend Requests"
				onPressUser={navToUser}
				onHandleFriendRequestResponse={handleFriendRequestResponse}
			/>
			<FriendsListSection
				key="friends"
				data={friendsList.filter((friend) => friend.status === 'approved').sort((a) => (a.userDetails.isOnline ? -1 : 1))}
				title="Friends"
				showStatusIndicator
				onPressUser={navToUser}
			/>
		</View>
	);
};

export default FriendsList;
