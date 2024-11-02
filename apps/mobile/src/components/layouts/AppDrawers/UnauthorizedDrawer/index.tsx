/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Pressable } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { UISvg } from '@/ui/UISvg';
import DrawerContent from './DrawerContent';

const UnauthorizedDrawer = () => {
	return (
		<Drawer
			drawerContent={(props) => <DrawerContent {...props} />}
			screenOptions={({ navigation }) => ({
				// headerTransparent: true,
				headerBackgroundContainerStyle: {
					backgroundColor: 'transparent',
				},
				// swipeEnabled: isWelcomeVisible,
				// headerBackground: () => null,

				// * This implement the left side of the header and not the right side due to application direction
				// headerRight: () => (isWelcomeVisible ? <UISvg name="hamburgerDark" className="h-[29px] w-[112px]" /> : null),
				headerLeft: () => (
					<Pressable className="flex flex-row items-center gap-2" onPress={() => navigation.toggleDrawer()}>
						<UISvg name="hamburgerDark" className="h-[32px] w-[42px]" />
					</Pressable>
				),
			})}
		/>
	);
};

export default UnauthorizedDrawer;
