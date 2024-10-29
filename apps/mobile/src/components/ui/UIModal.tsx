/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-lines */
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Linking, BackHandler, type ViewStyle } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetView, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import type { icons } from '@leumit/common';
import { type ScrollEvent } from '@/lib/types/ui/scroll';
import { UISvg } from './UISvg';
import { UIButton } from './UIButton';
import { UITitle } from './UITitle';
import { UIText } from './UIText';

type Props = {
	readonly isOpen?: boolean;
	readonly href?: string;
	readonly title?: string;
	readonly modalHeaderTitle?: string;
	readonly text?: React.ReactNode | string;
	readonly buttonLabel?: string;
	readonly bottomButtonText?: string;
	readonly bottomButtonHref?: string;
	readonly imageSrc?: string;
	readonly children?: React.ReactNode;
	readonly icon?: keyof typeof icons;
	readonly svgIconClassName?: string;
	readonly size?: 'extra-small' | 'small' | 'medium' | 'large' | 'custom';
	readonly customSize?: string;
	readonly scrollable?: boolean;
	readonly className?: string;
	readonly bottomButtonClassName?: string;
	readonly style?: ViewStyle;
	readonly presist?: boolean;
	readonly onClick?: () => void;
	readonly onClose?: () => void;
	readonly bottomButtonOnClick?: () => void;
};

const ModalBody = (props: Props) => {
	return (
		<>
			{props.imageSrc && <Image source={{ uri: props.imageSrc }} className="resize-cover mb-4 h-52 w-full" />}
			{props.icon && (
				<View className="mb-4 items-center justify-center">
					<View className="bg-blueSecondery rounded-full p-4">
						<UISvg name={props.icon} className={`h-12 w-12 ${props.svgIconClassName}`} />
					</View>
				</View>
			)}
			{props.title && <UIText className="font-RubikBold my-4 text-center text-xl">{props.title}</UIText>}
			{props.text && <UIText className="mb-4 text-base">{props.text}</UIText>}
			{props.children}

			{props.href && (
				<TouchableOpacity className="mb-4 text-blue-500 underline" onPress={() => Linking.openURL(props.href ?? '')}>
					<UIText>{props.buttonLabel}</UIText>
				</TouchableOpacity>
			)}
			{props.onClick && (
				<UIButton
					className={props.bottomButtonClassName}
					label={props.buttonLabel}
					varient="gradientPinkPurple"
					buttonSize="large"
					onClick={props.onClick}
				/>
			)}
		</>
	);
};

export const UIModal = (props: Props) => {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [headerShadow, setHeaderShadow] = useState(false);

	const snapPoints = useMemo(() => {
		switch (props.size) {
			case 'extra-small': {
				return ['35%'];
			}
			case 'small': {
				return ['50%'];
			}
			case 'medium': {
				return ['60%'];
			}
			case 'large': {
				return ['80%'];
			}
			case 'custom': {
				return [props.customSize || '80%'];
			}
			default: {
				return ['75%'];
			}
		}
	}, [props.size]);

	const handlePresentModal = useCallback(() => {
		if (props.isOpen) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
		}
	}, [props.isOpen]);

	const onDismiss = () => {
		if (props.presist) return;

		bottomSheetModalRef.current?.dismiss();
		props.onClose?.();
	};

	useEffect(() => {
		handlePresentModal();

		const backHandler = () => {
			if (props.isOpen) {
				props.onClose?.();

				return true;
			}

			return false;
		};

		if (props.isOpen) {
			BackHandler.addEventListener('hardwareBackPress', backHandler);
		}

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backHandler);
		};
	}, [props.isOpen, props.onClose, handlePresentModal]);

	const CustomBackdrop: React.FC<BottomSheetBackdropProps> = ({ animatedIndex, style }) => {
		const containerAnimatedStyle = useAnimatedStyle(() => ({
			opacity: interpolate(
				animatedIndex.value,
				[-1, 0],
				[0, 0.5], // * Adjust the second value to control max opacity
				Extrapolation.CLAMP,
			),
		}));

		const containerStyle = useMemo(
			() => [
				style,
				{
					backgroundColor: '#000000',
				},
				containerAnimatedStyle,
			],
			[style, containerAnimatedStyle],
		);

		return (
			<Animated.View style={containerStyle}>
				<TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onDismiss} />
			</Animated.View>
		);
	};

	const handleScroll = (event: ScrollEvent) => {
		const offsetY = event.nativeEvent.contentOffset.y;

		setHeaderShadow(offsetY > 5);
	};

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			index={0}
			enableOverDrag={false}
			snapPoints={snapPoints}
			stackBehavior="push"
			enablePanDownToClose={!props.presist}
			handleIndicatorStyle={{ display: 'none' }}
			backdropComponent={(props) => <CustomBackdrop {...props} />}
			onDismiss={onDismiss}
		>
			<View className={`flex-row items-center justify-between px-3 pb-4 ${headerShadow ? 'shadow' : ''}`} style={{ backgroundColor: 'white' }}>
				{props.modalHeaderTitle && (
					<UITitle size="large" isGradient>
						{props.modalHeaderTitle}
					</UITitle>
				)}
				{!props.presist && (
					<TouchableOpacity className="rounded-full bg-gray-300 p-2 text-black" onPress={onDismiss}>
						<UISvg name="close" className="h-3 w-3 text-black" fill="#000000" />
					</TouchableOpacity>
				)}
			</View>
			{props.scrollable === false ? (
				<BottomSheetView className={props.className} style={[{ padding: 12 }, props.style]}>
					<ModalBody {...props} />
				</BottomSheetView>
			) : (
				<BottomSheetScrollView
					contentContainerStyle={{ display: 'flex', alignItems: 'center', paddingBottom: 32 }}
					className={props.className}
					style={props.style}
					onScroll={handleScroll}
				>
					<ModalBody {...props} />
				</BottomSheetScrollView>
			)}

			<View className="mt-2">
				{props.bottomButtonText && props.bottomButtonHref && (
					<TouchableOpacity
						className="mb-2 rounded-lg bg-blue-500 p-4 text-center text-white"
						onPress={() => Linking.openURL(props.bottomButtonHref ?? '')}
					>
						<UIText>{props.bottomButtonText}</UIText>
					</TouchableOpacity>
				)}
				{props.bottomButtonText && props.bottomButtonOnClick && (
					<TouchableOpacity className="mb-2 rounded-lg bg-blue-500 p-4 text-center text-white" onPress={props.bottomButtonOnClick}>
						<UIText>{props.bottomButtonText}</UIText>
					</TouchableOpacity>
				)}
			</View>
		</BottomSheetModal>
	);
};
