import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot } from 'expo-router';
import { useSession } from '@/lib/providers/sessionProvider';
import AppErrorHandler from '@/modules/ApplErrorHandler';

const AppWrapper = () => {
	const { signOut } = useSession();

	useEffect(() => {
		const handleAppStateChange = (nextAppState: string) => {
			if (nextAppState === 'background') {
				signOut();
			}
		};

		const subscription = AppState.addEventListener('change', handleAppStateChange);

		return () => {
			subscription.remove();
		};
	}, []);

	return (
		<GestureHandlerRootView className="flex-1 bg-white pb-8">
			<BottomSheetModalProvider>
				<AppErrorHandler />
				<Slot />
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
};

export default AppWrapper;
