import React from 'react';
import { Redirect } from 'expo-router';
import { useSession } from '@/providers/sessionProvider';
import AuthorizedDrawer from '@/layouts/AppDrawers/AuthorizedDrawer';
import { ThemeProvider } from '@/lib/providers/themeProvider';
import { SocketProvider } from '@/lib/providers/socketProvider';
import { WebRTCProvider } from '@/lib/providers/webRTCProvider';

const AppLayout = () => {
	const { session } = useSession();

	if (!session) return <Redirect href="/login" />;

	return (
		<ThemeProvider>
			<SocketProvider>
				<WebRTCProvider>
					<AuthorizedDrawer />
				</WebRTCProvider>
			</SocketProvider>
		</ThemeProvider>
	);
};

export default AppLayout;
