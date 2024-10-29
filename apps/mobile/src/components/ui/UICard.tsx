import React from 'react';
import { View, Pressable, type ViewStyle } from 'react-native';
import globalStyles from '@/styles/global';
import { UIIconButton } from './UIIconButton';

type BaseProps = {
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly background?: 'white' | 'gray';
	readonly childrenClassName?: string;
	readonly children: React.ReactNode;
};

type PropsWithArrow = BaseProps & {
	readonly showArrow: true;
	readonly onClick: () => void;
};

type PropsWithoutArrow = BaseProps & {
	readonly showArrow?: false;
	readonly onClick?: () => void;
};

type Props = PropsWithArrow | PropsWithoutArrow;

export const UICard: React.FC<Props> = (props: Props) => {
	const cardContent = (
		<View
			className={`${props.background === 'white' ? 'bg-white' : 'bg-gray-100'} flex w-full flex-row rounded-lg px-4 py-6 ${props.className}`}
			style={[globalStyles.shadowBox, props.style]}
		>
			<View className={`${props.childrenClassName}`}>{props.children}</View>
			{props.showArrow && (
				<View className="ml-4 flex items-end">
					<UIIconButton varient="gradientPinkPurple" icon="arrow" size="small" svgContainerClassName="text-white" />
				</View>
			)}
		</View>
	);

	return props.showArrow ? <Pressable onPress={props.onClick}>{cardContent}</Pressable> : <View>{cardContent}</View>;
};
