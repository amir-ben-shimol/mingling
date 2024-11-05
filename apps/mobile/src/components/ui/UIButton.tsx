/* eslint-disable max-lines */
import React from 'react';
import { TouchableOpacity, type ViewStyle, type GestureResponderEvent, View, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { icons } from '@/data/icons';
import colors from '@/styles/colors.cjs';
import globalStyles from '@/styles/global';
import { UISvg } from './UISvg';
import { UIText } from './UIText';

type Props = {
	readonly href?: string;
	readonly label: string | React.ReactNode;
	readonly fallbackLabel?: string;
	readonly className?: string;
	readonly labelClassName?: string;
	readonly noStyles?: boolean;
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
	readonly buttonSize?: 'fit-content' | 'full' | 'large';
	readonly icon?: keyof typeof icons;
	readonly iconSize?: 'small' | 'medium' | 'large';
	readonly isIconFirst?: boolean;
	readonly showArrow?: boolean;
	readonly iconClassName?: string;
	readonly style?: ViewStyle;
	readonly haptics?: 'feedback-soft' | 'notification-success' | 'notification-warning' | 'notification-error';
	readonly isLoading?: boolean;
	readonly onClick?: (e: GestureResponderEvent) => void;
};

const backgroundColors = {
	gradientGreenBlue: [`rgb(${colors.greenPrimary})`, `rgb(${colors.bluePrimary})`],
	gradientPinkPurple: [` border border-purpleText rgb(${colors.pinkPrimary})`, `rgb(${colors.purplePrimary})`],
	borderOnlyGradientPinkPurple: ['bg-rgb(255, 255, 255)', 'transparent'],
	whiteAndShadow: '',
	buttonTextRed: ['transparent', 'transparent'],
	whitePurpleBorder: ['border border-purpleText bg-white'],
	buttonTextBlack: ['transparent', 'transparent'],
	darkGray: [`rgb(${colors.grayPrimary})`, 'transparent'],
	white: [`rgb(${colors.white})`, 'transparent'],
	whiteLightBlueBorder: ['transparent', 'transparent'],
};

const textColors = {
	gradientGreenBlue: 'text-white',
	gradientPinkPurple: 'text-white',
	borderOnlyGradientPinkPurple: 'text-purplePrimary',
	whiteAndShadow: 'text-purplePrimary',
	buttonTextRed: 'text-purpleText',
	whitePurpleBorder: 'text-purpleText',
	buttonTextBlack: 'text-grayPrimary',
	darkGray: 'text-white',
	white: 'text-purpleText',
	whiteLightBlueBorder: 'text-grayPrimary',
};

const iconFillColors = {
	gradientGreenBlue: 'white',
	gradientPinkPurple: 'white',
	borderOnlyGradientPinkPurple: `rgb(${colors.purplePrimary})`,
	whiteAndShadow: `rgb(${colors.purplePrimary})`,
	buttonTextRed: `rgb(${colors.pinkPrimary})`,
	buttonTextBlack: `rgb(${colors.grayPrimary})`,
	darkGray: 'white',
	white: `rgb(${colors.purplePrimary})`,
	whitePurpleBorder: `rgb(${colors.purplePrimary})`,
	whiteLightBlueBorder: `rgb(${colors.grayPrimary})`,
};

export const UIButton = (props: Props) => {
	const {
		noStyles,
		className,
		buttonSize,
		varient,
		label,
		fallbackLabel,
		icon,
		iconSize,
		isLoading,
		onClick,
		href,
		isIconFirst = false,
		showArrow,
		iconClassName,
	} = props;

	const buttonClass = noStyles
		? className
		: `rounded-button flex flex-row items-center justify-center px-0  ${
				buttonSize === 'fit-content' ? 'py-1' : buttonSize === 'full' ? 'w-full py-1' : 'w-full h-[50px]'
			} justify-items-center text-center ${typeof backgroundColors[varient] === 'string' || (Array.isArray(backgroundColors[varient]) && backgroundColors[varient])}`;

	const labelClasses = `text-center self-center w-fit text-base font-RubikMedium ${textColors[varient]} ${
		buttonSize === 'fit-content' ? (icon ? 'pl-4 pr-1' : 'px-4') : buttonSize === 'full' ? '' : ''
	}  ${props.labelClassName}`;

	const onPressHaptics = (haptics: Props['haptics']) => {
		switch (haptics) {
			case 'feedback-soft': {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

				break;
			}
			case 'notification-success': {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

				break;
			}
			case 'notification-warning': {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

				break;
			}
			case 'notification-error': {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

				break;
			}
			default: {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

				break;
			}
		}
	};

	const handlePress = (e: GestureResponderEvent) => {
		onPressHaptics(props.haptics);

		if (href) return;

		onClick?.(e);
	};

	const renderIcon = (icon: keyof typeof icons) => (
		<UISvg
			name={icon}
			className={`${isIconFirst ? 'mr-4' : 'ml-4'} ${iconSize === 'medium' ? 'h-4 w-4' : iconSize === 'large' ? 'h-6 w-6' : 'h-2.5 w-2.5'} ${iconClassName}`}
			fill={typeof iconFillColors[varient] === 'string' ? iconFillColors[varient] : 'black'}
		/>
	);

	const renderButtonContent = () => (
		<View className="flex flex-row items-center justify-center">
			{icon && !isLoading && isIconFirst && renderIcon(icon)}
			{typeof label === 'string' ? (
				<UIText fallbackLabel={fallbackLabel} className={labelClasses}>
					{label}
				</UIText>
			) : (
				label
			)}
			{isLoading && (
				<ActivityIndicator
					size="small"
					className={`mr-4 ${iconSize === 'medium' ? '!h-4 !w-4' : iconSize === 'large' ? '!h-6 !w-6' : '!h-2.5 !w-2.5'}`}
				/>
			)}
			{icon && !isLoading && !isIconFirst && renderIcon(icon)}
			{showArrow && <UISvg name="arrow" className="mr-4 h-3 w-3" stroke="#fff" fill="#fff" strokeWidth={0.3} />}
		</View>
	);

	return (
		<TouchableOpacity className={props.buttonSize === 'fit-content' ? 'self-start' : 'self-stretch'} onPress={handlePress}>
			<View className={buttonClass} style={props.varient === 'whiteAndShadow' ? globalStyles.whiteAndShadow : null}>
				{renderButtonContent()}
			</View>
		</TouchableOpacity>
	);
};
