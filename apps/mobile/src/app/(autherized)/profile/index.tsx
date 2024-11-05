/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UIText } from '@/ui/UIText';
import { useAuth } from '@/lib/providers/authProvider';
import { BackendService } from '@/lib/utils/backend-service';
import { UISvg } from '@/ui/UISvg';

const ProfilePage = () => {
	const { logout, user, refreshUser } = useAuth();
	const [loadingImage, setLoadingImage] = useState(true);

	const handleSelectProfilePicture = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permissionResult.granted) {
			alert("You've refused to allow this app to access your photos!");

			return;
		}

		const pickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 1,
		});

		if (!pickerResult.canceled) {
			uploadProfilePictureAsync(pickerResult.assets[0]?.uri);
		}
	};

	const uploadProfilePictureAsync = async (uri?: string) => {
		if (!uri) return;

		try {
			const fileType = uri.split('.').pop();
			const formData = new FormData();

			formData.append('profilePicture', {
				uri,
				name: `profile.${fileType}`,
				type: `image/${fileType}`,
			} as any);

			const options = {
				'Content-Type': 'multipart/form-data',
			};

			const response = await BackendService.post('/api/users/upload-profile-picture', formData, options);

			if (response.ok) {
				await refreshUser();
				setLoadingImage(true);
			} else {
				alert('Failed to upload profile picture');
			}
		} catch (error) {
			console.error('Error uploading profile picture:', error);
		}
	};

	useEffect(() => {
		// Initial load state based on whether a profile picture URL is available
		setLoadingImage(!!user?.profilePictureUrl);
		refreshUser();
	}, []);

	return (
		<View className="flex w-full items-center bg-white px-6 py-8">
			<View className="relative h-28 w-28">
				{loadingImage && <UISvg name="profileImagePlaceholder" className="absolute left-0 top-0 h-28 w-28 rounded-full" />}
				{user?.profilePictureUrl && (
					<Image
						source={{ uri: user.profilePictureUrl }}
						className="absolute left-0 top-0 h-28 w-28 rounded-full"
						resizeMode="cover"
						onLoadStart={() => setLoadingImage(true)} // Set loading state at the start of image loading
						onLoad={() => setLoadingImage(false)} // Hide placeholder when image finishes loading
						onError={() => setLoadingImage(false)} // Hide placeholder if there's an error
					/>
				)}
				<UISvg name="edit" className="absolute bottom-0 right-0" onClick={handleSelectProfilePicture} />
			</View>

			<UIText className="font-RubikBold mt-8 text-3xl text-blue-900">{`Hello, ${user?.firstName} ${user?.lastName}`}</UIText>

			<View className="mt-6 w-full rounded-lg bg-blue-50 p-4">
				<UIText className="font-RubikBold text-xl text-gray-700">Profile Details</UIText>

				<View className="mt-4">
					<UIText className="text-lg text-gray-600">Email: {user?.email}</UIText>
					<UIText className="text-lg text-gray-600">Country: {user?.country}</UIText>
					<UIText className="text-lg text-gray-600">Gender: {user?.gender}</UIText>
					<UIText className="text-lg text-gray-600">Age: {user?.age}</UIText>
					<UIText className="text-lg text-gray-600">Status: {user?.isOnline ? 'Online' : 'Offline'}</UIText>
				</View>
			</View>

			<View className="mt-10 flex w-full flex-row justify-between">
				<TouchableOpacity className="rounded bg-red-500 px-6 py-2" onPress={logout}>
					<UIText className="text-lg text-white">Logout</UIText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProfilePage;
