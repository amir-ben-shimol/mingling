// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

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
		console.log(' inside of handledr register', firstName, lastName, email, country);

		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');

			return;
		}

		try {
			const response = await fetch('http://10.0.0.16:8080/api/users/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					country,
					gender,
					age: Number(age),
					password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				Alert.alert('Success', 'User registered successfully');
			} else {
				Alert.alert('Error', data.error || 'Failed to register');
			}
		} catch (error) {
			Alert.alert('Error', 'An error occurred while registering');
		}
	};

	return (
		<View className="flex-1 bg-white p-6">
			<Text className="mb-6 text-center text-2xl font-bold">Register</Text>

			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="First Name"
				value={firstName}
				onChangeText={setFirstName}
			/>
			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="Last Name"
				value={lastName}
				onChangeText={setLastName}
			/>
			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="Email"
				value={email}
				keyboardType="email-address"
				onChangeText={setEmail}
			/>
			<TextInput className="mb-4 rounded-md border p-3" placeholderTextColor="#939393" placeholder="Country" value={country} onChangeText={setCountry} />
			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="Age"
				value={age}
				keyboardType="numeric"
				onChangeText={setAge}
			/>
			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="Password"
				value={password}
				secureTextEntry
				onChangeText={setPassword}
			/>
			<TextInput
				className="mb-4 rounded-md border p-3"
				placeholderTextColor="#939393"
				placeholder="Confirm Password"
				value={confirmPassword}
				secureTextEntry
				onChangeText={setConfirmPassword}
			/>

			<View className="mb-6 flex-row justify-between">
				<Button title="Male" color={gender === 'male' ? '#4F46E5' : '#E5E7EB'} onPress={() => setGender('male')} />
				<Button title="Female" color={gender === 'female' ? '#4F46E5' : '#E5E7EB'} onPress={() => setGender('female')} />
				<Button title="Other" color={gender === 'other' ? '#4F46E5' : '#E5E7EB'} onPress={() => setGender('other')} />
			</View>

			<Button title="Register" color="#4F46E5" onPress={handleRegister} />
		</View>
	);
};

export default RegisterScreen;
