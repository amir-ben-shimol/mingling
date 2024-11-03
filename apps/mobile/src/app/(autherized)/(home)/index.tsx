import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { NotificationModal } from 'src/components/modals/NotificationModal';
import { UIText } from '@/ui/UIText';
import { useAuth } from '@/lib/providers/authProvider';
import { useNotificationsStore } from '@/lib/store/useNotificationsStore';

const HomePage = () => {
	const { user } = useAuth();
	const { userNotifications } = useNotificationsStore();
	const [showNotificationList, setShowNotificationList] = useState(false);

	const { resetStore } = useNotificationsStore();

	const onStartChat = () => {
		router.navigate('/playground');
	};

	return (
		<View className="flex w-full items-center justify-center">
			<UIText className="font-RubikBold text-4xl text-blue-900">{`Hello ${user?.firstName}`}</UIText>

			<View className="flex w-full flex-row justify-between px-2 py-4">
				<TouchableOpacity className="rounded bg-slate-600 px-6 py-2" onPress={onStartChat}>
					<UIText className="text-lg text-white">Start Chat</UIText>
				</TouchableOpacity>
			</View>

			<TouchableOpacity onPress={resetStore}>
				<UIText className="text-lg text-red-600">Reset Store</UIText>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => setShowNotificationList(!showNotificationList)}>
				<View className="relative">
					<UIText className="text-lg text-slate-600">🔔</UIText>
					{userNotifications.length > 0 && (
						<View className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1">
							<UIText className="text-xs text-white">{userNotifications.length}</UIText>
						</View>
					)}
				</View>
			</TouchableOpacity>

			<NotificationModal isVisible={showNotificationList} onHideModal={() => setShowNotificationList(false)} />
		</View>
	);
};

export default HomePage;
