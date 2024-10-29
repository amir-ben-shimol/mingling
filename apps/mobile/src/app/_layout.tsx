import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { LoaderProvider } from '@/providers/loaderProvider';
import ErrorBoundary from '@/wrappers/ErrorBoundary';
import { cacheImages } from '@/lib/helpers/cache';

import AppWrapper from '@/wrappers/AppWrapper';
import { AuthProvider } from '@/lib/providers/authProvider';
import { SocketProvider } from '@/lib/providers/socketProvider';
import { WebRTCProvider } from '@/lib/providers/webRTCProvider';
import { ThemeProvider } from '@/lib/providers/themeProvider';

const RootLayout = () => {
	const [appIsReady, setAppIsReady] = useState(false);

	const loadResources = async () => {
		const imageAssets = cacheImages([
			require('@/assets/images/global/header-background.png'),
			require('@/assets/images/global/home-page-hasida-top.png'),
			require('@/assets/gifs/loader.gif'),
		]);

		await Promise.all([...imageAssets]);
	};

	useEffect(() => {
		const prepare = async () => {
			try {
				SplashScreen.preventAutoHideAsync();

				await loadResources();

				setAppIsReady(true);
				await SplashScreen.hideAsync();
			} catch (error) {
				console.warn(error);
			}
		};

		prepare();
	}, []);

	if (!appIsReady) {
		return null;
	}

	return (
		<ErrorBoundary>
			<ThemeProvider>
				<LoaderProvider>
					<AuthProvider>
						<SocketProvider>
							<WebRTCProvider>
								<AppWrapper />
							</WebRTCProvider>
						</SocketProvider>
					</AuthProvider>
				</LoaderProvider>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

export default RootLayout;
