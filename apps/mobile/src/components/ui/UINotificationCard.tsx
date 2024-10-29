import React from 'react';
import { View, Image, type ViewStyle } from 'react-native';
import { DateFormat } from '@leumit/common';
import { UIText } from './UIText';
import { UICubeWithArrow } from './UICubeWithArrow';

type Props = {
	readonly title: string;
	readonly date: Date;
	readonly image: string;
	readonly summary?: string;
	readonly actionLabel?: string;
	readonly showArrow: boolean;
	readonly background?: 'white' | 'gray';
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly onClick?: VoidFunction;
};

export const UINotificationCard = (props: Props) => {
	return (
		<UICubeWithArrow className={props.className} style={props.style} showArrow={props.showArrow}>
			<View className="flex flex-row items-center">
				<Image className="mr-4 h-8 w-8 rounded-full" source={{ uri: props.image }} alt="profile" />
				<View className="flex-col gap-y-3">
					<View className="text-grayPrimary flex-col">
						<UIText className="font-RubikSemiBold text-sm">{props.title}</UIText>
						<UIText className="text-grayPrimary text-sm">{`המלצה מתאריך ${DateFormat(props.date)}`}</UIText>
					</View>
				</View>
			</View>
		</UICubeWithArrow>
	);
};
