import React, { useEffect, useCallback } from 'react';
import { View, Pressable, StatusBar } from 'react-native';
import { Image } from 'expo-image';

import * as Haptics from 'expo-haptics';
import { router, Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';

import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { Notifications } from '@/modules/Notifications';
import { Profile } from '@/modules/Profile';

const BottomTabsNavigator: React.FC = () => {
	const rotation = useSharedValue(0);
	const pressRotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withSequence(
				withTiming(45, { duration: 250 }),
				withTiming(-20, { duration: 250 }),
				withTiming(20, { duration: 250 }),
				withTiming(0, { duration: 250 }),
				withTiming(0, { duration: 500 }),
				withTiming(0, { duration: 1500 }),
			),
			-1,
			false,
		);
	}, [rotation]);

	const handlePress = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

		pressRotation.value = withSequence(
			withTiming(360, { duration: 500, easing: Easing.in(Easing.ease) }),
			withTiming(720, { duration: 500, easing: Easing.out(Easing.ease) }),
			withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) }),
		);

		router.navigate('/playground');
	}, [pressRotation]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value + pressRotation.value}deg` }],
	}));

	return (
		<>
			<StatusBar barStyle="light-content" />
			<Tabs
				screenOptions={(router) => ({
					tabBarActiveTintColor: '#60A5FA', // Light blue for active tab
					tabBarInactiveTintColor: '#A1A1AA', // Gray for inactive tabs
					tabBarStyle: {
						backgroundColor: '#27272A', // Darker background for the tab bar
						borderTopColor: '#3F3F46', // Subtle border for separation
						display: router.route.name === 'playground' ? 'none' : 'flex',
						marginBottom: 20,
					},
					tabBarLabelStyle: { fontSize: 12, position: 'absolute', bottom: -12, fontWeight: '500' },
					headerShown: true,
					unmountOnBlur: true,

					headerStyle: {
						backgroundColor: '#27272A', // Dark background for header
						elevation: 0, // Remove shadow on Android
						shadowOpacity: 0, // Remove shadow on iOS
					},
					headerShadowVisible: false, // Explicitly hide header shadow on all platforms

					headerTintColor: '#E5E7EB', // Light gray for header text/icons

					headerRight: () => <Notifications />,
					headerLeft: () => <Profile />,
					headerTitle: '',
				})}
			>
				<Tabs.Screen
					name="(home)"
					options={{
						tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
						tabBarLabel: 'Home',
					}}
				/>
				<Tabs.Screen
					name="playground"
					options={{
						tabBarIcon: () => (
							<Pressable onPress={handlePress}>
								<View className="mb-10 flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 p-2">
									<Animated.View style={animatedStyle} className="flex items-center justify-center rounded-full bg-blue-500 p-2">
										<Image source="app_logo" className="h-14 w-14" />
									</Animated.View>
								</View>
							</Pressable>
						),
						tabBarLabel: 'Playground',
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
						tabBarLabel: 'Profile',
					}}
				/>
				<Tabs.Screen
					name="user"
					options={{
						tabBarItemStyle: { display: 'none' },
					}}
				/>
			</Tabs>
		</>
	);
};

export default BottomTabsNavigator;
