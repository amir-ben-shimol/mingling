import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useNavBack } from '@/lib/hooks/useNavBack';
import { UISvg } from './UISvg';
import { UILinearGradient } from './UILinearGradient';
import UITextGradient from './UITextGradient';

export const UINavBackButton = () => {
	const { triggerNavBack } = useNavBack();

	if (!router.canGoBack()) {
		return null;
	}

	const onPress = () => {
		router.back();
		triggerNavBack();
	};

	return (
		<Pressable className="flex flex-row items-center" onPress={onPress}>
			<UILinearGradient varient="gradientPinkPurple" className="mr-1 rounded-full bg-gray-300 p-2">
				<UISvg name="arrow" className="h-3 w-3 rotate-180" fill="white" />
			</UILinearGradient>
			<UITextGradient colors={['#DD4081', '#523E83']} text="חזרה" />
		</Pressable>
	);
};
