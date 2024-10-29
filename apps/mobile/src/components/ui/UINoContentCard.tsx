import { Image } from 'expo-image';

import { UICard } from '@/ui/UICard';
import { UIText } from './UIText';

type Props = {
	readonly label: string;
};

export const UINoContentCard = (props: Props) => {
	return (
		<UICard className="flex h-[137px] w-full flex-row items-center justify-start" childrenClassName="w-full" background="white">
			<UIText className="text-grayPrimary font-RubikBold w-4/5 text-left">{props.label}</UIText>
			<Image className="absolute -right-10 -top-[75px] h-[160px] w-[109px]" source="no-content-hasida" alt="No content" />
		</UICard>
	);
};
