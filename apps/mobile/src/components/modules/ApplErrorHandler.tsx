import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import { UIText } from '@/ui/UIText';
import { UIModal } from '@/ui/UIModal';
import { UITitle } from '@/ui/UITitle';

type ErrorMessage = {
	readonly title: string;
	readonly description?: string;
};

const AppErrorHandler = () => {
	const [hasError, setHasError] = useState(false);
	const [errorMessages, setErrorMessages] = useState<ErrorMessage | null>(null);

	useEffect(() => {
		// Subscribe to network changes
		const unsubscribe = NetInfo.addEventListener((state) => {
			handleNetworkChange(state.isConnected);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const handleNetworkChange = (isConnected: boolean | null) => {
		if (!isConnected) {
			setHasError(true);
			setErrorMessages({
				title: 'אין חיבור לאינטרנט',
				description: 'אנא בדוק את החיבור לאינטרנט שלך ונסה שנית',
			});
		} else {
			setHasError(false);
			setErrorMessages(null);
		}
	};

	const onCloseErrorModal = () => setHasError(false);

	if (!hasError) {
		return null;
	}

	return (
		<UIModal isVisible={hasError} scrollable={false} presist size="custom" customSize="93%" onClose={onCloseErrorModal}>
			<View className="flex h-[96%] w-full items-center justify-center px-3">
				{errorMessages?.title && <UITitle isGradient>{errorMessages.title}</UITitle>}
				{errorMessages?.description && (
					<UIText className="text-grayPrimary mb-10 mt-3 px-10 text-center text-[20px]">{errorMessages.description}</UIText>
				)}
			</View>
		</UIModal>
	);
};

export default AppErrorHandler;
