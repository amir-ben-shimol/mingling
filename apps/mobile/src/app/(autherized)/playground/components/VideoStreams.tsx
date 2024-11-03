// src/screens/components/VideoStreams.tsx
import React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import StaticGlitchGif from '@/assets/gifs/static-glitch.gif';

type MediaStreamWithToURL = MediaStream & {
	toURL(): string;
};

type VideoStreamsProps = {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
};

const VideoStreams: React.FC<VideoStreamsProps> = ({ localStream, remoteStream }) => {
	return (
		<View className="relative max-h-[60%] flex-1">
			{remoteStream ? (
				<RTCView streamURL={(remoteStream as MediaStreamWithToURL).toURL()} className="flex-1" objectFit="cover" mirror={false} />
			) : (
				<Image source={StaticGlitchGif} className="flex-1" />
			)}
			{localStream && (
				<RTCView
					streamURL={(localStream as MediaStreamWithToURL).toURL()}
					className="absolute bottom-2 right-2 z-10 h-24 w-16 rounded border-2 border-red-500"
					objectFit="cover"
					mirror
				/>
			)}
		</View>
	);
};

export default VideoStreams;
