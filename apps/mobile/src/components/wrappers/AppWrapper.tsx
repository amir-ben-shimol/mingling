import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot } from 'expo-router';
import AppErrorHandler from '@/modules/ApplErrorHandler';

const AppWrapper = () => {
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
