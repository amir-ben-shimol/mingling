// src/screens/PlaygroundPage.tsx
import React, { useEffect, useState } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { useWebRTC } from '@/providers/webRTCProvider';
import { UIText } from '@/ui/UIText';
import { useSocket } from '@/lib/providers/socketProvider';
import { useAuth } from '@/lib/providers/authProvider';
import Chat from './components/Chat';
import VideoStreams from './components/VideoStreams';

const PlaygroundPage: React.FC = () => {
	const { user } = useAuth();
	const { socket } = useSocket();
	const { initializeConnection, endConnection } = useWebRTC();
	const [connectedUser, setConnectedUser] = useState<string | null>(null);

	useEffect(() => {
		if (!socket) return;

		// Join the playground and start looking for a match
		socket.emit('join-playground', socket.id);

		// Listen for when a match is found
		socket.on('start-connection', ({ to }) => {
			setConnectedUser(to);
			console.log(`${user?.firstName} Connected to user`, to);

			// Initialize WebRTC connection with the matched user
			initializeConnection(to);
		});

		// // Listen for incoming signaling data
		// socket.on('signal', async ({ from, signal }) => {
		// 	await handleIncomingSignal(signal);
		// });

		// Cleanup on unmount
		return () => {
			socket.off('start-connection');
			socket.off('signal');
		};
	}, [socket, initializeConnection]);

	const handleNextUser = () => {
		socket?.emit('next-user');
		setConnectedUser(null);
		endConnection();
	};

	const handleEndSession = () => {
		socket?.emit('leave-playground');
		setConnectedUser(null);
		endConnection();
		Alert.alert('Session Ended', 'You have left the playground.');
	};

	return (
		<View className="flex h-full">
			<VideoStreams />
			<Chat />

			{connectedUser && (
				<View className="mt-auto flex h-12 w-full flex-row justify-between">
					<Pressable className="flex w-1/2 items-center justify-center bg-red-700" onPress={handleEndSession}>
						<UIText className="p-2 text-center text-2xl text-white">End Session</UIText>
					</Pressable>
					<Pressable className="flex w-1/2 items-center justify-center bg-green-700" onPress={handleNextUser}>
						<UIText className="p-2 text-center text-2xl text-white">Next User</UIText>
					</Pressable>
				</View>
			)}
		</View>
	);
};

export default PlaygroundPage;
