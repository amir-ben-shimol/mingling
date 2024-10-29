/* eslint-disable react/jsx-wrap-multilines */
import React, { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { IS_IOS } from '@/lib/helpers/devices';
import { UISvg } from './UISvg';
import { UILinearGradient } from './UILinearGradient';

type UISliderProps = {
	readonly className?: string;
	readonly elementsPerSlide?: number;
	readonly children: React.ReactNode;
};

export const UISlider = React.memo(({ children, className, elementsPerSlide = 1 }: UISliderProps) => {
	const swiperRef = useRef<Swiper>(null);

	const slides: React.ReactNode[] = [];
	const childrenArray = React.Children.toArray(children);

	for (let i = 0; i < childrenArray.length; i += elementsPerSlide) {
		slides.push(
			<View key={i} className="flex flex-row-reverse flex-wrap items-center justify-center">
				{childrenArray.slice(i, i + elementsPerSlide).map((child, index) => (
					<View key={index} className={`w-${Math.floor(100 / elementsPerSlide)}/100 p-2`}>
						{child}
					</View>
				))}
			</View>,
		);
	}

	const handlePrev = () => {
		swiperRef.current?.scrollBy(-1);
	};

	const handleNext = () => {
		swiperRef.current?.scrollBy(1);
	};

	return (
		<View className={`min-h-[280px] w-full ${className}`} style={{ direction: 'ltr' }}>
			<Swiper
				ref={swiperRef}
				loop={false}
				showsButtons
				buttonWrapperStyle={{
					justifyContent: 'space-between',
					marginTop: -25,
					paddingHorizontal: -20,
					flexDirection: IS_IOS ? 'row' : 'row-reverse',
				}}
				nextButton={
					<TouchableOpacity onPress={handleNext}>
						<UILinearGradient varient="gradientPinkPurple" className="rounded-full bg-gray-300 p-2">
							<UISvg name="arrow" className="fill-purpleText h-3 w-3 rotate-[180deg]" fill="white" />
						</UILinearGradient>
					</TouchableOpacity>
				}
				prevButton={
					<TouchableOpacity onPress={handlePrev}>
						<UILinearGradient varient="gradientPinkPurple" className="rounded-full bg-gray-300 p-2">
							<UISvg name="arrow" className="fill-purpleText h-3 w-3" fill="white" />
						</UILinearGradient>
					</TouchableOpacity>
				}
				showsPagination
				horizontal
				autoplayDirection={false}
				className="flex-row-reverse"
				index={childrenArray.length}
				scrollEnabled
				paginationStyle={{ bottom: 15, flexDirection: IS_IOS ? 'row' : 'row-reverse' }}
				dotStyle={{ backgroundColor: '#2E567A', opacity: 0.3, width: 8, height: 8, borderRadius: 4 }}
				activeDotStyle={{ backgroundColor: '#2E567A', width: 8, height: 8, borderRadius: 4 }}
				onIndexChanged={(index) => console.log(`Slide changed to ${index}`)}
			>
				{slides}
			</Swiper>
		</View>
	);
});
