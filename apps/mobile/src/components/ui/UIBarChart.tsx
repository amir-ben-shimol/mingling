/* eslint-disable react/jsx-props-no-spreading */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View } from 'react-native';
import { G } from 'react-native-svg';
import { VictoryChart, VictoryBar, VictoryGroup, VictoryTheme, VictoryLabel, Rect, VictoryAxis } from 'victory-native';
import type { ChartColorVarient, DataPoint, LegendWrapperProps } from '@/lib/types/ui/bar-chart';
import { UIText } from './UIText';

type Props = {
	readonly data: DataPoint[];
} & LegendWrapperProps;

const ColorGenerator = (index: number, varient: ChartColorVarient) => {
	switch (varient) {
		case 'green': {
			return index % 2 === 0 ? '#9BC769' : '#6D8551';
		}
		case 'red': {
			return index % 2 === 0 ? '#FD506F' : '#CA4058';
		}
		case 'purple': {
			return index % 2 === 0 ? '#DD4081' : '#70417F';
		}
	}
};

const CustomLabel = (props: any) => {
	const rectWidth = Array.isArray(props.data.value) ? 10 * props.data.value.length : 25;
	const rectHeight = 18;
	const rectX = props.x - rectWidth / 2;
	const rectY = props.y - 22;

	return (
		<G>
			<Rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} fill="#F1F1F1" rx={8} ry={8} />
			<VictoryLabel {...props} x={props.x} y={rectY + rectHeight / 1.1} style={{ ...props.style, textAnchor: 'middle' }} dy={-rectHeight / 25} />
		</G>
	);
};

const Legend = ({ title, color }: { title: string; color: string }) => {
	const style = {
		backgroundColor: color,
	};

	return (
		<View className="flex flex-row items-center">
			<View className="mr-1 h-[11px] w-[27px] rounded" style={style} />
			<UIText className="text-grayPrimary mr-3 w-[106px] text-sm">{title}</UIText>
		</View>
	);
};

const LegendWrapper = (props: LegendWrapperProps) => {
	if (!props.legendsLabel) return null;

	return (
		<View className="flex flex-row justify-start">
			{props.legendsLabel.map((label, index) => (
				<Legend key={index} title={label.title} color={ColorGenerator(index, label.varient)} />
			))}
		</View>
	);
};

export const UIBarChart = (props: Props) => {
	const calculateOffset = (numBars: number) => {
		switch (numBars) {
			case 1: {
				return 0;
			}

			default: {
				return 24;
			}
		}
	};

	const renderBars = (data: DataPoint[]) => {
		return data.map((point, index) => {
			if (Array.isArray(point.value)) {
				const offset = calculateOffset(point.value.length);

				const bars = point.value.map((val, valIndex) => (
					<VictoryBar
						key={`${index}-${valIndex}`}
						data={[{ x: point.label, y: val }]}
						cornerRadius={5}
						labels={({ datum }: any) => `${datum.y}`}
						labelComponent={<CustomLabel style={{ fontSize: 14, fontWeight: '500', fill: '#4E5A63' }} />}
						style={{
							data: {
								fill: ColorGenerator(valIndex, point.varient),
								width: 17,
							},
						}}
					/>
				));

				return (
					<VictoryGroup offset={offset} key={`group-${index}`}>
						{bars}
					</VictoryGroup>
				);
			} else {
				return (
					<VictoryBar
						key={index}
						data={[{ x: point.label, y: point.value }]}
						cornerRadius={5}
						labels={({ datum }: any) => `${datum.y}`}
						labelComponent={<CustomLabel style={{ fontSize: 14, fill: '#4E5A63' }} />}
						style={{
							data: {
								fill: ColorGenerator(0, point.varient),
								width: 14,
							},
						}}
					/>
				);
			}
		});
	};

	return (
		<View className="m-0 max-w-lg">
			<View>
				<VictoryChart domainPadding={10} theme={VictoryTheme.material} width={330} height={210}>
					<VictoryAxis
						tickFormat={(label: string) => label}
						style={{
							axis: { stroke: 'transparent' },
							grid: { stroke: 'transparent' },
						}}
						tickLabelComponent={<VictoryLabel style={{ fontSize: 14, fontWeight: '400', fill: '#4E5A63' }} />}
					/>
					<VictoryAxis
						dependentAxis
						style={{
							axis: { stroke: 'transparent' },
							grid: { stroke: '#F1F1F1', strokeWidth: 0.51, fill: '', strokeDasharray: 'none' },
						}}
						tickLabelComponent={<VictoryLabel style={{ fontSize: 12, fontWeight: '400', fill: '#4E5A63' }} dx={-20} dy={0} />}
						tickCount={3}
					/>
					{renderBars(props.data)}
				</VictoryChart>
			</View>
			{!!props.legendsLabel && <LegendWrapper legendsLabel={props.legendsLabel} />}
		</View>
	);
};
