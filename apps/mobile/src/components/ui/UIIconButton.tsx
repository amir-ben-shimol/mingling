import React from 'react';
import { Pressable, Linking, type ViewStyle } from 'react-native';
import { router } from 'expo-router';
import type { icons } from '@leumit/common';
import { UISvg } from './UISvg';
import { UILinearGradient } from './UILinearGradient';

type Props = {
	readonly icon: keyof typeof icons;
	readonly link?: string;
	readonly size: 'small' | 'medium' | 'large';
	readonly linkType?: 'external' | 'internal';
	readonly svgContainerClassName?: string;
	readonly onClick?: () => void;
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly varient:
		| 'gradientGreenBlue'
		| 'gradientPinkPurple'
		| 'borderOnlyGradientPinkPurple'
		| 'whiteAndShadow'
		| 'whiteLightBlueBorder'
		| 'whitePurpleBorder'
		| 'buttonTextRed'
		| 'white'
		| 'buttonTextBlack'
		| 'darkGray';
};

export const UIIconButton: React.FC<Props> = (props: Props) => {
	const svgClassName = `${
		props.size === 'small' ? '!w-3 !h-3' : props.size === 'medium' ? '!w-3.5 !h-3.5' : props.size === 'large' ? '!w-4 !h-4' : '!w-4 !h-4'
	} ${props.svgContainerClassName}`;

	const handlePress = () => {
		if (props.link) {
			props.linkType === 'external' ? Linking.openURL(props.link) : router.navigate(props.link);
		} else if (props.onClick) {
			props.onClick();
		}
	};

	return (
		<Pressable style={props.style} className={props.className} onPress={handlePress}>
			<UILinearGradient className="flex h-6 w-6 items-center justify-center" varient={props.varient} style={{ borderRadius: 999 }}>
				<UISvg name={props.icon} fill="white" className={`${svgClassName}`} />
			</UILinearGradient>
		</Pressable>
	);
};
