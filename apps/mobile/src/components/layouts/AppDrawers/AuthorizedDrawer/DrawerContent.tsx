/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { type DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { UILinearGradient } from '@/ui/UILinearGradient';
import { UISvg } from '@/ui/UISvg';
import { UIText } from '@/ui/UIText';
import { useAuth } from '@/lib/providers/authProvider';

const DrawerContent = (props: DrawerContentComponentProps) => {
	const { logout } = useAuth();
	const [isAllActions, setIsAllActions] = useState(false);

	const onToggleAllActions = () => setIsAllActions((prev) => !prev);

	const onCloseDrawer = () => {
		setIsAllActions(false);
		props.navigation.closeDrawer();
	};

	return (
		<View className="flex-1">
			<View className={`z-10 flex bg-[#F5EFF5] px-5 pb-3 pt-14 ${isAllActions ? '-mb-16' : '-mb-12'}`}>
				<View className={`flex ${isAllActions ? 'flex-row-reverse justify-between' : 'items-end'}`}>
					<TouchableOpacity onPress={onCloseDrawer}>
						<UILinearGradient className="mb-5 w-min rounded-full bg-gray-300 p-2" varient="gradientPinkPurple">
							<UISvg name="close" className="h-3 w-3" stroke="white" />
						</UILinearGradient>
					</TouchableOpacity>
					{isAllActions && (
						<TouchableOpacity className="" onPress={onToggleAllActions}>
							<UIText className=" ">חזרה</UIText>
						</TouchableOpacity>
					)}
				</View>

				{isAllActions ? (
					<View className="items-start">
						<UIText className="font-RubikMedium text-lg">כל הפעולות</UIText>
					</View>
				) : (
					<View className="flex w-full flex-row items-start justify-between">
						<View className="flex flex-row gap-2">
							<Image className="h-12 w-12 rounded-full" source="leumit-store-logo" />
							<View className="flex items-start justify-between">
								<UIText className="font-RubikMedium text-purpleText text-base">אמיר בן שימול</UIText>
								<UIText className="text-purpleText text-base">{'עריכת פרופיל >'}</UIText>
							</View>
						</View>
						<TouchableOpacity className="mb-5 rounded-full bg-gray-300 p-2" onPress={onCloseDrawer}>
							<UIText>שפה</UIText>
						</TouchableOpacity>
					</View>
				)}
			</View>
			<DrawerContentScrollView {...props}>
				{!isAllActions && (
					<TouchableOpacity
						className={`flex flex-row items-center border-b-[0.5px] border-[#DFD5E1] px-3 py-4 ${isAllActions ? 'bg-[#F5EFF5]' : ''}`}
						onPress={onToggleAllActions}
					>
						<UIText className="font-RubikBold text-grayPrimary text-base">כל הפעולות</UIText>
						<UISvg name="arrow" className="ml-1 h-3 w-3" />
					</TouchableOpacity>
				)}
			</DrawerContentScrollView>
			<View className="border-t border-gray-200">
				<TouchableOpacity className="flex items-start px-2 py-4" onPress={logout}>
					<UIText className="font-RubikBold text-grayPrimary text-base">התנתקות</UIText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default DrawerContent;
