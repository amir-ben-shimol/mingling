/* eslint-disable import/exports-last */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { clearToken, getToken, migrateToken, saveToken } from '../utils/secure-storage';
import { useLoader } from './loaderProvider';

export const TOKEN_KEY = 'token';

type AuthContextProps = {
	readonly signIn: () => Promise<void>;
	readonly signOut: () => Promise<void>;
	readonly session?: string | null;
};

type SessionProviderProps = {
	readonly children: ReactNode;
};

const AuthContext = createContext<AuthContextProps>({
	signIn: () => Promise.resolve(),
	signOut: () => Promise.resolve(),
	session: null,
});

export const useSession = (): AuthContextProps => {
	const value = useContext(AuthContext);

	if (!value) {
		throw new Error('useSession must be wrapped in a <SessionProvider />');
	}

	return value;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
	const [session, setSession] = useState<string | null>(null);
	const { showLoader, removeLoader } = useLoader();

	// Load session token from SecureStore when the app starts
	useEffect(() => {
		const loadSession = async () => {
			const token = await getToken(TOKEN_KEY);

			setSession(token ?? null);
		};

		loadSession();
	}, []);

	const signIn = async () => {
		const token = await migrateToken(TOKEN_KEY);

		if (!token) {
			console.log('No token found');
			await saveToken(TOKEN_KEY, 'eykjhkajhdskjahsdkjhad');
			const newToken = await getToken(TOKEN_KEY);

			console.log('newToken', newToken);
			setSession(token);

			return;
		}

		setSession(token);
	};

	const signOut = async () => {
		try {
			showLoader();

			console.log('session before clear', session);

			// Simulating API call or delay
			await new Promise((resolve) => {
				setTimeout(resolve, 1000);
			});

			await clearToken(TOKEN_KEY);

			setSession(null);
		} finally {
			removeLoader();
		}
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				session,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
