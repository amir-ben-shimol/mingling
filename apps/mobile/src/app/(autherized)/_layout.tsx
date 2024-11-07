import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/authProvider';
import { SocketProvider } from '@/lib/providers/socketProvider';
import { WebRTCProvider } from '@/lib/providers/webRtcProvider';
import BottomTabsNavigator from '@/layouts/BottomTabsNavigator';

const AppLayout = () => {
	const { user } = useAuth();

	if (!user) return <Redirect href="/login" />;

	return (
		<SocketProvider userId={user._id}>
			<WebRTCProvider>
				<BottomTabsNavigator />
			</WebRTCProvider>
		</SocketProvider>
	);
};

export default AppLayout;
