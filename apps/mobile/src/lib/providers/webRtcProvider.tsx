/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable padding-line-between-statements */
// src/providers/useWebRTC.tsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, MediaStream, mediaDevices } from 'react-native-webrtc';
import { useSocket } from '@/lib/providers/socketProvider';

type WebRTCContextProps = {
	localStream: MediaStream | null;
	remoteStreams: Map<string, MediaStream>;
	connected: boolean;
	partnerSocketIds: string[];
	setupWebRTC: (partnerSocketIds: string[]) => void;
	setupLocalStream: () => Promise<MediaStream>;
	endCall: () => void;
};

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useSocket();
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
	const [partnerSocketIds, setPartnerSocketIds] = useState<string[]>([]);

	const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

	const [makingOffer, setMakingOffer] = useState(false);

	useEffect(() => {
		if (!socket) return;

		const handleSignal = async ({ from, data }: { from: string; data: any }) => {
			console.log(`Received signal from ${from}`, data);
			let pc = peerConnections.current.get(from);

			if (!pc) {
				const stream = localStream || (await setupLocalStream());
				pc = createPeerConnection(from, stream);
				peerConnections.current.set(from, pc);
			}

			try {
				if (data.sdp) {
					const description = new RTCSessionDescription(data.sdp);
					const offerCollision = data.sdp.type === 'offer' && (makingOffer || pc.signalingState !== 'stable');

					const polite = isPolitePeer(from);

					if (!polite && offerCollision) {
						console.log('Ignoring offer due to collision (impolite peer)');
						return;
					}

					if (offerCollision) {
						console.log('Rolling back due to collision');
						await pc.setLocalDescription({ type: 'rollback', sdp: '' });
					}

					await pc.setRemoteDescription(description);

					if (description.type === 'offer') {
						const answer = await pc.createAnswer();
						await pc.setLocalDescription(answer);
						socket.emit('signal', { to: from, data: { sdp: pc.localDescription } });
					}
				} else if (data.candidate) {
					try {
						await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
					} catch (error) {
						console.error('Error adding received ice candidate', error);
					}
				}
			} catch (error) {
				console.error('Error handling signal', error);
			}
		};

		socket.on('signal', handleSignal);

		return () => {
			socket.off('signal', handleSignal);
		};
	}, [socket, makingOffer, localStream]);

	const setupLocalStream = async (): Promise<MediaStream> => {
		if (localStream) return localStream; // Return existing stream
		console.log('Setting up local stream');
		const stream = await mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});
		setLocalStream(stream);
		return stream;
	};

	const isPolitePeer = (partnerId: string): boolean => {
		if (!socket || !socket.id) {
			console.warn('Socket or socket.id is undefined in isPolitePeer');
			return false; // Handle accordingly
		}
		return socket.id < partnerId;
	};

	const createPeerConnection = (partnerId: string, stream: MediaStream): RTCPeerConnection => {
		console.log(`Creating peer connection with ${partnerId}`);

		const pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		stream.getTracks().forEach((track) => {
			console.log(`Adding track ${track.kind} to peer connection with ${partnerId}`);
			pc.addTrack(track, stream);
		});

		pc.addEventListener('icecandidate', (event) => {
			if (event.candidate) {
				console.log(`Sending ICE candidate to ${partnerId}`, event.candidate);
				socket?.emit('signal', { to: partnerId, data: { candidate: event.candidate } });
			}
		});

		pc.addEventListener('track', (event) => {
			console.log(`Received remote track from ${partnerId}`, event.track);
			setRemoteStreams((prev) => {
				const updatedStreams = new Map(prev);
				let remoteStream = updatedStreams.get(partnerId);
				if (!remoteStream) {
					remoteStream = new MediaStream();
					updatedStreams.set(partnerId, remoteStream);
				}
				if (event.track) {
					remoteStream.addTrack(event.track);
				}
				console.log(`Remote stream for ${partnerId} now has tracks:`, remoteStream.getTracks());
				return updatedStreams;
			});
		});

		pc.addEventListener('negotiationneeded', async () => {
			console.log(`Negotiation needed with ${partnerId}`);
			try {
				if (isPolitePeer(partnerId)) {
					setMakingOffer(true);
					const offer = await pc.createOffer({});
					await pc.setLocalDescription(offer);
					socket?.emit('signal', { to: partnerId, data: { sdp: pc.localDescription } });
				}
			} catch (error) {
				// console.error('Error during negotiation', error);
			} finally {
				setMakingOffer(false);
			}
		});

		return pc;
	};

	const setupWebRTC = async (partnerIds: string[]) => {
		const stream = await setupLocalStream(); // Ensure local stream is ready and get the stream
		setPartnerSocketIds(partnerIds);

		for (const partnerId of partnerIds) {
			const pc = createPeerConnection(partnerId, stream);
			peerConnections.current.set(partnerId, pc);

			// Only create an offer if we're the polite peer
			if (isPolitePeer(partnerId)) {
				try {
					setMakingOffer(true);
					const offer = await pc.createOffer({});
					await pc.setLocalDescription(offer);
					console.log(`Sending offer to ${partnerId}`, offer);
					socket?.emit('signal', { to: partnerId, data: { sdp: pc.localDescription } });
				} catch (error) {
					console.error('Error creating offer', error);
				} finally {
					setMakingOffer(false);
				}
			}
		}
	};

	const endCall = () => {
		peerConnections.current.forEach((pc) => {
			pc.close();
		});
		peerConnections.current.clear();
		setRemoteStreams(new Map());
		setPartnerSocketIds([]);
	};

	return (
		<WebRTCContext.Provider
			value={{
				localStream,
				remoteStreams,
				connected: partnerSocketIds.length > 0,
				partnerSocketIds,
				setupWebRTC,
				setupLocalStream,
				endCall,
			}}
		>
			{children}
		</WebRTCContext.Provider>
	);
};

export const useWebRTC = () => {
	const context = useContext(WebRTCContext);

	if (!context) {
		throw new Error('useWebRTC must be used within a WebRTCProvider');
	}

	return context;
};
