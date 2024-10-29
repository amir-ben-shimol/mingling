/* eslint-disable max-lines */
/* eslint-disable import/exports-last */
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { UIText } from './UIText';
import { UIModal } from './UIModal';
import { UIButton } from './UIButton';
import { UISvg } from './UISvg';

export type FilterModalOption = {
	readonly label: string;
	readonly chosen: boolean;
};

export type FiltersModalOptions = {
	readonly title?: string;
	readonly options: FilterModalOption[];
};

export type FilterModalSelectedOptions = {
	readonly label: string;
	readonly selectedOptions: FilterModalOption[];
};

type UIFilterTags = {
	readonly filters: FiltersModalOptions[];
	readonly onApplyFilters: (filters: FiltersModalOptions[]) => void;
};

type UIFilterModalProps = {
	readonly modalHeaderTitle: string;
	readonly filters: FiltersModalOptions[];
	readonly filterCount: number;
	readonly onApplyFilters: (filters: FiltersModalOptions[]) => void;
};

const onFormatSpacialChars = (input: string) => input.replace(/&quot;/g, '"');

const onToggleFilterOption = (filters: FiltersModalOptions[], parentTitle: string, optionsLabel: string) => {
	const filterElement = filters.find((filterElement) => filterElement.title === parentTitle);

	if (!filterElement) return;

	const optionElement = filterElement.options.find((optionElement) => optionElement.label === optionsLabel);

	if (!optionElement) return;

	const newOptionElement = { ...optionElement, chosen: !optionElement.chosen } as FilterModalOption;

	const newFilters = filters.map((filterElement) => {
		if (filterElement.title === parentTitle) {
			return { ...filterElement, options: [...filterElement.options.map((option) => (option.label === optionsLabel ? newOptionElement : option))] };
		} else {
			return filterElement;
		}
	});

	return newFilters;
};

const getFilterModalSelectedOptions = (filters: FiltersModalOptions[]): FilterModalOption[] => {
	const selectedOptions: FilterModalOption[] = [];

	filters.forEach((filterElement) => {
		filterElement.options.forEach((optionElement) => {
			if (optionElement.chosen) selectedOptions.push(optionElement);
		});
	});

	return selectedOptions;
};

const UIFilterModal = React.memo((props: UIFilterModalProps) => {
	const [isFilterModalOpen, setIsFIlterModalOpen] = useState(false);
	const [filterState, setFilterState] = useState<FiltersModalOptions[]>([]);

	useEffect(() => {
		setFilterState(props.filters);
	}, [props.filters]);

	const onOpenFilterModal = () => setIsFIlterModalOpen(true);

	const onCloseFilterModal = () => {
		setIsFIlterModalOpen(false);
		setFilterState(props.filters);
	};

	const onLocalToggleFilterOption = (parentTitle: string, optionsLabel: string) => {
		const newFilters = onToggleFilterOption(filterState, parentTitle, optionsLabel);

		if (!newFilters) return;

		setFilterState(newFilters);
	};

	const onApplyFiltersHandler = () => {
		if (!filterState.length) return;

		setIsFIlterModalOpen(false);
		props.onApplyFilters?.(filterState);
	};

	const isShowButton = () => {
		let isShow: boolean = false;

		if (!props.filters || props.filters.length === 0) return false;
		else {
			props.filters.map((flt) => {
				if (flt.options.length > 1) isShow = true;
			});
		}

		return isShow;
	};

	return (
		<>
			{isShowButton() && (
				<UIButton
					noStyles
					className="border-blueSecondery mb-4 w-[100px] flex-row items-center justify-center rounded-[38px] border px-[10px] py-1"
					label={`סינון ${props.filterCount > 0 ? `(${props.filterCount})` : ''}`}
					labelClassName="text-grayPrimary text-sm"
					isIconFirst
					icon="filter"
					iconClassName="w-[23px] h-[23px] mr-1"
					iconSize="medium"
					varient="whiteLightBlueBorder"
					onClick={() => onOpenFilterModal()}
				/>
			)}
			<UIModal scrollable size="small" isOpen={isFilterModalOpen} modalHeaderTitle={props.modalHeaderTitle} onClose={onCloseFilterModal}>
				<View className="h-[90%] items-center justify-between">
					{filterState.map((filterElement, index) => {
						if (!filterElement.title) return;

						return (
							<View key={index}>
								<UIText className="text-grayPrimary pb-2 text-left font-bold">{`${filterElement.title}:`}</UIText>
								<View className="mt-4 flex flex-row flex-wrap">
									{filterElement.options.map((option, index) => {
										const isActive = option.chosen;

										return (
											<UIButton
												noStyles
												key={index}
												varient={isActive ? 'gradientGreenBlue' : 'whiteLightBlueBorder'}
												label={onFormatSpacialChars(option.label)}
												buttonSize="fit-content"
												className="border-blueSecondery mb-4 mr-2 items-center justify-center rounded-[38px] border py-1"
												onClick={() => onLocalToggleFilterOption(filterElement.title!, option.label)}
											/>
										);
									})}
								</View>
							</View>
						);
					})}

					<UIButton
						varient="gradientPinkPurple"
						label={`סינון ${getFilterModalSelectedOptions(filterState).length > 0 ? ` (${getFilterModalSelectedOptions(filterState).length})` : ''} `}
						className="mb-2"
						onClick={onApplyFiltersHandler}
					/>
				</View>
			</UIModal>
		</>
	);
});

const UIFilterTags = (props: UIFilterTags) => {
	if (!props.filters || props.filters.length === 0) return null;

	const onLocalToggleFilterOption = (parentTitle: string, optionsLabel: string) => {
		const newFilters = onToggleFilterOption(props.filters, parentTitle, optionsLabel);

		if (!newFilters) return;

		props.onApplyFilters(newFilters);
	};

	const renderItem = ({ item }: { item: FiltersModalOptions }) => {
		const chosenOptions = item.options.filter((option) => option.chosen);

		if (chosenOptions.length === 0) return null;

		return (
			<View className="mb-4 flex flex-row">
				{chosenOptions.map((option, index) => (
					<View key={`${item.title}-${index}`} className="bg-blueSecondery mr-4 flex flex-row items-center justify-center rounded-md px-[6px] py-1.5">
						<UIText className="text-grayPrimary mr-[7px] text-sm">{onFormatSpacialChars(option.label)}</UIText>
						<UISvg name="close" className="h-2.5 w-2.5" onClick={() => onLocalToggleFilterOption(item.title!, option.label)} />
					</View>
				))}
			</View>
		);
	};

	return <FlatList horizontal data={props.filters} renderItem={renderItem} />;
};

export { UIFilterModal, UIFilterTags, getFilterModalSelectedOptions };
