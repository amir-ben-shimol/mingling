import { Pressable, View, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import type { UserDetails } from '@mingling/types';
import { UIText } from '@/ui/UIText';
import { BackendService } from '@/lib/utils/backend-service';
import { UISvg } from '@/ui/UISvg';

const UserPage = () => {
	const searchParams = useGlobalSearchParams();
	const { userId } = searchParams;
	const [user, setUser] = useState<UserDetails | null>(null);
	const [loadingImage, setLoadingImage] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const response = await BackendService.get<UserDetails>(`/api/user/${userId}`);

			setUser(response.data);
		};

		userId && fetchUser();
	}, [userId]);

	const removeFriend = async (friendId: string) => {
		await BackendService.delete(`/api/friends/remove-friend/${friendId}`);
		router.back();
	};

	// if (!userId) {
	// 	router.navigate('/');
	// }

	return (
		<ScrollView className="flex-1 bg-gray-900 px-4 py-6">
			<View className="items-center">
				{/* Profile Picture with Placeholder */}
				<View className="relative mb-4 h-28 w-28 overflow-hidden rounded-full">
					{loadingImage && <UISvg name="profileImagePlaceholder" className="absolute inset-0 h-full w-full" />}
					{user?.profilePictureUrl && (
						<Image
							source={{ uri: user.profilePictureUrl }}
							className="absolute inset-0 h-full w-full"
							resizeMode="cover"
							onLoadStart={() => setLoadingImage(true)}
							onLoad={() => setLoadingImage(false)}
							onError={() => setLoadingImage(false)}
						/>
					)}
				</View>

				{/* User Details */}
				<UIText className="text-2xl font-bold text-gray-100">{`${user?.firstName} ${user?.lastName}`}</UIText>
				<UIText className="mb-2 text-lg text-gray-400">{user?.email}</UIText>

				<View className="mt-6 w-full rounded-lg bg-gray-800 p-4 shadow-sm">
					<UIText className="mb-2 text-xl font-semibold text-gray-200">Profile Information</UIText>
					<UIText className="text-lg text-gray-400">{`Country: ${user?.country}`}</UIText>
					<UIText className="text-lg text-gray-400">{`Gender: ${user?.gender}`}</UIText>
					<UIText className="text-lg text-gray-400">{`Age: ${user?.age}`}</UIText>
					<UIText className="text-lg text-gray-400">{`Status: ${user?.isOnline ? 'Online' : 'Offline'}`}</UIText>
				</View>

				{/* Action Button */}
				<View className="mt-8 w-full">
					<Pressable className="w-full items-center rounded-md bg-red-600 p-4" onPress={() => removeFriend(userId as string)}>
						<UIText className="text-lg font-semibold text-white">Remove Friend</UIText>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
};

export default UserPage;
