import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { UIText } from '@/ui/UIText';
import { useSession } from '@/lib/providers/sessionProvider';

const HomePage = () => {
	const { signOut } = useSession();

	const onStartChat = () => {
		router.navigate('/playground');
	};

	return (
		<View className="flex flex-row justify-between px-2 py-4">
			<TouchableOpacity className="rounded bg-slate-600 px-6 py-2" onPress={signOut}>
				<UIText className="text-lg text-white">התנתקות</UIText>
			</TouchableOpacity>
			<TouchableOpacity className="rounded bg-slate-600 px-6 py-2" onPress={onStartChat}>
				<UIText className="text-lg text-white">התחל שיחה</UIText>
			</TouchableOpacity>
		</View>
	);
};

export default HomePage;
