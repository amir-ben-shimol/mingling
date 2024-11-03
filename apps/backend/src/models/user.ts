// models/User.ts
import mongoose, { type Document, Schema } from 'mongoose';
import type { Notification } from '@mingling/types';

type FriendStatus = 'pending' | 'incoming' | 'declined' | 'approved';

export type Friend = {
	userId: string;
	status: FriendStatus;
};

export type IUser = Document & {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	country: string;
	gender: 'male' | 'female' | 'other';
	age: number;
	password: string;
	sessionToken?: string;
	friendsList: Friend[];
	notifications: Notification[];
};

const UserSchema: Schema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	country: { type: String, required: true },
	gender: { type: String, enum: ['male', 'female', 'other'], required: true },
	age: { type: Number, required: true },
	password: { type: String, required: true },
	sessionToken: { type: String, required: false },
	friendsList: [
		{
			userId: { type: String, required: true },
			status: { type: String, enum: ['pending', 'incoming', 'declined', 'approved'], required: true },
		},
	],
	notifications: [
		{
			_id: false,
			id: { type: String, required: true },
			type: { type: String, enum: ['friend-request', 'system'], required: true },
			title: { type: String, required: true },
			content: { type: String, required: true },
			fromUserId: { type: String },
			timestamp: { type: Date, default: Date.now },
		},
	],
});

export const User = mongoose.model<IUser>('User', UserSchema);
