import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { UISvg } from '@/ui/UISvg';
// import { useAuth } from '@/lib/providers/authProvider';

export const Profile = () => {
	// const { user } = useAuth();
	const [loadingImage] = useState(true);

	return (
		<TouchableOpacity>
			<View className="mx-6">
				{loadingImage && <UISvg name="profileImagePlaceholder" style={{ height: 36, width: 36 }} className="h-28 w-28 rounded-full" />}
				{/* {user?.profilePictureUrl && (
					<Image
						source={{ uri: user.profilePictureUrl }}
						className="h-28 w-28 rounded-full"
						style={{ height: 50, width: 50 }}
						resizeMode="cover"
						onLoadStart={() => setLoadingImage(true)} // Set loading state at the start of image loading
						onLoad={() => setLoadingImage(false)} // Hide placeholder when image finishes loading
						onError={() => setLoadingImage(false)} // Hide placeholder if there's an error
					/>
				)} */}
			</View>
		</TouchableOpacity>
	);
};
