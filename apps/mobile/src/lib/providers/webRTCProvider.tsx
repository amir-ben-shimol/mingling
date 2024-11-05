/* eslint-disable @typescript-eslint/no-explicit-any */
// src/providers/WebRtcProvider.tsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, type MediaStream, mediaDevices } from 'react-native-webrtc';
import { useSocket } from '@/lib/providers/socketProvider';

type WebRTCContextProps = {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	connected: boolean;
	partnerSocketId: string | null;
	setupWebRTC: (partnerSocketId: string) => void;
	setupLocalStream: () => void;
	endCall: () => void;
};

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRtcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useSocket();
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [partnerSocketId, setPartnerSocketId] = useState<string | null>(null);

	const pcRef = useRef<RTCPeerConnection | null>(null);

	useEffect(() => {
		if (!socket) return;

		const handleSignal = async ({ from, data }: { from: string; data: any }) => {
			if (!pcRef.current) return;

			if (data.sdp) {
				await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));

				if (data.sdp.type === 'offer') {
					const answer = await pcRef.current.createAnswer();

					await pcRef.current.setLocalDescription(answer);
					socket.emit('signal', { to: from, data: { sdp: answer } });
				}
			} else if (data.candidate) {
				try {
					await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
				} catch (error) {
					console.error('Error adding received ice candidate', error);
				}
			}
		};

		socket.on('signal', handleSignal);

		return () => {
			socket.off('signal', handleSignal);
		};
	}, [socket]);

	const setupLocalStream = async () => {
		const stream = await mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});

		setLocalStream(stream);
		stream.getTracks().forEach((track) => pcRef.current?.addTrack(track, stream));
	};

	const setupWebRTC = async (partnerId: string) => {
		setPartnerSocketId(partnerId);

		const pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		pcRef.current = pc;

		if (!localStream) {
			const stream = await mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});

			setLocalStream(stream);
			stream.getTracks().forEach((track) => pc.addTrack(track, stream));
		}

		pc.addEventListener('icecandidate', (event) => {
			if (event.candidate) {
				socket?.emit('signal', { to: partnerId, data: { candidate: event.candidate } });
			}
		});

		pc.addEventListener('track', (event) => {
			setRemoteStream(event.streams[0] || null);
		});

		const offer = await pc.createOffer({});

		await pc.setLocalDescription(offer);
		socket?.emit('signal', { to: partnerId, data: { sdp: offer } });
	};

	const endCall = () => {
		if (pcRef.current) {
			pcRef.current.close();
			pcRef.current = null;
		}

		setRemoteStream(null);
		setPartnerSocketId(null);
	};

	return (
		<WebRTCContext.Provider
			value={{
				localStream,
				remoteStream,
				connected: !!partnerSocketId,
				partnerSocketId,
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
		throw new Error('useWebRTC must be used within a WebRtcProvider');
	}

	return context;
};
