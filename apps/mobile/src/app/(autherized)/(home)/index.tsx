import { View } from 'react-native';
import { UIText } from '@/ui/UIText';
import { useAuth } from '@/lib/providers/authProvider';
import { FriendsList } from './components/FriendsList';

const HomePage = () => {
	const { user } = useAuth();

	return (
		<View className="flex w-full items-start justify-center bg-gray-900">
			<UIText className="font-RubikBold mt-4 w-full px-2 text-4xl text-gray-100">{`Hello ${user?.firstName}`}</UIText>

			<View className="flex w-full flex-row justify-between py-4">
				<FriendsList />
			</View>
		</View>
	);
};

export default HomePage;
