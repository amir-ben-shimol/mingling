import React, { useCallback, useState, useRef, useEffect, type ReactNode } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { type ScrollEvent } from '@/lib/types/ui/scroll';

type Props = {
	readonly children: ReactNode;
	readonly className?: string;
	readonly contentContainerStyle?: object;
	readonly handleScroll?: (event: ScrollEvent) => void;
	readonly refreshCallBack?: () => Promise<void>;
};

export const UIScrollView = (props: Props) => {
	const [refreshing, setRefreshing] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await props.refreshCallBack?.();
		// Simulating API call
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	useEffect(() => {
		scrollViewRef.current?.scrollTo({ y: 0, animated: true });
	}, []);

	return (
		<ScrollView
			ref={scrollViewRef}
			scrollEventThrottle={16}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={props.contentContainerStyle}
			bounces={!!props.refreshCallBack}
			className={`flex-1 bg-white ${props.className}`}
			refreshControl={props.refreshCallBack && <RefreshControl refreshing={refreshing} tintColor="#cc4d80" onRefresh={onRefresh} />}
			onScroll={props.handleScroll}
		>
			{props.children}
		</ScrollView>
	);
};
