import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot } from 'expo-router';
import AppErrorHandler from '@/modules/ApplErrorHandler';

type Props = {
	readonly onLayout: () => Promise<void>;
};

const AppWrapper = (props: Props) => {
	return (
		<GestureHandlerRootView className="flex-1 bg-[#27272A]" onLayout={props.onLayout}>
			<BottomSheetModalProvider>
				<AppErrorHandler />
				<Slot />
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
};

export default AppWrapper;
