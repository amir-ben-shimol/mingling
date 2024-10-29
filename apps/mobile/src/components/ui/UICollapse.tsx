import React, { useEffect, useState } from 'react';
import { View, Pressable, type ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { UIIconButton } from './UIIconButton';
import { UIText } from './UIText';

type Props = {
	readonly title: string | React.ReactNode;
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly childrenClassName?: string;
	readonly arrowClassName?: string;
};

export const UICollapse: React.FC<Props> = (props: Props) => {
	const [collapsed, setCollapsed] = useState(true);
	const [finishedCollapsing, setFinishedCollapsing] = useState(true);
	const animationHeight = useSharedValue(0);

	const toggleCollapsed = () => {
		setCollapsed((prev) => !prev);
	};

	const collapseView = () => {
		setFinishedCollapsing(false);

		animationHeight.value = withTiming(0, {
			duration: 500,
			easing: Easing.inOut(Easing.ease),
		});

		setTimeout(() => {
			setFinishedCollapsing(true);
		}, 500);
	};

	const expandView = () => {
		animationHeight.value = withTiming(9999, {
			duration: 1500,
			easing: Easing.inOut(Easing.ease),
		});
	};

	useEffect(() => {
		if (collapsed) {
			collapseView();
		} else {
			expandView();
		}
	}, [collapsed]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			maxHeight: animationHeight.value,
		};
	});

	return (
		<Pressable className={`relative flex ${props.className}`} style={props.style} onPress={toggleCollapsed}>
			<UIText className="font-RubikSemiBold flex self-start">{props.title}</UIText>
			<View className="relative flex">
				<Animated.View
					style={[animatedStyle]}
					className={`${collapsed && finishedCollapsing ? '-mb-4' : 'mb-5'} flex-1 overflow-hidden ${props.childrenClassName}`}
				>
					{props.children}
				</Animated.View>
				<View className={`flex-2 absolute bottom-0 flex self-end ${props.arrowClassName}`}>
					<UIIconButton
						icon="arrow"
						varient="gradientPinkPurple"
						size="medium"
						svgContainerClassName={`${collapsed && finishedCollapsing ? '' : 'rotate-[90deg]'}`}
						onClick={toggleCollapsed}
					/>
				</View>
			</View>
		</Pressable>
	);
};
