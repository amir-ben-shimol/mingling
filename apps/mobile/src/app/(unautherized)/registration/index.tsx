// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { BackendService } from '@/lib/utils/backend-service';

const RegisterScreen = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [country, setCountry] = useState('');
	const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
	const [age, setAge] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');

			return;
		}

		try {
			await BackendService.post('/api/users/register', {
				firstName,
				lastName,
				email,
				country,
				gender,
				age: Number(age),
				password,
			});
			Alert.alert('Success', 'User registered successfully');
		} catch (error) {
			Alert.alert('Error', 'An error occurred while registering');
		}
	};

	const navToLogin = () => {
		router.push('/login');
	};

	return (
		<View className="flex-1 justify-center bg-gray-900 p-6">
			{/* Header */}
			<View className="mb-4">
				<Text className="text-center text-3xl font-bold text-gray-100">Create Account</Text>
				<Text className="text-center text-lg text-gray-400">Join us today!</Text>
			</View>

			{/* Input Fields */}
			<TextInput
				className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200"
				placeholderTextColor="#6B7280" // gray-500 for dark placeholder
				placeholder="First Name"
				value={firstName}
				onChangeText={setFirstName}
			/>
			<TextInput
				className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200"
				placeholderTextColor="#6B7280"
				placeholder="Last Name"
				value={lastName}
				onChangeText={setLastName}
			/>
			<TextInput
				className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200"
				placeholderTextColor="#6B7280"
				placeholder="Email"
				value={email}
				keyboardType="email-address"
				onChangeText={setEmail}
			/>
			<TextInput
				className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200"
				placeholderTextColor="#6B7280"
				placeholder="Country"
				value={country}
				onChangeText={setCountry}
			/>
			<TextInput
				className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200"
				placeholderTextColor="#6B7280"
				placeholder="Age"
				value={age}
				keyboardType="numeric"
				onChangeText={setAge}
			/>
			<TextInput
				className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200"
				placeholderTextColor="#6B7280"
				placeholder="Password"
				value={password}
				secureTextEntry
				onChangeText={setPassword}
			/>
			<TextInput
				className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200"
				placeholderTextColor="#6B7280"
				placeholder="Confirm Password"
				value={confirmPassword}
				secureTextEntry
				onChangeText={setConfirmPassword}
			/>

			{/* Gender Selection */}
			<View className="mb-6 flex-row justify-between">
				<Pressable className={`mr-2 flex-1 rounded-lg p-3 ${gender === 'male' ? 'bg-indigo-600' : 'bg-gray-700'}`} onPress={() => setGender('male')}>
					<Text className={`text-center ${gender === 'male' ? 'text-white' : 'text-gray-300'}`}>Male</Text>
				</Pressable>
				<Pressable
					className={`mx-2 flex-1 rounded-lg p-3 ${gender === 'female' ? 'bg-indigo-600' : 'bg-gray-700'}`}
					onPress={() => setGender('female')}
				>
					<Text className={`text-center ${gender === 'female' ? 'text-white' : 'text-gray-300'}`}>Female</Text>
				</Pressable>
				<Pressable className={`ml-2 flex-1 rounded-lg p-3 ${gender === 'other' ? 'bg-indigo-600' : 'bg-gray-700'}`} onPress={() => setGender('other')}>
					<Text className={`text-center ${gender === 'other' ? 'text-white' : 'text-gray-300'}`}>Other</Text>
				</Pressable>
			</View>

			{/* Register Button */}
			<View className="mb-4 rounded-lg bg-indigo-600 p-4">
				<Pressable onPress={handleRegister}>
					<Text className="text-center text-lg font-semibold text-white">Register</Text>
				</Pressable>
			</View>

			{/* Login Button */}
			<View className="rounded-lg bg-gray-700 p-4">
				<Pressable onPress={navToLogin}>
					<Text className="text-center text-lg font-semibold text-indigo-400">Login</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default RegisterScreen;
