import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export const useNavBack = () => {
	useEffect(() => {
		const fetch = async () => {
			const navigatedBack = await AsyncStorage.getItem('navigatedBack');

			if (navigatedBack === 'true') {
				await AsyncStorage.removeItem('navigatedBack');
			}
		};

		fetch();
	}, []);

	const triggerNavBack = async () => {
		await AsyncStorage.setItem('navigatedBack', 'true');
	};

	const clearNavBack = async () => {
		await AsyncStorage.removeItem('navigatedBack');
	};

	const checkIfUserNavigatedBack = async () => {
		const navigatedBack = await AsyncStorage.getItem('navigatedBack');

		if (navigatedBack === 'true') {
			await AsyncStorage.removeItem('navigatedBack');

			return true;
		}

		return false;
	};

	return { checkIfUserNavigatedBack, triggerNavBack, clearNavBack };
};
