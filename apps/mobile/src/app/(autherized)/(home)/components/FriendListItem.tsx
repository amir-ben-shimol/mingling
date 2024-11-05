/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import type { FriendDetails } from '@mingling/types';
import { UIText } from '@/ui/UIText';
import { UISvg } from '@/ui/UISvg';

type FriendListItemProps = {
	friend: FriendDetails;
	onPress: (userId: string) => void;
	onHandleFriendRequestResponse?: (userId: string, status: 'approved' | 'declined') => void;
	showStatusIndicator?: boolean;
};

export const FriendListItem: React.FC<FriendListItemProps> = ({ friend, onPress, onHandleFriendRequestResponse, showStatusIndicator = false }) => {
	const [loadingImage, setLoadingImage] = useState(true);

	return (
		<TouchableOpacity className="mb-2 flex-row items-center rounded-lg bg-gray-100 p-4" onPress={() => onPress(friend.userDetails._id)}>
			<View className="relative mr-4 h-12 w-12 overflow-hidden rounded-full">
				{loadingImage && <UISvg name="profileImagePlaceholder" className="absolute h-full w-full" />}
				{friend.userDetails.profilePictureUrl && (
					<Image
						source={{ uri: friend.userDetails.profilePictureUrl }}
						className="h-full w-full"
						resizeMode="cover"
						onLoadStart={() => setLoadingImage(true)}
						onLoad={() => setLoadingImage(false)}
						onError={() => setLoadingImage(false)}
					/>
				)}
			</View>
			<View className="flex-1">
				<UIText className="text-lg font-semibold">
					{friend.userDetails.firstName} {friend.userDetails.lastName}
				</UIText>
				<UIText className="text-gray-600">{friend.userDetails.email}</UIText>
				<UIText className="text-gray-600">{friend.userDetails.country}</UIText>
			</View>
			{showStatusIndicator && <View className={`ml-auto h-4 w-4 rounded-full ${friend.userDetails.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />}
			{onHandleFriendRequestResponse && (
				<View className="ml-4 flex">
					<TouchableOpacity
						className="mb-1 rounded-md bg-green-500 px-3 py-2"
						onPress={() => onHandleFriendRequestResponse(friend.userDetails._id, 'approved')}
					>
						<UIText className="text-center font-semibold text-white">Accept</UIText>
					</TouchableOpacity>
					<TouchableOpacity
						className="rounded-md bg-red-500 px-3 py-2"
						onPress={() => onHandleFriendRequestResponse(friend.userDetails._id, 'declined')}
					>
						<UIText className="text-center font-semibold text-white">Decline</UIText>
					</TouchableOpacity>
				</View>
			)}
		</TouchableOpacity>
	);
};
