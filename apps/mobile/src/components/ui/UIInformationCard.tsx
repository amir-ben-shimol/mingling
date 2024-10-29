import React from 'react';
import { DateFormat, routes } from '@leumit/common';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { GenerateNavImage } from '@/lib/utils/generate-nav-image';
import { UIText } from './UIText';
import { UICard } from './UICard';

type Props = {
	readonly title: string;
	readonly date?: Date;
	readonly image?: string;
	readonly summary?: string;
	readonly actionLabel?: string;
	readonly showArrow?: boolean;
	readonly background?: 'white' | 'gray';
	readonly className?: string;
	readonly onClick?: () => void;
};

export const UIInformationCard = (props: Props) => {
	return (
		<UICard
			className={`${props.className} flex-row`}
			background={props.background}
			showArrow={props.showArrow}
			onClick={() => (props.onClick ? props.onClick() : '')}
		>
			<View className="relative flex-row items-center">
				<Image className="mr-2 flex h-9 w-9 rounded-full" source={GenerateNavImage(routes.medicalSummary.path)} alt="profile" />

				<View className="flex flex-col items-start">
					<UIText className="text-purplePrimary font-RubikSemiBold text-sm">{props.title}</UIText>
					{props.date && <UIText className="text-purplePrimary font-Rubik text-sm">{`המלצה מתאריך ${DateFormat(props.date)}`}</UIText>}
					{props.summary && <UIText className="text-purplePrimary font-Rubik text-sm">{props.summary}</UIText>}
				</View>
			</View>
		</UICard>
	);
};
