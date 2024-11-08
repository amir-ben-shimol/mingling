import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Slot } from 'expo-router';
import { View, type ViewStyle } from 'react-native';
import { UINotifications } from '@/ui/UINotifications';

type Props = {
	readonly className?: string;
	readonly style?: ViewStyle;
};

const BaseLayout = (props: Props) => {
	const fadeSlideValue = useSharedValue(0);

	useEffect(() => {
		fadeSlideValue.value = withTiming(1, {
			duration: 600,
			easing: Easing.out(Easing.ease),
		});
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: fadeSlideValue.value,
	}));

	return (
		// Setting a background color on Animated.View to control initial flash color
		<View
			style={[{ backgroundColor: '#18181B' }, props.style]} // Ensure background is dark gray initially
			className={`flex-1 ${props.className}`}
		>
			<Animated.View style={animatedStyle} className="flex h-full flex-1 flex-col">
				<UINotifications />
				<Slot />
			</Animated.View>
		</View>
	);
};

export default BaseLayout;
