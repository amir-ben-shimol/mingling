import { create } from 'zustand';

import type { Notification, NotificationWithTimeout } from '@mingling/types';
import { DEFAULT_NOTIFICATION_DURATION, UNMOUNTING_NOTIFICATION_DURATION } from '../data/consts/notifications';
// import { BackendService } from '../utils/backend-service';

type State = {
	readonly userNotifications: Notification[];
	readonly pushedNotifications: NotificationWithTimeout[];
};

type Action = {
	readonly showNotification: (notification: Notification) => void;
	readonly addUserNotification: (notification: Notification) => void;
	readonly updateUserNotification: (notification: Notification) => void;
	readonly removeUserNotification: (id: string) => void;
	readonly unmountNotification: (id: string) => void;
	readonly pauseHidingNotification: (id: string) => void;
	readonly resumeHidingNotification: (id: string) => void;
	readonly resetStore: () => void;
};

type NotificationsStore = State & Action;

const useNotificationsStore = create<NotificationsStore>((set, get) => ({
	userNotifications: [],
	pushedNotifications: [],

	showNotification: (notification) => {
		const notificationId = notification.id ?? Date.now().toString();

		const newNotification: NotificationWithTimeout = {
			...notification,
			id: notificationId,
			isUnmounting: false,
			duration: notification.duration || DEFAULT_NOTIFICATION_DURATION,
			startTime: Date.now(),
			remainingDuration: notification.duration || DEFAULT_NOTIFICATION_DURATION,
		};

		set((state) => ({
			pushedNotifications: [...state.pushedNotifications, newNotification],
		}));

		newNotification.timeoutId = setTimeout(() => {
			get().unmountNotification(notificationId);
		}, newNotification.duration);

		get().addUserNotification(notification);
	},

	addUserNotification: (notification) => {
		set((state) => ({
			userNotifications: [...state.userNotifications, notification],
		}));
	},

	updateUserNotification: (notification) => {
		set((state) => ({
			userNotifications: state.userNotifications.map((n) => (n.id === notification.id ? notification : n)),
		}));
	},

	removeUserNotification: (id) => {
		set((state) => ({
			userNotifications: state.userNotifications.filter((n) => n.id !== id),
		}));
	},

	unmountNotification: (id) => {
		set((state) => ({
			pushedNotifications: state.pushedNotifications.map((n) => (n.id === id ? { ...n, isUnmounting: true } : n)),
		}));

		setTimeout(() => {
			set((state) => ({
				pushedNotifications: state.pushedNotifications.filter((n) => n.id !== id),
			}));
		}, UNMOUNTING_NOTIFICATION_DURATION);
	},

	pauseHidingNotification: (id) => {
		set((state) => {
			const currentTime = Date.now();

			return {
				pushedNotifications: state.pushedNotifications.map((n) => {
					if (n.id === id) {
						clearTimeout(n.timeoutId);

						return {
							...n,
							remainingDuration: n.remainingDuration - (currentTime - n.startTime),
						};
					}

					return n;
				}),
			};
		});
	},

	resumeHidingNotification: (id) => {
		set((state) => {
			const notification = state.pushedNotifications.find((n) => n.id === id);

			if (notification && notification.remainingDuration > 0) {
				const newTimeoutId = setTimeout(() => {
					get().unmountNotification(id);
				}, notification.remainingDuration);

				return {
					pushedNotifications: state.pushedNotifications.map((n) => {
						if (n.id === id) {
							return {
								...n,
								timeoutId: newTimeoutId,
								startTime: Date.now(),
							};
						}

						return n;
					}),
				};
			}

			return state;
		});
	},
	resetStore: () => {
		set({ pushedNotifications: [], userNotifications: [] });
	},
}));

export { useNotificationsStore };
