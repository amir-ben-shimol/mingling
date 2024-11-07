// src/components/VideoStreams.tsx

import React, { useEffect } from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { RTCView, type MediaStream } from 'react-native-webrtc';
import StaticGlitchGif from '@/assets/gifs/static-glitch.gif';

type MediaStreamWithToURL = MediaStream & {
	toURL(): string;
};

type VideoStreamsProps = {
	localStream: MediaStream | null;
	remoteStreams: Map<string, MediaStream>;
};

const VideoStreams: React.FC<VideoStreamsProps> = ({ localStream, remoteStreams }) => {
	useEffect(() => {
		console.log('Remote streams updated:', remoteStreams);
	}, [remoteStreams]);

	return (
		<View style={{ flex: 1, position: 'relative' }}>
			{remoteStreams.size > 0 ? (
				<View style={{ flex: 1 }}>
					{Array.from(remoteStreams.entries()).map(([partnerId, stream]) => {
						const streamURL = (stream as MediaStreamWithToURL).toURL();

						return <RTCView key={partnerId} streamURL={streamURL} style={{ flex: 1, backgroundColor: 'black' }} objectFit="cover" />;
					})}
				</View>
			) : (
				<Image source={StaticGlitchGif} style={{ flex: 1 }} />
			)}
			{localStream && (
				<RTCView
					streamURL={(localStream as MediaStreamWithToURL).toURL()}
					style={{
						position: 'absolute',
						bottom: 10,
						right: 10,
						width: 100,
						height: 150,
						backgroundColor: 'black',
					}}
					objectFit="cover"
					mirror
				/>
			)}
		</View>
	);
};

export default VideoStreams;
