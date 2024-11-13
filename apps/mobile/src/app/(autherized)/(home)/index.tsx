import { View } from 'react-native';
import { FriendsList } from './components/FriendsList';

const HomePage = () => {
	return (
		<View className="flex w-full items-start justify-center">
			<View className="flex w-full flex-row justify-between py-4">
				<FriendsList />
			</View>
		</View>
	);
};

export default HomePage;
