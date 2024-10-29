/* eslint-disable @typescript-eslint/no-explicit-any */
// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '@/lib/providers/authProvider';

const LoginScreen = () => {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		try {
			const response = await fetch('http://10.0.0.1:3000/api/users/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data: any = await response.json();

			if (response.ok) {
				Alert.alert('Success', 'Login successful');
				login(data.user);
			} else {
				Alert.alert('Error', data.error || 'Failed to login');
			}
		} catch (error) {
			Alert.alert('Error', 'An error occurred during login');
		}
	};

	const navToRegistration = () => {
		router.push('/registration');
	};

	return (
		<View className="flex-1 bg-white p-6">
			<Text className="mb-6 text-center text-2xl font-bold">Login</Text>

			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="Email"
				value={email}
				keyboardType="email-address"
				onChangeText={setEmail}
			/>
			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="Password"
				value={password}
				secureTextEntry
				onChangeText={setPassword}
			/>

			<Button title="Login" color="#4F46E5" onPress={handleLogin} />
			<Button title="Register" color="#4F46E5" onPress={navToRegistration} />
		</View>
	);
};

export default LoginScreen;
