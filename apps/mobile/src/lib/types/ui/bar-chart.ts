export type DataPoint = {
	readonly label: string;
	readonly value: (number | undefined)[];
	readonly varient: ChartColorVarient;
};

export type ChartColorVarient = 'green' | 'red' | 'purple';

export type Legend = {
	readonly title: string;
	readonly varient: ChartColorVarient;
};

export type LegendWrapperProps = {
	readonly legendsLabel?: { title: string; varient: ChartColorVarient }[];
};
