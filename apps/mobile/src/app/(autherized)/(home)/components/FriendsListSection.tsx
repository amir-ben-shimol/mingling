// FriendsListSection.tsx
import React from 'react';
import { FlatList } from 'react-native';
import type { FriendDetails } from '@mingling/types';
import { UIText } from '@/ui/UIText';
import { FriendListItem } from './FriendListItem';

type FriendsListSectionProps = {
	data: FriendDetails[];
	title: string;
	onPressUser: (userId: string) => void;
	onHandleFriendRequestResponse?: (userId: string, status: 'approved' | 'declined') => void;
	showStatusIndicator?: boolean;
};

export const FriendsListSection: React.FC<FriendsListSectionProps> = ({
	data,
	title,
	onPressUser,
	onHandleFriendRequestResponse,
	showStatusIndicator = false,
}) => {
	if (data.length === 0) {
		return null;
	}

	return (
		<FlatList
			data={data}
			keyExtractor={(item) => item.userDetails._id}
			ListHeaderComponent={<UIText className="text-xl font-semibold text-gray-100">{title}</UIText>}
			renderItem={({ item }) => (
				<FriendListItem
					friend={item}
					showStatusIndicator={showStatusIndicator}
					onPress={onPressUser}
					onHandleFriendRequestResponse={onHandleFriendRequestResponse}
				/>
			)}
			ListEmptyComponent={<UIText className="text-center text-gray-500">No friends found.</UIText>}
		/>
	);
};
