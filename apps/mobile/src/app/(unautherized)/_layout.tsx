import { Redirect } from 'expo-router';
import UnauthorizedDrawer from '@/layouts/AppDrawers/UnauthorizedDrawer';
import { UnauthorizedDrawerProvider } from '@/lib/providers/unauthorizedDrawerProvider';
import { useAuth } from '@/lib/providers/authProvider';

const Layout = () => {
	const { user } = useAuth();

	if (user) return <Redirect href="/" />;

	return (
		<UnauthorizedDrawerProvider>
			<UnauthorizedDrawer />
		</UnauthorizedDrawerProvider>
	);
};

export default Layout;
