import React, { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { LoaderProvider } from '@/providers/loaderProvider';
import ErrorBoundary from '@/wrappers/ErrorBoundary';
import { cacheImages } from '@/lib/helpers/cache';

import AppWrapper from '@/wrappers/AppWrapper';
import { AuthProvider } from '@/lib/providers/authProvider';
import UIAnimatedSplashScreen from '@/ui/UIAnimatedSplashScreen';

// Keep the splash screen visible until we're ready to hide it
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const [appIsReady, setAppIsReady] = useState(false);

	const loadResources = async () => {
		const imageAssets = cacheImages([require('@/assets/gifs/loader.gif')]);

		await Promise.all([...imageAssets]);
	};

	useEffect(() => {
		const prepare = async () => {
			try {
				await loadResources();
				setAppIsReady(true);
			} catch (error) {
				console.warn(error);
			}
		};

		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

	return (
		<ErrorBoundary>
			<LoaderProvider>
				<AuthProvider>
					<UIAnimatedSplashScreen
						translucent
						isLoaded={appIsReady}
						logoImage={require('../assets/images/global/app_logo.png')}
						backgroundColor="#1f2937"
						logoHeight={250}
						logoWidth={250}
					>
						<AppWrapper onLayout={onLayoutRootView} />
					</UIAnimatedSplashScreen>
				</AuthProvider>
			</LoaderProvider>
		</ErrorBoundary>
	);
};

export default RootLayout;
