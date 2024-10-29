import { UIText } from './UIText';

type Props = {
	readonly children: string;
	readonly className?: string;
};

export const UISectionTitle = (props: Props) => {
	return <UIText className={`text-grayPrimary font-RubikMedium mb-4 ${props.className}`}>{props.children}</UIText>;
};
