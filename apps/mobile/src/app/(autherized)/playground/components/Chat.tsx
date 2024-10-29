// src/components/Chat.tsx
import { View, TextInput, Text, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/providers/socketProvider';

type Message = {
	id: string;
	text: string;
	sender: 'self' | 'other';
	time: string;
};

const Chat: React.FC = () => {
	const { socket } = useSocket();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [connectedUser, setConnectedUser] = useState<string | null>(null);
	const flatListRef = useRef<FlatList>(null);

	// Listen for the connection start to get the recipient ID
	useEffect(() => {
		socket?.on('start-connection', ({ to }) => {
			setConnectedUser(to);
		});
	}, [socket]);

	// Listen for incoming messages and update state
	useEffect(() => {
		const handleIncomingMessage = (data: { from: string; message: string }) => {
			const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

			setMessages((prev) => [...prev, { id: data.from, text: data.message, sender: 'other', time }]);
		};

		socket?.on('message', handleIncomingMessage);

		return () => {
			socket?.off('message', handleIncomingMessage);
		};
	}, [socket]);

	const sendMessage = () => {
		if (socket && input && connectedUser) {
			const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

			const newMessage: Message = {
				id: socket.id || 'unknown', // Fallback to 'unknown' if socket.id is undefined
				text: input,
				sender: 'self',
				time,
			};

			setMessages((prev) => [...prev, newMessage]);

			// Emit message to the other user
			socket.emit('message', { to: connectedUser, message: input });
			setInput('');
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
			<View className="flex-1 bg-gray-100 p-4">
				<FlatList
					ref={flatListRef}
					data={messages}
					renderItem={({ item }) => (
						<View className={`my-1 max-w-[70%] rounded-lg p-3 ${item.sender === 'self' ? 'self-end bg-blue-500' : 'self-start bg-gray-300'}`}>
							<Text className={`${item.sender === 'self' ? 'text-white' : 'text-black'}`}>{item.text}</Text>
							<Text className={`mt-1 text-xs ${item.sender === 'self' ? 'self-end text-gray-100' : 'text-gray-500'}`}>{item.time}</Text>
						</View>
					)}
					keyExtractor={(_, index) => index.toString()}
					contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
					onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
				/>
			</View>

			<View className="absolute bottom-0 w-full flex-row items-center bg-gray-200 p-4">
				<TextInput value={input} placeholder="Type a message" className="flex-1 rounded-lg bg-white p-3" onChangeText={setInput} />
				<TouchableOpacity className="ml-2 rounded-lg bg-blue-500 p-3" onPress={sendMessage}>
					<Text className="text-white">Send</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default Chat;
