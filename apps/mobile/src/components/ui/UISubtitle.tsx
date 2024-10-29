import type { ViewStyle } from 'react-native';
import { UIText } from './UIText';

type Props = {
	readonly children: string | React.ReactNode;
	readonly className?: string;
	readonly style?: ViewStyle;
};

export const UISubtitle = (props: Props) => {
	return (
		<UIText className={`text-grayPrimary ${props.className}`} style={props.style}>
			{props.children}
		</UIText>
	);
};
