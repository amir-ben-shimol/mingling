import React from 'react';
import Checkbox from 'expo-checkbox';
import type { ViewStyle } from 'react-native';

type Props = {
	readonly className?: string;
	readonly value: boolean;
	readonly onValueChange: (value: boolean) => void;
	readonly style?: ViewStyle;
};

export const UICheckbox = (props: Props) => {
	return <Checkbox className={props.className} style={props.style} value={props.value} onValueChange={props.onValueChange} />;
};
