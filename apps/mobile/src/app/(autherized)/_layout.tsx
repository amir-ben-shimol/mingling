import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/authProvider';
import { SocketProvider } from '@/lib/providers/socketProvider';
import { WebRTCProvider } from '@/lib/providers/webRTCProvider';
import BottomTabsNavigator from '@/layouts/BottomTabsNavigator';

const AppLayout = () => {
	const { user } = useAuth();

	if (!user) return <Redirect href="/login" />;

	return (
		<SocketProvider>
			<WebRTCProvider>
				<BottomTabsNavigator />
			</WebRTCProvider>
		</SocketProvider>
	);
};

export default AppLayout;
