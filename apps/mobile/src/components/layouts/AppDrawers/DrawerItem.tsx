import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { UIText } from '@/ui/UIText';

type Props = {
	readonly isActive: boolean;
	readonly label: string;
	readonly path: string;
};

export const DrawerItem = (props: Props) => {
	const onNavigateToRoute = () => router.navigate(props.path);

	return (
		<TouchableOpacity
			className={`flex items-start border-b-[0.5px] border-[#DFD5E1] px-3 py-4 ${props.isActive ? 'bg-[#DFD5E1]' : ''}`}
			onPress={onNavigateToRoute}
		>
			<UIText className="text-grayPrimary text-base">{props.label}</UIText>
		</TouchableOpacity>
	);
};
