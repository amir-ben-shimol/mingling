import { Image } from 'expo-image';
import { View } from 'react-native';

export const PlaygroundNavigatoinButton = () => {
	return (
		<View className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 p-2">
			<View className="flex items-center justify-center rounded-full bg-blue-500 p-2">
				<Image source="app_logo" className="h-14 w-14" />
			</View>
		</View>
	);
};
