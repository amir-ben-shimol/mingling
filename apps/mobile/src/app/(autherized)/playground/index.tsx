// src/screens/PlaygroundPage.tsx
import React, { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { View, Pressable } from 'react-native';
import { useWebRTC } from '@/providers/webRTCProvider';
import { UIText } from '@/ui/UIText';
import { useSocket } from '@/lib/providers/socketProvider';
import { useAuth } from '@/lib/providers/authProvider';
import Chat from './components/Chat';
import VideoStreams from './components/VideoStreams';

const PlaygroundPage: React.FC = () => {
	const { user } = useAuth();
	const { socket } = useSocket();
	const { localStream, remoteStream, setupWebRTC, setupLocalStream, endCall, partnerSocketId } = useWebRTC();

	useFocusEffect(
		useCallback(() => {
			console.log('inside useFocusEffect');

			if (!socket || !user) return;

			socket.emit('joinPlayground', user._id);

			setupLocalStream();

			const handleMatched = ({ partnerSocketId }: { partnerSocketId: string }) => {
				setupWebRTC(partnerSocketId);
			};

			const handlePartnerLeft = () => {
				endCall();
				// User stays in playground and waits for a new match
			};

			socket.on('matched', handleMatched);
			socket.on('partnerLeft', handlePartnerLeft);

			return () => {
				socket.emit('leavePlayground');
				socket.off('matched', handleMatched);
				socket.off('partnerLeft', handlePartnerLeft);
				endCall();
			};
		}, [socket, user]),
	);

	const handleNextUser = () => {
		socket?.emit('nextUser');
		endCall();
	};

	// src/screens/PlaygroundPage.tsx
	const handleEndSession = () => {
		socket?.emit('leavePlayground');
		endCall();
		router.push('/'); // Navigate to the "/" page
	};

	return (
		<View className="flex h-full">
			<VideoStreams localStream={localStream as unknown as MediaStream} remoteStream={remoteStream as unknown as MediaStream} />
			{partnerSocketId && <Chat connectedUser={partnerSocketId} />}

			<View className="mt-auto flex h-12 w-full flex-row">
				<Pressable className="flex-1 items-center justify-center bg-red-700" onPress={handleEndSession}>
					<UIText className="p-2 text-center text-2xl text-white">End Session</UIText>
				</Pressable>
				{partnerSocketId && (
					<Pressable className="flex-1 items-center justify-center bg-green-700" onPress={handleNextUser}>
						<UIText className="p-2 text-center text-2xl text-white">Next User</UIText>
					</Pressable>
				)}
			</View>
		</View>
	);
};

export default PlaygroundPage;
