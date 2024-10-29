/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { DateFormat } from '@leumit/common';
import type { Recommendation } from '@leumit/types';
import { useTranslation } from 'react-i18next';
import { UICard } from './UICard';
import { UIButton } from './UIButton';
import { UICollapse } from './UICollapse';
import { UIText } from './UIText';

type ActionsButtonsType = {
	readonly canBookAppointment: boolean;
	readonly canMarkToDelete: boolean;
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly bookAppointmentHandler?: () => Promise<void>;
	readonly removeRecommendationHandler?: () => Promise<void>;
};

type Props = {
	readonly background?: 'white' | 'gray';
	readonly className?: string;
	readonly collapseOnly?: boolean;
	readonly imageUrl?: string;
	readonly style?: ViewStyle;
} & Recommendation &
	ActionsButtonsType;

const ActionsButtons = (props: ActionsButtonsType) => {
	const { t } = useTranslation();

	return (
		<View className={`${props.className} flex flex-row items-center`} style={props.style}>
			{props.canBookAppointment && (
				<UIButton
					label={t('MedicalFile.Appointment')}
					varient="whiteAndShadow"
					buttonSize="fit-content"
					onClick={(e) => {
						e.stopPropagation();
						props.bookAppointmentHandler && props.bookAppointmentHandler();
					}}
				/>
			)}
			{props.canMarkToDelete && (
				<UIButton
					label={t('MedicalFile.RemoveRecommendation')}
					varient="buttonTextBlack"
					buttonSize="fit-content"
					onClick={(e) => {
						e.stopPropagation();
						props.removeRecommendationHandler && props.removeRecommendationHandler();
					}}
				/>
			)}
		</View>
	);
};

export const UIRecommendationCard = (props: Props) => {
	return (
		<UICard className={props.className} style={props.style} background={props.background}>
			<View className="flex w-full flex-row items-start justify-between">
				{props.imageUrl ? (
					<Image className="h-10 w-10 rounded-full" source={{ uri: props.imageUrl }} />
				) : (
					<Image className="h-8 w-8 rounded-full" source="no-content-hasida" />
				)}
				<View className="flex w-4/5 flex-col items-start">
					<View className="flex items-start">
						<UIText className={`font-RubikSemiBold text-sm ${!props.canMarkToDelete && 'max-w-[80%]'}`}>{props.title}</UIText>
						<UIText className={`text-grayPrimary text-sm ${!props.canMarkToDelete && 'max-w-[80%]'}`}>
							{`המלצה מתאריך ${DateFormat(props.suggestionDate)}`}
						</UIText>
					</View>

					{props.suggestionDescription && (
						<UICollapse
							className="flex w-full justify-between"
							title={
								<ActionsButtons
									className="-mt-1.5"
									canBookAppointment={props.canBookAppointment}
									canMarkToDelete={props.canMarkToDelete}
									bookAppointmentHandler={props.bookAppointmentHandler}
									removeRecommendationHandler={props.removeRecommendationHandler}
								/>
							}
						>
							<UIText className="text-grayPrimary text-sm">{props.suggestionDescription}</UIText>
						</UICollapse>
					)}
				</View>
			</View>
		</UICard>
	);
};
