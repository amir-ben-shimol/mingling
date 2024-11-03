// src/hooks/useNotificationListener.ts
import { useEffect } from 'react';
import type { Notification } from '@mingling/types';
import type { Socket } from 'socket.io-client';
import { useNotificationsStore } from '@/lib/store/useNotificationsStore';

const useSocketListeners = (socket: Socket | null) => {
	const { showNotification } = useNotificationsStore();

	useEffect(() => {
		if (!socket) return;

		const handleNotification = (notification: Notification) => {
			showNotification(notification);
		};

		socket.on('notification', handleNotification);

		return () => {
			socket.off('notification', handleNotification);
		};
	}, [socket, showNotification]);
};

export default useSocketListeners;
