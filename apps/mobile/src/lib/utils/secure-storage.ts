import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (key: string, value: string): Promise<void> => {
	try {
		await SecureStore.setItemAsync(key, value);
		console.log('Token saved securely:', value);
	} catch (error) {
		console.error('Failed to save token securely.', error);
	}
};

export const getToken = async (key: string): Promise<string | null> => {
	try {
		const token = await SecureStore.getItemAsync(key);

		console.log('Token retrieved securely:', token);

		return token;
	} catch (error) {
		console.error('Failed to retrieve token securely.', error);

		return null;
	}
};

export const clearToken = async (key: string): Promise<void> => {
	try {
		await SecureStore.deleteItemAsync(key);
		console.log('Token cleared securely');
	} catch (error) {
		console.error('Failed to clear token securely.', error);
	}
};

export const migrateToken = async (key: string): Promise<string | null> => {
	try {
		const token = await AsyncStorage.getItem(key);

		if (token) {
			await saveToken(key, token);
			// await AsyncStorage.removeItem(key);
			console.log('Token migrated to secure storage');

			return token;
		} else {
			console.log('No token found in AsyncStorage');

			return null;
		}
	} catch (error) {
		console.error('Failed to migrate token to secure storage.', error);

		return null;
	}
};
