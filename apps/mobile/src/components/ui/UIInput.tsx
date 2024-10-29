import React, { useRef } from 'react';
import { View, TextInput, type NativeSyntheticEvent, type TextInputFocusEventData } from 'react-native';
import { UIText } from './UIText';

type InputType = 'text' | 'number' | 'email' | 'tel' | 'password' | 'phoneNumber' | 'id' | 'otp';

type Props = {
	readonly inputType: InputType;
	readonly value?: string;
	readonly errorMessage?: string;
	readonly placeholder: string;
	readonly classNameInput?: string;
	readonly wrapperClassName?: string;
	readonly autoFocus?: boolean;
	readonly fallbackPlaceholder?: string;
	readonly label?: string;
	readonly onValueChange: (value: string) => void;
	readonly onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	readonly onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
};

const inputTypeMap: { [key in InputType]: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'number-pad' } = {
	text: 'default',
	number: 'numeric',
	email: 'email-address',
	tel: 'phone-pad',
	password: 'default',
	phoneNumber: 'phone-pad',
	id: 'phone-pad',
	otp: 'phone-pad',
};

export const UIInput = (props: Props) => {
	const inputRef = useRef<TextInput>(null);

	const handleChange = (newValue: string) => {
		if (
			props.inputType === 'number' ||
			props.inputType === 'tel' ||
			props.inputType === 'phoneNumber' ||
			props.inputType === 'id' ||
			props.inputType === 'otp'
		) {
			newValue = newValue.replace(/[^0-9]/g, '');
		}

		props.onValueChange(newValue);
	};

	const keyboardType = inputTypeMap[props.inputType];

	const maxLength = props.inputType === 'phoneNumber' ? 10 : props.inputType === 'id' ? 9 : props.inputType === 'otp' ? 5 : undefined;

	return (
		<View className={`${props.wrapperClassName} relative`}>
			<UIText
				className={`text-grayPrimary absolute -top-4 justify-items-start text-xs transition-all duration-300 ${
					props.value?.length ?? -1 > 0 ? 'mb-0' : 'mb-[-20px] opacity-0'
				}`}
				fallbackLabel={props.fallbackPlaceholder}
			>
				{props.label ?? props.placeholder}
			</UIText>

			<TextInput
				ref={inputRef}
				keyboardType={keyboardType}
				value={props.value}
				placeholderTextColor="#939393"
				placeholder={props.placeholder === 'undefined' ? props.fallbackPlaceholder : props.placeholder}
				maxLength={maxLength}
				className={`text-grayPrimary border-blueSecondery h-[50px] rounded-lg border p-3 text-right ${props.errorMessage ? 'border-error' : ''} ${
					props.classNameInput ?? ''
				}`}
				autoFocus={props.autoFocus}
				returnKeyType="done"
				returnKeyLabel="סיום"
				onSubmitEditing={() => inputRef.current?.blur()}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
				onChangeText={handleChange}
			/>
			{props.errorMessage && <UIText className="text-error absolute -bottom-4 left-0">{props.errorMessage}</UIText>}
		</View>
	);
};
