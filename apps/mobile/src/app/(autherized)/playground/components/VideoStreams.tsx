// src/components/VideoStreams.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useWebRTC } from '@/providers/webRTCProvider';

const VideoStreams = () => {
	const { localStream, remoteStream } = useWebRTC();

	return (
		<View>
			{localStream ? (
				<RTCView streamURL={localStream.toURL()} className="flex h-[250px] w-full" objectFit="cover" />
			) : (
				<Text>No local stream available</Text>
			)}

			{remoteStream ? (
				<RTCView streamURL={remoteStream.toURL()} className="flex h-[250px] w-full" objectFit="cover" />
			) : (
				<View className="flex h-[250px] w-full items-center justify-center bg-gray-400">
					<Text>No remote stream available</Text>
				</View>
			)}
		</View>
	);
};

export default VideoStreams;
