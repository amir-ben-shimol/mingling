import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNotificationsStore } from '@/lib/store/useNotificationsStore';
import { UIText } from '@/ui/UIText';
import { NotificationModal } from '../modals/NotificationModal';

export const Notifications = () => {
	const { userNotifications } = useNotificationsStore();
	const [showNotificationList, setShowNotificationList] = useState(false);

	return (
		<>
			<TouchableOpacity onPress={() => setShowNotificationList(!showNotificationList)}>
				<View className="relative mx-6">
					<UIText className="text-lg text-slate-600">🔔</UIText>
					{userNotifications.length > 0 && (
						<View className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1">
							<UIText className="text-xs text-white">{userNotifications.length}</UIText>
						</View>
					)}
				</View>
			</TouchableOpacity>

			<NotificationModal isVisible={showNotificationList} onHideModal={() => setShowNotificationList(false)} />
		</>
	);
};
