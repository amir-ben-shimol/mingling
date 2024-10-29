import { Redirect } from 'expo-router';
import UnauthorizedDrawer from '@/layouts/AppDrawers/UnauthorizedDrawer';
import { useSession } from '@/lib/providers/sessionProvider';
import { UnauthorizedDrawerProvider } from '@/lib/providers/unauthorizedDrawerProvider';

const LoginLayout = () => {
	const { session } = useSession();

	if (session) return <Redirect href="/" />;

	return (
		<UnauthorizedDrawerProvider>
			<UnauthorizedDrawer />
		</UnauthorizedDrawerProvider>
	);
};

export default LoginLayout;
