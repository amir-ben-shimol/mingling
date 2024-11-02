import { TouchableOpacity, View } from 'react-native';
import { UIText } from '@/ui/UIText';
import { useAuth } from '@/lib/providers/authProvider';

const HomePage = () => {
	const { logout, user } = useAuth();

	return (
		<View className="flex w-full items-center justify-center">
			<UIText className="font-RubikBold text-4xl text-blue-900">{`Hello ${user?.firstName}`}</UIText>

			<View className="flex w-full flex-row justify-between px-2 py-4">
				<TouchableOpacity className="rounded bg-slate-600 px-6 py-2" onPress={logout}>
					<UIText className="text-lg text-white">התנתקות</UIText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default HomePage;
