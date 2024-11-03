import type { Notification } from './notification';

export type FriendStatus = 'pending' | 'incoming' | 'declined' | 'approved';

export type Friend = {
	readonly userId: string;
	status: FriendStatus;
};

export type FriendDetails = {
	readonly status: FriendStatus;
	readonly userDetails: Friend & Omit<User, 'password' | 'sessionToken' | 'friendsList' | 'notifications'>;
};

export type User = {
	readonly _id: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly email: string;
	readonly country: string;
	readonly gender: 'male' | 'female' | 'other';
	readonly age: number;
	readonly password: string;
	sessionToken?: string;
	friendsList: Friend[];
	notifications: Notification[];
};
