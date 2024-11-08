import { View } from 'react-native';
import { router } from 'expo-router';
import { UIButton } from '@/ui/UIButton';
import { UIText } from '@/ui/UIText';
import { UITitle } from '@/ui/UITitle';

const NotFoundScreen = () => {
	const onNavBackToHome = () => router.navigate('/');

	return (
		<View className="flex h-full w-full items-center justify-center px-3 py-20">
			<UITitle isGradient>אופס! נחתנו במקום הלא נכון</UITitle>
			<UIText className="text-grayPrimary mb-10 mt-3 px-10 text-center text-[20px]">היעד אליו ניסית להגיע אינו קיים. שנמריא חזרה לעמוד הראשי?</UIText>

			<UIButton label="חזרה לעמוד הראשי" varient="gradientPinkPurple" buttonSize="large" onClick={onNavBackToHome} />
		</View>
	);
};

export default NotFoundScreen;
