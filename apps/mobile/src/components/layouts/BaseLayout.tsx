import React, { useCallback } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Slot, useFocusEffect } from 'expo-router';
import { View, type ViewStyle, Dimensions, StatusBar } from 'react-native';
import { UINotifications } from '@/ui/UINotifications';
import { UIText } from '@/ui/UIText';

type Props = {
	readonly className?: string;
	readonly title?: string;
	readonly style?: ViewStyle;
	readonly animationType?: 'fadeSlideIn' | 'bubbleExpand' | 'componentSlideExpand';
	readonly animationComponent?: React.ReactElement;
};

const BaseLayout = (props: Props) => {
	const { animationType = 'fadeSlideIn', animationComponent, className, title, style } = props;

	const windowDimensions = Dimensions.get('window');
	const windowHeight = windowDimensions.height;
	const windowWidth = windowDimensions.width;

	const fadeSlideValue = useSharedValue(0);
	const translateYfadeSlideIn = useSharedValue(50);
	const translateYcomponentSlideExpand = useSharedValue(windowHeight / 2 - 60);
	const scale = useSharedValue(1);
	const opacity = useSharedValue(1);
	const contentOpacity = useSharedValue(0);

	const resetAnimationValues = useCallback(() => {
		fadeSlideValue.value = 0;
		translateYfadeSlideIn.value = 50;
		translateYcomponentSlideExpand.value = windowHeight / 2 - 60;
		scale.value = 1;
		opacity.value = 1;
		contentOpacity.value = 0;

		if (animationType === 'fadeSlideIn') {
			fadeSlideValue.value = withTiming(1, {
				duration: 1000,
				easing: Easing.out(Easing.ease),
			});
			translateYfadeSlideIn.value = withTiming(0, {
				duration: 400,
				easing: Easing.out(Easing.ease),
			});
		} else if (animationType === 'bubbleExpand') {
			scale.value = withTiming(1, {
				duration: 600,
				easing: Easing.out(Easing.ease),
			});
			opacity.value = withTiming(1, {
				duration: 600,
				easing: Easing.out(Easing.ease),
			});
		} else if (animationType === 'componentSlideExpand') {
			translateYcomponentSlideExpand.value = withTiming(
				-50,
				{
					duration: 700,
					easing: Easing.inOut(Easing.cubic),
				},
				() => {
					scale.value = withTiming(
						50,
						{
							duration: 1000,
							easing: Easing.out(Easing.ease),
						},
						() => {
							opacity.value = withTiming(
								0,
								{
									duration: 200,
									easing: Easing.out(Easing.ease),
								},
								() => {
									contentOpacity.value = withTiming(1, {
										duration: 1000,
										easing: Easing.out(Easing.ease),
									});
								},
							);
						},
					);
				},
			);
		}
	}, [animationType, fadeSlideValue, translateYfadeSlideIn, translateYcomponentSlideExpand, scale, opacity, contentOpacity]);

	useFocusEffect(
		useCallback(() => {
			resetAnimationValues();
		}, [resetAnimationValues]),
	);

	const animationComponentStyle = useAnimatedStyle(() => {
		if (animationType === 'componentSlideExpand') {
			return {
				opacity: opacity.value,
				transform: [{ translateY: translateYcomponentSlideExpand.value }, { scale: scale.value }],
			};
		}

		return {};
	});

	const contentAnimatedStyle = useAnimatedStyle(() => {
		if (animationType === 'componentSlideExpand') {
			return {
				opacity: contentOpacity.value,
				flex: 1,
			};
		} else if (animationType === 'fadeSlideIn') {
			return {
				opacity: fadeSlideValue.value,
				transform: [{ translateY: translateYfadeSlideIn.value }],
				flex: 1,
			};
		} else if (animationType === 'bubbleExpand') {
			return {
				opacity: opacity.value,
				transform: [{ scale: scale.value }],
				flex: 1,
			};
		}

		return { flex: 1 };
	});

	return (
		<View style={[{ backgroundColor: '#18181B' }, style]} className={`flex-1 ${className}`}>
			<StatusBar backgroundColor="#18181B" barStyle="light-content" />

			{title && <UIText className="font-RubikBold mt-4 w-full px-2 text-4xl text-gray-100">{title}</UIText>}

			{animationType === 'componentSlideExpand' && animationComponent && (
				<Animated.View
					style={[
						{
							position: 'absolute',
							left: (windowWidth - 150) / 2,
							top: (windowHeight - 60) / 2,
							width: 150,
							height: 150,
							alignItems: 'center',
							justifyContent: 'center',
						},
						animationComponentStyle,
					]}
				>
					{animationComponent}
				</Animated.View>
			)}

			<Animated.View style={contentAnimatedStyle}>
				<UINotifications />
				<Slot />
			</Animated.View>
		</View>
	);
};

export default BaseLayout;
