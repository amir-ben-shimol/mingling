import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/authProvider';
import AuthorizedDrawer from '@/layouts/AppDrawers/AuthorizedDrawer';
import { SocketProvider } from '@/lib/providers/socketProvider';
import { WebRTCProvider } from '@/lib/providers/webRTCProvider';

const AppLayout = () => {
	const { user } = useAuth();

	if (!user) return <Redirect href="/login" />;

	return (
		<SocketProvider>
			<WebRTCProvider>
				<AuthorizedDrawer />
			</WebRTCProvider>
		</SocketProvider>
	);
};

export default AppLayout;
