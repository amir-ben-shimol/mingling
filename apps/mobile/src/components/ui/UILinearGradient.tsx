import React from 'react';
import type { ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/styles/colors.cjs';

type Props = {
	readonly varient:
		| 'gradientGreenBlue'
		| 'gradientPinkPurple'
		| 'gradientRedPurple'
		| 'borderOnlyGradientPinkPurple'
		| 'whiteAndShadow'
		| 'whiteLightBlueBorder'
		| 'whitePurpleBorder'
		| 'buttonTextRed'
		| 'white'
		| 'buttonTextBlack'
		| 'darkGray';
	readonly children?: React.ReactNode;
	readonly className?: string;
	readonly style?: ViewProps['style'];
	readonly start?: { x: number; y: number };
	readonly end?: { x: number; y: number };
};

const backgroundColors = {
	gradientGreenBlue: [`rgb(${colors.greenPrimary})`, `rgb(${colors.bluePrimary})`],
	gradientPinkPurple: [`rgb(${colors.pinkPrimary})`, `rgb(${colors.purplePrimary})`],
	gradientPurplePink: [`rgb(${colors.purpleSecondary})`, `rgb(${colors.pinkSecondary})`],
	gradientRedPurple: [`rgb(${colors.pinkPrimary})`, `rgb(${colors.purplePrimary})`],
	borderOnlyGradientPinkPurple: ['rgb(255, 255, 255)', 'transparent'],
	whiteAndShadow: ['rgb(255, 255, 255)'],
	buttonTextRed: ['transparent', 'transparent'],
	whitePurpleBorder: ['transparent', 'transparent'],
	buttonTextBlack: ['transparent', 'transparent'],
	darkGray: [`rgb(${colors.grayPrimary})`, 'transparent'],
	white: [`rgb(${colors.white})`, 'transparent'],
	whiteLightBlueBorder: ['transparent', 'transparent'],
};

export const UILinearGradient: React.FC<Props> = ({ varient, children, style, className, start, end }) => {
	const gradientColors = backgroundColors[varient];

	return (
		<LinearGradient className={className} colors={gradientColors} style={style} start={start} end={end}>
			{children}
		</LinearGradient>
	);
};
