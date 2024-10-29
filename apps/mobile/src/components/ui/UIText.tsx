/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Text, type TextProps } from 'react-native';

type Props = TextProps & {
	readonly fallbackLabel?: string;
};

export const UIText = (props: Props) => {
	const textLabel = props.children === 'undefined' ? props.fallbackLabel : props.children;

	return (
		<Text {...props} className={`text-grayPrimary font-Rubik ${props.className}`} style={[{ textAlign: 'left' }, props.style]}>
			{textLabel}
		</Text>
	);
};
