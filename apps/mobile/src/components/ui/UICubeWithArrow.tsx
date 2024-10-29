import React from 'react';
import { router } from 'expo-router';
import { View, Pressable, type ViewStyle, Linking } from 'react-native';
import globalStyles from '@/styles/global';
import { UIIconButton } from './UIIconButton';

type Props = {
	readonly children: React.ReactNode;
	readonly showArrow: boolean;
	readonly link?: string;
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly linkType?: 'external' | 'internal';
	readonly iconOnClick?: () => void;
	readonly isPressable?: boolean;
};

export const UICubeWithArrow = (props: Props) => {
	const handlePress = () => {
		if (props.link) {
			props.linkType === 'external' ? Linking.openURL(props.link) : router.navigate(props.link);
		}

		if (props.iconOnClick) {
			props.iconOnClick();
		}
	};

	const content = (
		<View
			className={`flex w-full flex-row items-center justify-between rounded-lg bg-white px-4 py-6 ${props.className}`}
			style={[props.style, globalStyles.shadowCard]}
		>
			{props.children}
			{props.showArrow && (
				<View className="ml-5 self-end">
					<UIIconButton
						link={props.link}
						linkType={props.linkType}
						varient="gradientPinkPurple"
						icon="arrow"
						size="medium"
						onClick={props.iconOnClick}
					/>
				</View>
			)}
		</View>
	);

	return props.isPressable ? (
		<Pressable className="w-full" onPress={handlePress}>
			{content}
		</Pressable>
	) : (
		<View>{content}</View>
	);
};
