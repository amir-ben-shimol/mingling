/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/WebRTCProvider.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, type MediaStream } from 'react-native-webrtc';
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
					video: { frameRate: 30, facingMode: 'user' },
				});

				setLocalStream(stream);

				const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

				stream.getTracks().forEach((track) => {
					console.log(`Adding track: ${track.kind}`);
					pc.addTrack(track, stream);
				});
				// Ensure `ontrack` event is triggered when remote stream is received
				console.log('Received remote stream');
				pc.addEventListener('track', (event) => {
					if (event.streams && event.streams[0]) {
						setRemoteStream(event.streams[0]);
					}
				});

				// Emit candidates to other peer
				pc.addEventListener('icecandidate', (event) => {
					if (event.candidate) {
						socket?.emit('signal', { type: 'candidate', candidate: event.candidate });
					}
				});

				// Handle re-negotiation if needed
				// pc.addEventListener('negotiationneeded', () => {
				// 	initializeConnection();
				// });

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

	// Listen for incoming signals
	useEffect(() => {
		const handleIncomingSignal = async (data: any) => {
			if (!peerConnection) return;

			if (data.type === 'offer') {
				// Set remote description and create an answer
				await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
				const answer = await peerConnection.createAnswer();

				await peerConnection.setLocalDescription(answer);
				socket?.emit('signal', { to: data.from, type: 'answer', answer });
			} else if (data.type === 'answer') {
				// Complete connection by setting the remote description
				await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
			} else if (data.type === 'candidate') {
				// Add ICE candidate
				try {
					await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
				} catch (error) {
					console.error('Error adding received ICE candidate', error);
				}
			}
		};

		socket?.on('signal', handleIncomingSignal);

		return () => {
			socket?.off('signal', handleIncomingSignal);
		};
	}, [peerConnection, socket]);

	// Initialize WebRTC connection with a matched user
	const initializeConnection = (otherUserId: string) => {
		if (peerConnection) {
			peerConnection
				.createOffer({})
				.then((offer) => peerConnection.setLocalDescription(offer))
				.then(() => {
					if (otherUserId) {
						// Send offer only if `otherUserId` is valid
						socket?.emit('signal', { to: otherUserId, type: 'offer', offer: peerConnection.localDescription });
					}
				})
				.catch((error) => console.error('Error creating offer:', error));
		}
	};

	// Add ICE candidates with `to` check
	// peerConnection?.addEventListener('icecandidate', (event) => {
	// 	if (event.candidate && otherUserId) {
	// 		socket?.emit('signal', { to: otherUserId, type: 'candidate', candidate: event.candidate });
	// 	}
	// });

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
