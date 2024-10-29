import React from 'react';
import type { ViewStyle } from 'react-native';
import { UIText } from './UIText';
import UITextGradient from './UITextGradient';

type Props = {
	readonly children: string;
	readonly varient?: 'white' | 'gradientRedPurple' | 'gradientGreenBlue' | 'gradientPinkPurple' | 'dark' | 'blue';
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly size?: 'small' | 'medium' | 'large';
	readonly colors?: string[];
	readonly isGradient?: boolean;
};

export const UITitle = (props: Props) => {
	const textFontSize = props.size === 'small' ? 'text-lg' : props.size === 'medium' ? 'text-xl' : props.size === 'large' ? 'text-2xl' : 'text-2xl';

	return props.isGradient ? (
		<UITextGradient
			style={props.style}
			className={`${textFontSize} font-RubikBold ${props.className}`}
			colors={props.colors || ['#DD4081', '#523E83']}
			text={props.children}
		/>
	) : (
		<UIText style={props.style} className={`${textFontSize} text-purpleText font-RubikBold ${props.className}`}>
			{props.children}
		</UIText>
	);
};
