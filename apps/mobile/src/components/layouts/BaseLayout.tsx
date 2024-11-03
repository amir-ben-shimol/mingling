import React from 'react';
import { Slot } from 'expo-router';
import { View, type ViewStyle } from 'react-native';
import { UINotifications } from '@/ui/UINotifications';

type Props = {
	readonly className?: string;
	readonly style?: ViewStyle;
};

const BaseLayout = (props: Props) => {
	return (
		<View className={`flex-1 ${props.className}`} style={props.style}>
			<View className="flex h-full flex-1 flex-col">
				<UINotifications />

				<Slot />
			</View>
		</View>
	);
};

export default BaseLayout;
