import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';
import { useSocket } from '@/providers/socketProvider';

const Chat: React.FC = () => {
	const { socket } = useSocket();
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState('');

	const sendMessage = () => {
		if (socket && input) {
			socket.emit('message', input);
			setMessages((prev) => [...prev, `You: ${input}`]);
			setInput('');
		}
	};

	socket?.on('message', (message: string) => {
		setMessages((prev) => [...prev, `Other: ${message}`]);
	});

	return (
		<View>
			<FlatList data={messages} renderItem={({ item }) => <Text>{item}</Text>} keyExtractor={(_, index) => index.toString()} />
			<TextInput value={input} placeholder="Type a message" onChangeText={setInput} />
			<Button title="Send" onPress={sendMessage} />
		</View>
	);
};

export default Chat;
