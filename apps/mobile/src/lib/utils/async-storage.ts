import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncStorage = async (key: string) => {
	try {
		const value = await AsyncStorage.getItem(key);

		return value;
	} catch (error) {
		console.error('AsyncStorage error: ', error);

		return null;
	}
};

export const setAsyncStorage = async (key: string, value: string) => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (error) {
		console.error('AsyncStorage error: ', error);
	}
};

export const clearAsyncStorage = async () => {
	try {
		await AsyncStorage.clear();
	} catch (error) {
		console.error('AsyncStorage error: ', error);
	}
};

export const removeAsyncStorage = async (key: string) => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (error) {
		console.error('AsyncStorage error: ', error);
	}
};
