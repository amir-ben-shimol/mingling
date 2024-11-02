// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@mingling/types';
import { BackendService } from '../utils/backend-service';
import { ErrorResponseEnum } from '../types/enums/http';

type AuthContextType = {
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
};

type AuthProviderProps = {
	children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = 'cachedUser';
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	const login = async (userData: User) => {
		const timestamp = Date.now();
		const userWithTimestamp = { ...userData, timestamp };

		setUser(userData);
		await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(userWithTimestamp));
	};

	const logout = async () => {
		setUser(null);
		await AsyncStorage.removeItem(CACHE_KEY);
		await AsyncStorage.removeItem('token');
	};

	const loadCachedUser = async () => {
		const cachedUserString = await AsyncStorage.getItem(CACHE_KEY);

		if (cachedUserString) {
			const cachedUser = JSON.parse(cachedUserString) as User & { timestamp: number };
			const isCacheValid = Date.now() - cachedUser.timestamp < EXPIRATION_TIME;

			if (isCacheValid) {
				setUser(cachedUser);
			} else {
				await AsyncStorage.removeItem(CACHE_KEY);
			}
		}
	};

	const checkAuth = async () => {
		const token = await AsyncStorage.getItem('token');

		if (!token) {
			logout();

			return;
		}

		try {
			const response = await BackendService.get('/api/users/is-auth');

			if (response.status === ErrorResponseEnum.Unauthorized) {
				logout();
			}
		} catch (error) {
			logout();
		}
	};

	useEffect(() => {
		loadCachedUser();
		checkAuth();
	}, []);

	return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) throw new Error('useAuth must be used within an AuthProvider');

	return context;
};
