import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, StatusBar, type ImageResizeMode, type ImageSourcePropType } from 'react-native';

type UIAnimatedSplashScreenProps = {
	preload?: boolean;
	logoWidth?: number;
	logoHeight?: number;
	backgroundColor?: string;
	isLoaded: boolean;
	disableBackgroundImage?: boolean;
	logoImage?: ImageSourcePropType;
	translucent?: boolean;
	customComponent?: React.ReactElement;
	imageBackgroundSource?: ImageSourcePropType;
	imageBackgroundResizeMode?: ImageResizeMode;
	children?: React.ReactNode;
};

const UIAnimatedSplashScreen: React.FC<UIAnimatedSplashScreenProps> = ({
	preload,
	logoWidth = 150,
	logoHeight = 150,
	backgroundColor,
	isLoaded,
	disableBackgroundImage,
	logoImage,
	translucent = false,
	customComponent,
	imageBackgroundSource,
	imageBackgroundResizeMode,
	children,
}) => {
	const [animationDone, setAnimationDone] = useState(false);
	const scaleAnimation = useRef(new Animated.Value(1)).current; // Scale starts at 1 (original size)
	const opacityAnimation = useRef(new Animated.Value(1)).current; // Opacity starts at 1 (fully visible)

	useEffect(() => {
		// Trigger the animation when isLoaded becomes true
		if (isLoaded) {
			Animated.sequence([
				// Delay of 1 second
				Animated.delay(1000),
				// Parallel animations for scaling up and fading out
				Animated.parallel([
					Animated.timing(scaleAnimation, {
						toValue: 10,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(opacityAnimation, {
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
					}),
				]),
			]).start(() => {
				// Once animation is complete, set animationDone to true to show the children
				setAnimationDone(true);
			});
		}
	}, [isLoaded, scaleAnimation, opacityAnimation]);

	const renderChildren = () => {
		if (preload || preload === null) {
			return children;
		}

		if (isLoaded) {
			return children;
		}

		return null;
	};

	return (
		<View className="flex-1">
			<StatusBar backgroundColor={backgroundColor || undefined} animated translucent={translucent} />
			{!animationDone && <View className="absolute inset-0" />}
			<View className="flex-1 items-center justify-center bg-gray-800">
				{!animationDone && (
					<Animated.View style={{ backgroundColor: backgroundColor || 'transparent', opacity: opacityAnimation }} className="absolute inset-0" />
				)}
				{animationDone && <Animated.View className="w-full flex-1">{renderChildren()}</Animated.View>}
				{!animationDone && !disableBackgroundImage && (
					<Animated.Image
						resizeMode={imageBackgroundResizeMode || 'cover'}
						source={imageBackgroundSource || require('../../assets/images/global/background.png')}
						style={{
							transform: [{ scale: scaleAnimation }],
							opacity: opacityAnimation,
							tintColor: backgroundColor || undefined,
						}}
						className="absolute inset-0 items-center justify-center"
					/>
				)}
				{!animationDone && (
					<View className="absolute inset-0 items-center justify-center">
						{customComponent ? (
							<Animated.View
								style={{
									width: logoWidth,
									height: logoHeight,
									transform: [{ scale: scaleAnimation }],
									opacity: opacityAnimation,
								}}
								className="items-center justify-center"
							>
								{customComponent}
							</Animated.View>
						) : (
							<Animated.Image
								source={logoImage}
								resizeMode="contain"
								style={{
									width: logoWidth,
									height: logoHeight,
									transform: [{ scale: scaleAnimation }],
									opacity: opacityAnimation,
								}}
								className=""
							/>
						)}
					</View>
				)}
			</View>
		</View>
	);
};

export default UIAnimatedSplashScreen;
