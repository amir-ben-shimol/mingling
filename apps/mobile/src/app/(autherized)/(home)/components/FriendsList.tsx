import { FlatList, View, TouchableOpacity, Text } from 'react-native';
import { useEffect } from 'react';
import type { FriendDetails } from '@mingling/types';
import { UIText } from '@/ui/UIText';
import { useFriendsStore } from '@/lib/store/useFriendsStore';
import { BackendService } from '@/lib/utils/backend-service';
import { getUserFullName } from '@/lib/utils/user';

export const FriendsList = () => {
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

	return (
		<View className="flex-1 bg-white p-4">
			<FlatList
				data={friendsList.filter((friend) => friend.status === 'approved')}
				keyExtractor={(item) => item.userDetails._id}
				renderItem={({ item }) => {
					const initials = `${item.userDetails.firstName.charAt(0)}${item.userDetails.lastName.charAt(0)}`.toUpperCase();

					return (
						<TouchableOpacity className="mb-2 flex-row items-center rounded-lg bg-gray-100 p-4">
							<View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-blue-500">
								<Text className="text-lg font-bold text-white">{initials}</Text>
							</View>
							<View>
								<UIText className="text-lg font-semibold">{getUserFullName(item.userDetails.firstName, item.userDetails.lastName)}</UIText>
								<UIText className="text-gray-600">{item.userDetails.email}</UIText>
								<UIText className="text-gray-600">{item.userDetails.country}</UIText>
							</View>
						</TouchableOpacity>
					);
				}}
				ListEmptyComponent={<UIText className="text-center text-gray-500">No friends found.</UIText>}
			/>
		</View>
	);
};
