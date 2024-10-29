import React from 'react';
import { View, Button } from 'react-native';
import { useWebRTC } from '@/providers/webRTCProvider';
import VideoStream from './components/VideoStreams';
import Chat from './components/Chat';

const PlaygroundPage: React.FC = () => {
	const { startCall, endCall } = useWebRTC();

	return (
		<View style={{ flex: 1 }}>
			<VideoStream />
			<Chat />
			<Button title="End Session" onPress={endCall} />
			<Button
				title="Next User"
				onPress={() => {
					endCall();
					startCall();
				}}
			/>
		</View>
	);
};

export default PlaygroundPage;
