import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type DrawerContentComponentProps } from '@react-navigation/drawer';
import { UISvg } from '@/ui/UISvg';
import { UIText } from '@/ui/UIText';

const DrawerContent = (props: DrawerContentComponentProps) => {
	const onCloseDrawer = () => {
		props.navigation.closeDrawer();
	};

	const clearAsyncStorage = async () => {
		await AsyncStorage.clear();
	};

	return (
		<View className="flex-1" style={{ direction: 'rtl' }}>
			<View className="z-10 -mb-12 flex bg-[#F5EFF5] px-5 pb-3 pt-14">
				<View className="flex items-end">
					<TouchableOpacity className="mb-5 w-min rounded-full bg-gray-300 p-2" onPress={onCloseDrawer}>
						<UISvg name="close" className="fill-purpleText h-3 w-3" />
					</TouchableOpacity>

					<TouchableOpacity className="mb-5 rounded-full bg-gray-300 p-2" onPress={clearAsyncStorage}>
						<UIText>clear</UIText>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default DrawerContent;
