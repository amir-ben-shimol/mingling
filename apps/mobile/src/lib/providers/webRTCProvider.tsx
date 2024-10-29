import React, { createContext, useContext, useEffect, useState } from 'react';
import { RTCPeerConnection, type MediaStream, type MediaStreamTrack } from 'react-native-webrtc';

type WebRTCContextType = {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	startCall: () => void;
	endCall: () => void;
};

const WebRTCContext = createContext<WebRTCContextType>({
	localStream: null,
	remoteStream: null,
	startCall: () => {},
	endCall: () => {},
});

export const useWebRTC = () => useContext(WebRTCContext);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const peerConnection = new RTCPeerConnection();

	useEffect(() => {
		const startLocalStream = async () => {
			const stream = (await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			})) as never as MediaStream;

			setLocalStream(stream);

			// Ensure track type is compatible with 'react-native-webrtc' types
			stream.getTracks().forEach((track) => {
				peerConnection.addTrack(track as MediaStreamTrack, stream);
			});
		};

		startLocalStream();
	}, []);

	const startCall = () => {
		// Logic to initialize and start the call
	};

	const endCall = () => {
		peerConnection.close();
		setRemoteStream(null);
	};

	return <WebRTCContext.Provider value={{ localStream, remoteStream, startCall, endCall }}>{children}</WebRTCContext.Provider>;
};
