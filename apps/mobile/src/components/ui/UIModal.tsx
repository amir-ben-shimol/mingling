/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, BackHandler, type ViewStyle, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetView, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { UISvg } from './UISvg';
import { UITitle } from './UITitle';

type Props = {
	readonly isVisible?: boolean;
	readonly title?: string;
	readonly children?: React.ReactNode;
	readonly size?: 'extra-small' | 'small' | 'medium' | 'large' | 'custom';
	readonly customSize?: string;
	readonly scrollable?: boolean;
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly presist?: boolean;
	readonly onClick?: () => void;
	readonly onClose?: () => void;
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
		if (props.isVisible) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
		}
	}, [props.isVisible]);

	const onDismiss = () => {
		if (props.presist) return;

		bottomSheetModalRef.current?.dismiss();
		props.onClose?.();
	};

	useEffect(() => {
		handlePresentModal();

		const backHandler = () => {
			if (props.isVisible) {
				props.onClose?.();

				return true;
			}

			return false;
		};

		if (props.isVisible) {
			BackHandler.addEventListener('hardwareBackPress', backHandler);
		}

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backHandler);
		};
	}, [props.isVisible, props.onClose, handlePresentModal]);

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

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
				{props.title && (
					<UITitle size="large" isGradient>
						{props.title}
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
					{props.children}
				</BottomSheetView>
			) : (
				<BottomSheetScrollView
					contentContainerStyle={{ display: 'flex', alignItems: 'center', paddingBottom: 32 }}
					className={props.className}
					style={props.style}
					onScroll={handleScroll}
				>
					{props.children}
				</BottomSheetScrollView>
			)}
		</BottomSheetModal>
	);
};
