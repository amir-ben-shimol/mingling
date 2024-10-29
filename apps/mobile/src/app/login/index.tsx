import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import type { User } from '@mingling/types';
import { UIText } from '@/ui/UIText';
import { useSession } from '@/lib/providers/sessionProvider';
import { useSocket } from '@/lib/providers/socketProvider';

const dummyUser: User = {
	id: '1',
	firstName: 'John',
	lastName: 'Doe',
	email: 'doe@gmail.com',
	gender: 'male',
	country: 'USA',
	age: 25,
};

const LoginPage = () => {
	const { signIn } = useSession();
	const { connectSocket } = useSocket();

	const onLogin = async () => {
		router.navigate('/');
		await signIn();
		connectSocket(dummyUser);
	};

	return (
		<View className="flex flex-row justify-between px-2 py-4">
			<TouchableOpacity className="rounded bg-slate-600 px-6 py-2" onPress={onLogin}>
				<UIText className="text-lg text-white">התחברות</UIText>
			</TouchableOpacity>
		</View>
	);
};

export default LoginPage;
