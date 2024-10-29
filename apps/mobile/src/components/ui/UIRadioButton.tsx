/* eslint-disable import/exports-last */
import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { UIText } from '@/ui/UIText';
import { UILinearGradient } from './UILinearGradient';

export type IRadioOption = {
	readonly value: string;
	readonly label: string;
	readonly isActive?: boolean; // Optional property to set this option as active by default
};

type Props = {
	readonly title: string; // A title for the radio button group
	readonly options: Array<IRadioOption>; // An array of options, each with a value and label
	readonly selectedValue: string; // The currently selected value
	readonly defaultActive?: boolean; // Optional prop to set the first radio button active by default
	readonly wrapperClassName?: string; // Optional class name for the wrapper element
	readonly onValueChange: (value: string) => void; // A function to handle changes in selection
};

export const UIRadioButton = ({ title, options, selectedValue, wrapperClassName, onValueChange }: Props) => {
	useEffect(() => {
		// Set the active option as selected by default if no value is selected
		const activeOption = options.find((option) => option.isActive);

		if (!selectedValue && activeOption) {
			onValueChange(activeOption.value);
		}
	}, [selectedValue, options]);

	return (
		<View className={`flex flex-row items-center ${wrapperClassName} w-full justify-between`}>
			<UIText className="text-grayPrimary text-base">{title}</UIText>
			{options.map((option, index) => (
				<TouchableOpacity
					key={index}
					className="flex flex-row items-center justify-start"
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

						onValueChange(option.value);
					}}
				>
					<View className="border-bluePrimary h-5 w-5 rounded-full border-2 p-0.5">
						<UILinearGradient
							varient={selectedValue === option.value ? 'gradientGreenBlue' : 'whiteLightBlueBorder'}
							className="h-full w-full rounded-full"
						/>
					</View>
					<UIText className="text-grayPrimary ml-[6px] text-base">{option.label}</UIText>
				</TouchableOpacity>
			))}
		</View>
	);
};
