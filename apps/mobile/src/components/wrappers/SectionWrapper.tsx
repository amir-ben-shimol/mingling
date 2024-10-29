import { View } from 'react-native';
import { UITitle } from '@/ui/UITitle';

type Props = {
	readonly children: React.ReactNode;
	readonly title?: string;
	readonly wrapperclassName?: string;
	readonly titleClassName?: string;
};

const SectionWrapper = (props: Props) => {
	return (
		<View className={`flex w-full items-start ${props.wrapperclassName}`}>
			{props.title && (
				<UITitle className={`mb-3 ${props.titleClassName}`} isGradient>
					{props.title}
				</UITitle>
			)}
			{props.children}
		</View>
	);
};

export default SectionWrapper;
