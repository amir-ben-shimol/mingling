// src/screens/components/Actions.tsx
import React, { useState } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/lib/providers/authProvider';

import { BackendService } from '@/lib/utils/backend-service';
import { UIModal } from '@/ui/UIModal';

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
			setModalVisible(false);
		}
	};

	return (
		<View className="absolute right-4 top-4">
			<Pressable className="items-center justify-center rounded-full bg-blue-600 p-2" onPress={() => setModalVisible(true)}>
				<Feather name="menu" size={24} color="#ffff" />
			</Pressable>

			<UIModal title="actions" customSize="25" isVisible={modalVisible} onClose={() => setModalVisible(false)}>
				<View className="flex w-full flex-row justify-around px-2">
					<Pressable className="flex w-fit flex-row rounded-xl bg-slate-600 p-2" onPress={sendFriendRequest}>
						<Feather name="user-plus" size={60} color="#ffff" />
					</Pressable>
					<Pressable className="flex w-fit flex-row rounded-xl bg-slate-600 p-2" onPress={sendFriendRequest}>
						<MaterialIcons name="join-full" size={60} color="#fff" />
					</Pressable>
					<Pressable className="flex w-fit flex-row rounded-xl bg-slate-600 p-2" onPress={sendFriendRequest}>
						<Feather name="user-plus" size={60} color="#ffff" />
					</Pressable>
					<Pressable className="flex w-fit flex-row rounded-xl bg-slate-600 p-2" onPress={sendFriendRequest}>
						<Feather name="user-plus" size={60} color="#ffff" />
					</Pressable>
				</View>
			</UIModal>
		</View>
	);
};
