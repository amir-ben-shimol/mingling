import React from 'react';
import { View } from 'react-native';
import { RTCView, type MediaStream } from 'react-native-webrtc';
import LottieView from 'lottie-react-native';
import { cn } from '@/lib/utils/component';

type MediaStreamWithToURL = MediaStream & {
	toURL(): string;
};

type VideoStreamsProps = {
	readonly localStream: MediaStream | null;
	readonly remoteStreams: Map<string, MediaStream>;
};

const VideoStreams: React.FC<VideoStreamsProps> = ({ localStream, remoteStreams }) => {
	return (
		<View className="relative flex-1 bg-slate-950">
			{remoteStreams.size > 0 ? (
				<View className="flex-[0.5]">
					{Array.from(remoteStreams.entries()).map(([partnerId, stream]) => {
						const streamURL = (stream as MediaStreamWithToURL).toURL();

						return <RTCView key={partnerId} streamURL={streamURL} className="flex-1 bg-slate-950" objectFit="cover" />;
					})}
				</View>
			) : (
				<View className="flex-1">
					<LottieView source={require('@/assets/jsons/calling.json')} style={{ width: '100%', height: '100%' }} autoPlay loop />
				</View>
			)}
			{localStream && (
				<RTCView
					streamURL={(localStream as MediaStreamWithToURL).toURL()}
					className={cn('bg-slate-950', {
						'flex-[0.5]': remoteStreams.size > 0,
						'flex-1': remoteStreams.size === 0,
					})}
					objectFit="cover"
					mirror
				/>
			)}
		</View>
	);
};

export default VideoStreams;
