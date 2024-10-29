/* eslint-disable import/exports-last */
import React, { type ReactNode, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { icons } from '@/data/icons';

import colors from '@/styles/colors.cjs';
import { UISvg } from './UISvg';
import UITextGradient from './UITextGradient';
import { UIText } from './UIText';

export type TabProps = {
	readonly name: string | ReactNode;
	readonly content?: React.ReactNode;
	readonly icon?: keyof typeof icons;
	readonly iconClassName?: string;
	readonly label?: string;
	readonly onClick?: VoidFunction;
};

type Props = {
	readonly tabs: TabProps[];
	readonly variant: 'white' | 'gradientRedPurple' | 'gradientGreenBlue' | 'dark' | 'blue';
	readonly tabsWidth?: 'small' | 'medium' | 'large';
	readonly className?: string;
	readonly tabsContainerClassName?: string;
	readonly getActiveTab?: (activeTab: number) => void;
	readonly selectedTab?: number;
};

export const UITabs: React.FC<Props> = ({ tabs, variant, className, tabsWidth, selectedTab, getActiveTab, tabsContainerClassName }) => {
	const [activeTab, setActiveTab] = useState(selectedTab ? selectedTab : 0);

	useEffect(() => {
		if (getActiveTab) getActiveTab(activeTab);
	}, [activeTab]);

	return (
		<View className={`tabs-container ${className}`}>
			<View
				className={`border-grayPrimary mb-6 flex flex-row justify-between ${
					tabsWidth === 'small' ? 'w-1/2' : tabsWidth === 'medium' ? 'w-3/4' : tabsWidth === 'large' ? 'w-4/5' : 'w-full'
				} ${tabsContainerClassName}`}
			>
				{tabs.map((tab, index) => (
					<View
						className={`flex-grow ${activeTab === index ? `border-${variant} border-bluePrimary border-b-2` : 'border-grayPrimary/40 border-b'}`}
						key={index}
					>
						<TouchableOpacity
							className={`font-RubikMedium flex w-full items-center px-4 py-2 text-center text-sm ${
								activeTab === index ? `text-${variant}` : 'text-gray-500'
							}`}
							onPress={() => {
								setActiveTab(index);
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

								tab.onClick?.();
							}}
						>
							{tab.icon && <UISvg name={tab.icon} className={`fill-bluePrimary mb-4 h-6 w-6 ${tab.iconClassName}`} />}
							{activeTab === index ? (
								<UITextGradient
									colors={[`rgb(${colors.greenPrimary})`, `rgb(${colors.bluePrimary})`]}
									text={tab.name}
									className="font-RubikMedium text-center"
								/>
							) : (
								<UIText className="text-grayPrimary/40 text-center">{tab.name}</UIText>
							)}
						</TouchableOpacity>
					</View>
				))}
			</View>

			<View>{tabs[activeTab]?.content}</View>
		</View>
	);
};
