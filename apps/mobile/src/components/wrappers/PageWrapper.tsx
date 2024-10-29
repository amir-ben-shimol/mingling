import { useNavigation } from 'expo-router';
import { Pressable, View } from 'react-native';
import { UIText } from '@/ui/UIText';
import { useNavBack } from '@/lib/hooks/useNavBack';

type Props = {
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly navBack?: boolean;
};

const PageWrapper = (props: Props) => {
	const router = useNavigation();
	const { triggerNavBack } = useNavBack();

	const onNavigateBack = () => {
		router.goBack();
		triggerNavBack();
	};

	return (
		<View className={`${props.className} w-full`}>
			{props.navBack && (
				<Pressable className="mb-5 flex w-fit cursor-pointer items-center gap-2" onPress={onNavigateBack}>
					{/* <UIIconButton icon="arrow" size="medium" svgContainerClassName="text-white rotate-180" /> */}
					<UIText className="gradient-text-pink-purple">חזרה</UIText>
				</Pressable>
			)}

			{props.children}
		</View>
	);
};

export default PageWrapper;
