/* eslint-disable require-await */
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useEffect } from 'react';

// Notification handler to show alerts
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

// Utility function to register for push notifications
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
	let token: string | undefined;

	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();

			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');

			return;
		}

		try {
			const projectId = Constants?.expoConfig?.extra?.['eas']?.projectId ?? Constants?.easConfig?.projectId;

			if (!projectId) {
				throw new Error('Project ID not found');
			}

			token = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			console.log(token);
		} catch (error) {
			console.error('Error getting push token:', error);
		}
	} else {
		alert('Must use physical device for Push Notifications');
	}

	return token;
}

// Utility function to schedule a push notification
export async function schedulePushNotification(
	title: string,
	body: string,
	data: Record<string, unknown>,
	trigger: Notifications.NotificationTriggerInput,
): Promise<void> {
	await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			data,
			sound: 'default', // Ensure the notification uses the default sound
		},
		trigger,
	});
}

// Utility function to set the badge count
export async function setBadgeCount(count: number): Promise<void> {
	if (Platform.OS === 'ios') {
		await Notifications.setBadgeCountAsync(count);
	} else {
		console.warn('Setting badge count is only supported on iOS.');
	}
}

// Utility function to clear all notifications
export async function clearAllNotifications(): Promise<void> {
	await Notifications.dismissAllNotificationsAsync();
}

// Utility function to handle notification response
export function useNotificationResponseHandler(onNotificationResponse: (response: Notifications.NotificationResponse) => void): void {
	useEffect(() => {
		const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
			onNotificationResponse(response);
		});

		return () => {
			Notifications.removeNotificationSubscription(responseListener);
		};
	}, [onNotificationResponse]);
}
