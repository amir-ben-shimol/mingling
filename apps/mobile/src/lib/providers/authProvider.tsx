// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@mingling/types';
import { BackendService } from '../utils/backend-service';

type AuthContextType = {
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
	refreshUser: () => Promise<void>;
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
		await Promise.allSettled([BackendService.post('/api/users/logout'), AsyncStorage.removeItem(CACHE_KEY), AsyncStorage.removeItem('token')]);
		setUser(null);
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
			await BackendService.get('/api/users/is-auth');
		} catch (error) {
			logout();
		}
	};

	const refreshUser = async () => {
		if (!user) return;

		try {
			const response = await BackendService.get<User>(`/api/users/user/${user._id}`);

			setUser(response.data);
			await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ ...response.data, timestamp: Date.now() }));
		} catch (error) {
			console.error('Error refreshing user data:', error);
		}
	};

	useEffect(() => {
		loadCachedUser();
		checkAuth();
	}, []);

	return <AuthContext.Provider value={{ user, login, logout, refreshUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) throw new Error('useAuth must be used within an AuthProvider');

	return context;
};
