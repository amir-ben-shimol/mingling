// src/context/WebRTCProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mediaDevices, RTCPeerConnection, MediaStream } from 'react-native-webrtc';
import { useSocket } from '@/lib/providers/socketProvider';

type WebRTCContextType = {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	initializeConnection: (otherUserId: string) => void;
	endConnection: () => void;
};

type WebRTCProviderProps = {
	children: ReactNode;
};

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
	const { socket } = useSocket();
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

	// Initialize media and peer connection
	useEffect(() => {
		const setupMedia = async () => {
			try {
				const stream = await mediaDevices.getUserMedia({
					audio: true,
					video: { facingMode: 'user' },
				});

				setLocalStream(stream);

				const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
				stream.getTracks().forEach((track) => pc.addTrack(track, stream));

				// Use event listeners instead of `onicecandidate` and `ontrack` properties
				pc.addEventListener('icecandidate', (event) => {
					if (event.candidate) {
						socket?.emit('signal', { type: 'candidate', candidate: event.candidate });
					}
				});

				pc.addEventListener('track', (event) => {
					if (event.streams && event.streams[0]) {
						setRemoteStream(event.streams[0]);
					}
				});

				setPeerConnection(pc);
			} catch (error) {
				console.error('Error accessing media devices', error);
			}
		};

		setupMedia();

		return () => {
			peerConnection?.close();
			setPeerConnection(null);
			setLocalStream(null);
			setRemoteStream(null);
		};
	}, [socket]);

	// Initialize WebRTC connection with a matched user
	const initializeConnection = (otherUserId: string) => {
		if (peerConnection) {
			peerConnection
				.createOffer({})
				.then((offer) => {
					return peerConnection.setLocalDescription(offer);
				})
				.then(() => {
					// Emit offer to the matched user via socket
					socket?.emit('signal', { to: otherUserId, type: 'offer', offer: peerConnection.localDescription });
				})
				.catch((error) => console.error('Error creating offer:', error));
		}
	};

	// End the current WebRTC connection
	const endConnection = () => {
		peerConnection?.close();
		setPeerConnection(null);
		setRemoteStream(null);
	};

	return <WebRTCContext.Provider value={{ localStream, remoteStream, initializeConnection, endConnection }}>{children}</WebRTCContext.Provider>;
};

export const useWebRTC = () => {
	const context = useContext(WebRTCContext);
	if (!context) throw new Error('useWebRTC must be used within a WebRTCProvider');
	return context;
};
