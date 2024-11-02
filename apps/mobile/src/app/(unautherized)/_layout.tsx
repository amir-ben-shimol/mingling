import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/lib/providers/authProvider';

const Layout = () => {
	const { user } = useAuth();

	if (user) return <Redirect href="/" />;

	return <Slot />;
};

export default Layout;
