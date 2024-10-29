import { View, Image } from 'react-native';
import { UIText } from './UIText';

type Props = {
	readonly message?: string;
};

export const UILoader = (props: Props) => {
	return (
		<View
			className="fixed inset-0 z-[99999] flex h-full w-full items-center justify-center transition-opacity duration-300 ease-in-out"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
		>
			{props.message && <UIText className="font-RubikBold text-center text-2xl">{props.message}</UIText>}
			<Image source={require('@/assets/gifs/loader.gif')} className="h-[524px] w-[524px]" />
		</View>
	);
};
