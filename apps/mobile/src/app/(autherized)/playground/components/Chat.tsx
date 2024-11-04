// src/screens/components/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { View, TextInput, FlatList, Text, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useSocket } from '@/lib/providers/socketProvider';
import { useAuth } from '@/lib/providers/authProvider';

type ChatProps = {
	connectedUser: string;
};

type Message = {
	sender: string;
	content: string;
	timestamp: number;
};

const Chat: React.FC<ChatProps> = ({ connectedUser }) => {
	console.log('Inside Chat component', connectedUser);
	const { socket } = useSocket();
	const { user } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');

	const flatListRef = useRef<FlatList>(null);

	useEffect(() => {
		if (!socket) return;

		const handleMessage = (message: Message) => {
			setMessages((prev) => [...prev, message]);
		};

		socket.on('chatMessage', handleMessage);

		return () => {
			socket.off('chatMessage', handleMessage);
		};
	}, [socket]);

	useEffect(() => {
		flatListRef.current?.scrollToEnd({ animated: true });
	}, [messages]);

	const sendMessage = () => {
		if (!input.trim() || !user) return;

		const message: Message = {
			sender: user._id,
			content: input.trim(),
			timestamp: Date.now(),
		};

		socket?.emit('chatMessage', { to: connectedUser, message });
		setMessages((prev) => [...prev, message]);
		setInput('');
		Keyboard.dismiss(); // Hide the keyboard
	};

	const renderItem = ({ item }: { item: Message }) => {
		const isSentByUser = item.sender === user?._id;

		return (
			<View className={`my-1 max-w-[80%] rounded-md p-2 ${isSentByUser ? 'self-end bg-blue-500' : 'self-start bg-gray-300'}`}>
				<Text className={`${isSentByUser ? 'text-white' : 'text-black'}`}>{item.content}</Text>
				<Text className={`mt-1 text-xs ${isSentByUser ? 'text-white' : 'text-gray-600'}`}>{dayjs(item.timestamp).format('HH:mm')}</Text>
			</View>
		);
	};

	return (
		<KeyboardAvoidingView
			className="flex-1"
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
		>
			<View className="flex-1">
				<FlatList
					ref={flatListRef}
					data={messages}
					keyExtractor={(_, index) => index.toString()}
					renderItem={renderItem}
					contentContainerStyle={{
						flexGrow: 1,
						paddingHorizontal: 8,
						paddingBottom: 60,
					}}
				/>
				<View className="absolute bottom-0 left-0 right-0 flex-row items-center border-t border-gray-200 bg-white p-2">
					<TextInput
						className="flex-1 rounded-md border border-gray-300 p-2"
						value={input}
						placeholder="Type a message"
						multiline
						onChangeText={setInput}
					/>
					<Pressable className="ml-2 rounded-md bg-blue-500 p-2" onPress={sendMessage}>
						<Text className="text-white">Send</Text>
					</Pressable>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default Chat;
