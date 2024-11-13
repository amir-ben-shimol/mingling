import React, { useState } from 'react';
import type { Socket } from 'socket.io-client';
import { View, Pressable, Text, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/lib/providers/authProvider';
import { BackendService } from '@/lib/utils/backend-service';
import { UIModal } from '@/ui/UIModal';

type ActionsProps = {
	partnerSocketIds: string[];
	socket: Socket | null;
	onMergeGroups: () => void;
};

export const Actions = (props: ActionsProps) => {
	const [modalVisible, setModalVisible] = useState(false);
	const { user } = useAuth();

	const sendFriendRequests = async () => {
		if (!user) return;

		try {
			await BackendService.post('/api/friends/request', { partnerSocketId: props.partnerSocketIds[0] });
		} catch (error) {
			Alert.alert('Error', 'Failed to send friend requests. Please try again.');
			console.error('Friend request error:', error);
		} finally {
			setModalVisible(false);
		}
	};

	const inviteToJoinGroup = () => {
		props.onMergeGroups();
		setModalVisible(false);
	};

	return (
		<View className="absolute right-4 top-4">
			<Pressable className="items-center justify-center rounded-full bg-blue-600 p-2" onPress={() => setModalVisible(true)}>
				<Feather name="menu" size={24} color="#FFFFFF" />
			</Pressable>

			<UIModal title="Actions" customSize="30" isVisible={modalVisible} onClose={() => setModalVisible(false)}>
				<View className="flex w-full flex-row justify-between px-4 py-6">
					<Pressable className="flex items-center rounded-xl bg-gray-700 p-4" onPress={sendFriendRequests}>
						<Feather name="user-plus" size={60} color="#FFFFFF" />
						<Text className="mt-2 text-center text-white">Send Friend Request</Text>
					</Pressable>
					<Pressable className="flex items-center rounded-xl bg-gray-700 p-4" onPress={inviteToJoinGroup}>
						<MaterialIcons name="group-add" size={60} color="#FFFFFF" />
						<Text className="mt-2 text-center text-white">Invite to Join Group</Text>
					</Pressable>
				</View>
			</UIModal>
		</View>
	);
};
