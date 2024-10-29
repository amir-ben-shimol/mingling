import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import globalStyles from '@/styles/global';
import { UIText } from './UIText';

type Props = {
	readonly title: string | React.ReactNode;
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly subTitle?: string;
	readonly isOpen: boolean;
	readonly onToggle: () => void;
	readonly disabled?: boolean;
};

export const UICollapseWithSubTitle = (props: Props) => {
	const animationHeight = useSharedValue(props.isOpen ? 9999 : 0);
	const opacity = useSharedValue(props.isOpen ? 1 : 0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			maxHeight: animationHeight.value,
			opacity: opacity.value,
		};
	});

	React.useEffect(() => {
		if (props.isOpen) {
			animationHeight.value = withTiming(9999, {
				duration: 300,
				easing: Easing.inOut(Easing.ease),
			});
			opacity.value = withTiming(1, {
				duration: 300,
				easing: Easing.inOut(Easing.ease),
			});
		} else {
			animationHeight.value = withTiming(0, {
				duration: 300,
				easing: Easing.inOut(Easing.ease),
			});
			opacity.value = withTiming(0, {
				duration: 300,
				easing: Easing.inOut(Easing.ease),
			});
		}
	}, [props.isOpen]);

	return (
		<View style={globalStyles.shadowCard} className={`mt-6 w-full rounded bg-white pb-6 ${props.className} ${props.disabled ? 'opacity-20' : ''}`}>
			<View className="flex flex-row items-center justify-between transition-all duration-300 ease-in-out">
				<View className="flex pl-6 pt-6">
					<UIText className="text-grayPrimary font-RubikSemiBold">{props.title}</UIText>
					{props.subTitle && <UIText className="text-gray-800">{props.subTitle}</UIText>}
				</View>
			</View>
			<Animated.View
				style={animatedStyle}
				className={`px-5 transition-all duration-300 ease-in-out ${props.isOpen ? 'max-h-fit opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}
				aria-hidden={!props.isOpen}
			>
				{props.children}
			</Animated.View>
		</View>
	);
};
