import type { Notification } from '@mingling/types';
import { Feather } from '@expo/vector-icons';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useNotificationsStore } from '@/lib/store/useNotificationsStore';
import { BackendService } from '@/lib/utils/backend-service';
import { UIModal } from '@/ui/UIModal';
import { UIText } from '@/ui/UIText';

type Props = {
	readonly isVisible: boolean;
	readonly onHideModal: () => void;
};

export const NotificationModal = (props: Props) => {
	const { userNotifications, addUserNotification, removeUserNotification } = useNotificationsStore();

	const handleFriendRequestResponse = async (notification: Notification, status?: 'approved' | 'declined') => {
		if (!notification.fromUserId || !status || !notification.id) return;

		try {
			removeUserNotification(notification.id);
			await BackendService.post('/api/friends/response', {
				friendId: notification.fromUserId,
				recipientNotificationId: notification.id,
				status,
			});
		} catch (error) {
			console.error('Error updating friend request:', error);
			addUserNotification(notification);
		}
	};

	const onRemoveNotification = async (notification: Notification) => {
		if (!notification.id) return;

		try {
			removeUserNotification(notification.id);
			await BackendService.delete(`/api/notifications/delete/${notification.id}`);
		} catch (error) {
			console.log('Error removing notification:', error);
			addUserNotification(notification);
		}
	};

	if (!props.isVisible) return null;

	return (
		<UIModal size="small-large" title="Notifications" isVisible={props.isVisible} onClose={props.onHideModal}>
			<ScrollView className="max-h-96 w-full">
				{userNotifications.length === 0 ? (
					<View className="p-4">
						<UIText className="text-center text-gray-400">No notifications at this time.</UIText>
					</View>
				) : (
					userNotifications.map((notification) => (
						<View
							key={notification.id}
							className="border-b border-gray-700 p-4" // Darker border for separation
							style={{ backgroundColor: '#1F2937' }} // Dark background color
						>
							<View className="flex-row items-center justify-between">
								<View className="flex-1 pr-2">
									<UIText className="text-lg font-bold text-gray-100">{notification.title}</UIText>
									<UIText className="text-gray-400">{notification.content}</UIText>
								</View>
								<TouchableOpacity onPress={() => onRemoveNotification(notification)}>
									<Feather name="x-circle" size={24} color="#9CA3AF" />
								</TouchableOpacity>
							</View>

							{/* Display Accept/Decline buttons for friend requests */}
							{notification.type === 'friend-request' && (
								<View className="mt-4 flex-row">
									<TouchableOpacity
										className="mr-2 flex-1 rounded-md bg-green-600 py-2" // Darker green for dark mode
										onPress={() => handleFriendRequestResponse(notification, 'approved')}
									>
										<UIText className="text-center font-semibold text-white">Accept</UIText>
									</TouchableOpacity>
									<TouchableOpacity
										className="flex-1 rounded-md bg-red-600 py-2" // Darker red for dark mode
										onPress={() => handleFriendRequestResponse(notification, 'declined')}
									>
										<UIText className="text-center font-semibold text-white">Decline</UIText>
									</TouchableOpacity>
								</View>
							)}
						</View>
					))
				)}
			</ScrollView>
		</UIModal>
	);
};
