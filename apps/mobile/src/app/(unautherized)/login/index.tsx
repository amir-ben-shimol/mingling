// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import type { User } from '@mingling/types';
import { View, Text, TextInput, Alert, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/lib/providers/authProvider';
import { BackendService } from '@/lib/utils/backend-service';

const LoginScreen = () => {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		try {
			const response = await BackendService.post<{ user: User }>('/api/user/login', { email, password });

			if (response.ok) {
				login(response.data.user);
			} else {
				Alert.alert('Error', response.message || 'Failed to login');
			}
		} catch (error) {
			Alert.alert('Error', 'An error occurred during login');
		}
	};

	const navToRegistration = () => {
		router.push('/registration');
	};

	return (
		<View className="flex-1 justify-center bg-gray-900 p-6">
			{/* Header */}
			<View className="mb-8 flex items-center justify-center">
				<Image className="h-24 w-24" source="app_logo" />
				<Text className="text-center text-3xl font-bold text-gray-100">Welcome Back</Text>
				<Text className="text-center text-lg text-gray-400">Sign in to your account</Text>
			</View>

			{/* Email Input */}
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<View className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3">
					<TextInput
						className="text-base text-gray-200"
						placeholder="Email"
						placeholderTextColor="#6B7280" // gray-500
						value={email}
						autoCapitalize="none"
						keyboardType="email-address"
						onChangeText={setEmail}
					/>
				</View>
				{/* Password Input */}
				<View className="mb-6 rounded-md border border-gray-700 bg-gray-800 p-3">
					<TextInput
						className="text-base text-gray-200"
						placeholder="Password"
						placeholderTextColor="#6B7280" // gray-500
						value={password}
						secureTextEntry
						onChangeText={setPassword}
					/>
				</View>
				{/* Login Button */}
				<View className="mb-4 rounded-lg bg-indigo-600 p-4">
					<Pressable onPress={handleLogin}>
						<Text className="text-center text-lg font-semibold text-white">Login</Text>
					</Pressable>
				</View>
				{/* Register Button */}
				<View className="rounded-lg bg-gray-700 p-4">
					<Pressable onPress={navToRegistration}>
						<Text className="text-center text-lg font-semibold text-indigo-400">Register</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

export default LoginScreen;
