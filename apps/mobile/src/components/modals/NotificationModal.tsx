import type { Notification } from '@mingling/types';
import { Pressable, TouchableOpacity, View } from 'react-native';
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
			await BackendService.post(`/api/friends/response/${notification.id}`, {
				friendId: notification.fromUserId,
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
		<UIModal title="Notifications" isVisible={props.isVisible} onClose={props.onHideModal}>
			{userNotifications.map((notification) => (
				<View key={notification.id} className="w-full border-b p-2">
					<View className="flex w-full flex-row justify-between">
						<View className="flex">
							<UIText className="font-bold">{notification.title}</UIText>
							<UIText>{notification.content}</UIText>
						</View>
						<Pressable onPress={() => onRemoveNotification(notification)}>
							<UIText className="text-blue-600">Dismiss</UIText>
						</Pressable>
					</View>

					{/* Display Accept/Decline buttons for friend requests */}
					{notification.type === 'friend-request' && (
						<View className="mt-2 flex flex-row">
							<TouchableOpacity
								className="mr-2 rounded bg-green-500 px-2 py-1"
								onPress={() => handleFriendRequestResponse(notification, 'approved')}
							>
								<UIText className="text-white">Accept</UIText>
							</TouchableOpacity>
							<TouchableOpacity className="rounded bg-red-500 px-2 py-1" onPress={() => handleFriendRequestResponse(notification, 'declined')}>
								<UIText className="text-white">Decline</UIText>
							</TouchableOpacity>
						</View>
					)}
				</View>
			))}
		</UIModal>
	);
};
