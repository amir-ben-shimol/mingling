import React from 'react';
import { ActivityIndicator, type ViewStyle } from 'react-native';

type Props = {
	readonly className?: string;
	readonly color?: string;
	readonly style?: ViewStyle;
	readonly size?: number | 'small' | 'large';
};

export const UISpinner = (props: Props) => {
	return <ActivityIndicator color={props.color} size={props.size} style={props.style} />;
};
