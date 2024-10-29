import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';

type Props<T> = {
	readonly fetchData: (page: number) => Promise<T[]>;
	readonly renderItem: ({ item }: { item: T }) => React.JSX.Element;
	readonly keyExtractor: (item: T) => string;
};

export const UIInfiniteScroll = <T extends { id: number }>({ fetchData, renderItem, keyExtractor }: Props<T>) => {
	const [data, setData] = useState<T[]>([]);
	const [page, setPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		loadMoreData();
	}, []);

	const loadMoreData = async () => {
		if (loading) return;

		setLoading(true);

		try {
			const newData = await fetchData(page);

			setData((prevData) => {
				const uniqueNewData = newData.filter((newItem) => !prevData.some((prevItem) => prevItem.id === newItem.id));

				return [...prevData, ...uniqueNewData];
			});

			setPage((prevPage) => prevPage + 1);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const renderFooter = () => {
		if (!loading) return null;

		return (
			<View className="p-4">
				<ActivityIndicator size="large" color="#cc4d80" />
			</View>
		);
	};

	return (
		<FlatList
			data={data}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			ListFooterComponent={renderFooter}
			onEndReachedThreshold={0.5}
			onEndReached={loadMoreData}
		/>
	);
};
