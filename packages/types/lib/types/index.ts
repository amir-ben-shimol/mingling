/* eslint-disable @typescript-eslint/no-explicit-any */
export type User = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	country: string;
	gender: 'male' | 'female' | 'other';
	age: number;
	sessionToken?: string;
};

export type ChatMessage = {
	senderId: string;
	receiverId: string;
	message: string;
};

export type SocketEvent = {
	type: 'join' | 'leave' | 'message';
	data: any;
};
