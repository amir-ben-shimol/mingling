import React, { useCallback } from 'react';
import { Slot, useFocusEffect } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '@/providers/themeProvider';

type PageProps = {
	readonly theme?: 'light' | 'dark';
	readonly className?: string;
	readonly header?: boolean;
	readonly navBack?: boolean;
};

const BaseLayout: React.FC<PageProps> = ({ theme = 'light', className = '', header = true }) => {
	const { setTheme } = useTheme();

	useFocusEffect(
		useCallback(() => {
			//TODO: change for cleaner solution
			setTimeout(() => {
				setTheme(theme);
			}, 100);
		}, [theme]),
	);

	return (
		<View className={`flex-1 bg-white ${className}`}>
			{/* <View className={`flex h-full px-4 ${theme === 'light' ? 'mt-8' : 'mt-12'}`}> */}
			<Slot
				screenOptions={{
					headerShown: header,
					Animation: 'fade',
					AnimationEffect: 'fade',
					AnimationDuration: 300,
					AnimationEasing: 'ease-in-out',
					scrollEnabled: true,
				}}
			/>
		</View>
		// </View>
	);
};

export default BaseLayout;
