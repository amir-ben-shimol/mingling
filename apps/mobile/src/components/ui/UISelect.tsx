import React, { useEffect } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { UISvg } from './UISvg';
import { UIText } from './UIText';

type Props = {
	readonly value: string;
	readonly options: Array<{ value: string; label: string }>;
	readonly errorMessage?: string;
	readonly placeholder?: string;
	readonly classNameWrapperDiv?: string;
	readonly onValueChange: (value: string) => void;
};

export const UISelect: React.FC<Props> = ({ value, onValueChange, options, errorMessage, placeholder, classNameWrapperDiv }) => {
	useEffect(() => {
		if (!value && options.length > 0) {
			onValueChange(options[0]?.value ?? '');
		}
	}, [value, options]);

	const handleChange = (itemValue: string) => {
		onValueChange(itemValue);
	};

	return (
		<View className={`w-min px-2 ${classNameWrapperDiv}`}>
			<RNPickerSelect
				Icon={() => {
					return <UISvg name="arrowDown" className="my-auto h-[54px] w-4" />;
				}}
				items={options.map((option) => ({
					label: option.label,
					value: option.value,
				}))}
				value={value}
				placeholder={{ label: placeholder || 'Select an option', value: '' }}
				style={{
					inputIOS: {
						height: 50,
						width: '100%',
						padding: 20,
						fontWeight: 'bold',
						alignSelf: 'center',
						borderRadius: 8,
						fontSize: 16,
						borderColor: 'transparent',
						borderWidth: 1,
					},
					inputAndroid: {
						height: 50,
						width: '100%',
						padding: 20,
						fontWeight: 'bold',
						alignSelf: 'center',
						borderRadius: 8,
						fontSize: 16,
						borderColor: 'transparent',
						borderWidth: 1,
					},
				}}
				onValueChange={handleChange}
			/>

			{errorMessage && <UIText className="py-2 text-red-500">{errorMessage}</UIText>}
		</View>
	);
};
