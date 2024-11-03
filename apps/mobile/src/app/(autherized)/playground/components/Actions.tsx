// src/screens/components/Actions.tsx
import React, { useState } from 'react';
import { View, Modal, Pressable, Text, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/lib/providers/authProvider';

import { BackendService } from '@/lib/utils/backend-service';

type ActionsProps = {
	partnerSocketId: string;
};

export const Actions: React.FC<ActionsProps> = ({ partnerSocketId }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const { user } = useAuth();

	const sendFriendRequest = async () => {
		if (!user) return;

		try {
			await BackendService.post('/api/friends/request', { partnerSocketId: partnerSocketId });
		} catch (error) {
			Alert.alert('Error', 'Failed to send friend request. Please try again.');
			console.error('Friend request error:', error);
		} finally {
			setModalVisible(false); // Close the modal after action
		}
	};

	return (
		<View className="absolute right-4 top-4">
			<Pressable className="items-center justify-center rounded-full bg-blue-600 p-2" onPress={() => setModalVisible(true)}>
				<Feather name="menu" size={24} color="#ffff" />
			</Pressable>

			<Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
				<Pressable className="flex-1 items-center justify-center bg-black bg-opacity-50" onPress={() => setModalVisible(false)}>
					<View className="w-48 items-center rounded-lg bg-white p-4">
						<Text className="mb-2 text-lg font-bold">Actions</Text>
						<Pressable className="py-2" onPress={sendFriendRequest}>
							<Text className="text-base text-blue-600">Send Friend Request</Text>
						</Pressable>
					</View>
				</Pressable>
			</Modal>
		</View>
	);
};
