/* eslint-disable @typescript-eslint/no-explicit-any */
// src/screens/PlaygroundPage.tsx
import React, { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { View, Pressable, Alert } from 'react-native';
import { UIText } from '@/ui/UIText';
import { useSocket } from '@/lib/providers/socketProvider';
import { useWebRTC } from '@/lib/providers/webRtcProvider';
import { useAuth } from '@/lib/providers/authProvider';
import Chat from './components/Chat';
import VideoStreams from './components/VideoStreams';
import { Actions } from './components/Actions';

const PlaygroundPage: React.FC = () => {
	const { user } = useAuth();
	const { socket } = useSocket();
	const { localStream, remoteStreams, setupWebRTC, endCall, partnerSocketIds } = useWebRTC();
	const [isLookingForMatchTogether, setIsLookingForMatchTogether] = useState(false);
	const [memberSocketIds, setMemberSocketIds] = useState<string[]>([]);

	useFocusEffect(
		useCallback(() => {
			if (!socket || !user) return;

			socket.emit('joinPlayground', user._id);

			const handleMatched = ({ partnerSocketIds }: { partnerSocketIds: string[] }) => {
				setupWebRTC(partnerSocketIds);
				setIsLookingForMatchTogether(false); // Reset if previously merged
			};

			const handlePartnerLeft = () => {
				endCall();
				setIsLookingForMatchTogether(false);
			};

			const handleChatEnded = () => {
				endCall();
				setIsLookingForMatchTogether(false);
				// Optionally, display a message or UI indication that the chat has ended.
			};

			const handleMergeRequest = ({ fromGroupId }: { fromGroupId: string }) => {
				Alert.alert(
					'Merge Request',
					'The other user wants to merge and look for a match together. Do you accept?',
					[
						{
							text: 'Decline',
							onPress: () => {
								socket.emit('mergeResponse', { accepted: false, fromGroupId });
							},
							style: 'cancel',
						},
						{
							text: 'Accept',
							onPress: () => {
								socket.emit('mergeResponse', { accepted: true, fromGroupId });
							},
						},
					],
					{ cancelable: false },
				);
			};

			const handleGroupUpdated = ({ groupId, memberSocketIds, isMerged }: any) => {
				console.log('Group updated:', groupId, memberSocketIds, isMerged);

				if (isMerged) {
					// The groups have merged
					setMemberSocketIds(memberSocketIds);
					setIsLookingForMatchTogether(true);
					// You might want to update other state variables here
				}
			};

			const handleLookingForMatchTogether = () => {
				setIsLookingForMatchTogether(true);
			};

			const handleMergeDeclined = () => {
				Alert.alert('Merge Declined', 'The other user declined your merge request.');
			};

			socket.on('matched', handleMatched);
			socket.on('partnerLeft', handlePartnerLeft);
			socket.on('chatEnded', handleChatEnded);
			socket.on('mergeRequest', handleMergeRequest);
			socket.on('groupUpdated', handleGroupUpdated);
			socket.on('lookingForMatchTogether', handleLookingForMatchTogether);
			socket.on('mergeDeclined', handleMergeDeclined);

			return () => {
				socket.emit('leavePlayground');
				socket.off('matched', handleMatched);
				socket.off('partnerLeft', handlePartnerLeft);
				socket.off('chatEnded', handleChatEnded);
				socket.off('mergeRequest', handleMergeRequest);
				socket.off('groupUpdated', handleGroupUpdated);
				socket.off('lookingForMatchTogether', handleLookingForMatchTogether);
				socket.off('mergeDeclined', handleMergeDeclined);
				endCall();
			};
		}, [socket, user]),
	);

	const handleNextUser = () => {
		socket?.emit('nextUser');
		endCall();
		setIsLookingForMatchTogether(false);
	};

	const handleEndSession = () => {
		socket?.emit('leavePlayground');
		// endCall();
		setIsLookingForMatchTogether(false);
		router.push('/');
	};

	const handleMergeGroups = () => {
		socket?.emit('mergeGroups');
	};

	return (
		<View style={{ flex: 1 }}>
			<VideoStreams localStream={localStream} remoteStreams={remoteStreams} />
			{partnerSocketIds.length > 0 && <Chat connectedUsers={[...memberSocketIds, ...partnerSocketIds]} />}
			{partnerSocketIds.length > 0 && <Actions partnerSocketIds={partnerSocketIds} socket={socket} onMergeGroups={handleMergeGroups} />}
			{isLookingForMatchTogether && <UIText style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>Looking for a match together...</UIText>}

			<View style={{ flexDirection: 'row', height: 50 }}>
				<Pressable style={{ flex: 1, backgroundColor: '#b71c1c', justifyContent: 'center', alignItems: 'center' }} onPress={handleEndSession}>
					<UIText style={{ color: 'white', fontSize: 18 }}>End Session</UIText>
				</Pressable>
				{!isLookingForMatchTogether && partnerSocketIds.length > 0 && (
					<Pressable style={{ flex: 1, backgroundColor: '#1b5e20', justifyContent: 'center', alignItems: 'center' }} onPress={handleNextUser}>
						<UIText style={{ color: 'white', fontSize: 18 }}>Next User</UIText>
					</Pressable>
				)}
			</View>
		</View>
	);
};

export default PlaygroundPage;
