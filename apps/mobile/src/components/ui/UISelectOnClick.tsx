import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { UISvg } from './UISvg';
import { UIText } from './UIText';

type Props = {
	readonly value: string;
	readonly options: Array<{ value: string; label: string }>;
	readonly errorMessage?: string;
	readonly placeholder?: string;
	readonly classNameWrapper?: string;
	readonly onValueChange: (value: string) => void;
	readonly hideLabel?: boolean;
};

export const UISelectOnClick: React.FC<Props> = ({ value, onValueChange, options, errorMessage, placeholder, classNameWrapper, hideLabel = false }) => {
	useEffect(() => {
		if (!value && options.length > 0) {
			onValueChange(options[0]?.value ?? '');
		}
	}, [value, options]);

	const handleLabelClick = () => {
		const currentIndex = options.findIndex((option) => option.value === value);
		const nextIndex = (currentIndex + 1) % options.length;

		if (options) {
			onValueChange(options[nextIndex]?.value ?? '');
		}
	};

	const currentLabel = options.find((option) => option.value === value)?.label;

	return (
		<View className={classNameWrapper}>
			<TouchableOpacity
				className={`${hideLabel && 'h-4'} text-md font-RubikBold h-fit w-fit self-center rounded-lg ${errorMessage ? 'border-error' : ''}`}
				onPress={handleLabelClick}
			>
				<View className={`${hideLabel ? 'h-6 w-6' : 'min-w-[100.25px]'} items-center gap-1.5`}>
					{!hideLabel && <UIText>{currentLabel || placeholder}</UIText>}

					<UISvg name="chevron" className="h-2.5 w-3" />
				</View>
			</TouchableOpacity>
			{errorMessage && <UIText className="text-error py-2">{errorMessage}</UIText>}
		</View>
	);
};
