/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';
import { router } from 'expo-router';
import type { ParamListBase, RouteProp } from '@react-navigation/native';
import { useTheme } from '@/lib/providers/themeProvider';
import { verticalScale } from '@/lib/utils/scaling';
import { UISvg } from '@/ui/UISvg';
import { UINavBackButton } from '@/ui/UINavBackButton';
import DrawerContent from './DrawerContent';

const AuthorizedDrawer = () => {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const opacity = useSharedValue(isDark ? 1 : 0);

	const isSettingFastLogin = (route: RouteProp<ParamListBase, string>) => {
		return route.name === 'fast-login';
	};

	useEffect(() => {
		opacity.value = withTiming(isDark ? 1 : 0, {
			duration: 600,
			easing: Easing.inOut(Easing.ease),
		});
	}, [isDark]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	return (
		<>
			<StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
			<Drawer
				drawerContent={(props) => <DrawerContent {...props} />}
				screenOptions={({ route }) => ({
					// headerBackgroundContainerStyle: {
					// 	backgroundColor: isDark ? 'transparent' : 'white',
					// 	shadowColor: 'black',
					// 	shadowOffset: { width: 0, height: 2 },
					// 	shadowOpacity: isDark ? undefined : 0.2,
					// 	shadowRadius: 4,
					// 	elevation: 4,
					// 	height: verticalScale(110),
					// },

					swipeEnabled: true,

					// headerBackground: () => (
					// 	<Animated.View className="absolute left-0 top-0 h-[151px] w-full" style={animatedStyle}>
					// 		<Image className="h-full w-full" source="header-background" />
					// 		{route.name === '(home)' && (
					// 			<Image className="absolute -right-5 top-28 h-[165px] w-[100px]" source="home-page-hasida-top" alt="Hasida" />
					// 		)}
					// 	</Animated.View>
					// ),

					// * This implement the left side of the header and not the right side due to application direction
					// headerRight: () =>
					// 	isSettingFastLogin(route) ? (
					// 		<UISvg name="leumitBrandLogoBlue" className="h-[30px] w-[115px]" onClick={() => router.navigate('/')} />
					// 	) : (
					// 		<UISvg name="leumitBrandLogoBlue" className="h-[30px] w-[115px]" onClick={() => router.navigate('/')} />
					// 	),

					// headerLeft: () =>
					// 	isSettingFastLogin(route) ? null : (
					// 		<View className="flex flex-row items-center">
					// 			<UISvg
					// 				name={isDark ? 'leumitBrandLogoBlue' : 'leumitBrandLogoBlue'}
					// 				className="ml-[10px] h-[28px] w-[38px]"
					// 				onClick={() => router.navigate('/')}
					// 			/>
					// 		</View>
					// 	),
				})}
			/>
		</>
	);
};

export default AuthorizedDrawer;
