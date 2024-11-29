import MaskedView from '@react-native-masked-view/masked-view';
import React, { type ReactNode } from 'react';
import { type TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UIText } from './UIText';

type Props = {
	readonly text: string | ReactNode;
	readonly colors: [string, string, ...string[]];
	readonly className?: string;
	readonly style?: TextStyle;
	readonly start?: { x: number; y: number };
	readonly end?: { x: number; y: number };
	readonly locations?: [number, number, ...number[]];
};

const UITextGradient: React.FC<Props> = ({ text, colors, className, style = {}, start = { x: 0, y: 0 }, end = { x: 1, y: 1 }, locations = [0, 1] }) => {
	return (
		<MaskedView maskElement={<UIText style={[style, { backgroundColor: 'transparent' }]}>{text}</UIText>}>
			<LinearGradient colors={colors} start={start} end={end} locations={locations}>
				<UIText style={[style, { opacity: 0 }]} className={className}>
					{text}
				</UIText>
			</LinearGradient>
		</MaskedView>
	);
};

export default UITextGradient;
