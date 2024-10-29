import React from 'react';
import { View, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useWebRTC } from '@/providers/webRTCProvider';

const VideoStream: React.FC = () => {
	const { localStream, remoteStream } = useWebRTC();

	return (
		<View>
			{localStream ? <RTCView streamURL={localStream.toURL()} style={{ width: '100%', height: 200 }} /> : <Text>No local stream</Text>}
			{remoteStream ? <RTCView streamURL={remoteStream.toURL()} style={{ width: '100%', height: 200 }} /> : <Text>No remote stream</Text>}
		</View>
	);
};

export default VideoStream;
