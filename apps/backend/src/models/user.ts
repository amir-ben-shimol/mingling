// models/User.ts
import mongoose, { type Document, Schema } from 'mongoose';
import type { User as UserType } from '@mingling/types';

export type IUser = Document & UserType;

const FriendSchema = new Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
		status: {
			type: String,
			enum: ['pending', 'incoming', 'declined', 'approved'],
			required: true,
		},
	},
	{ _id: false }, // Disable automatic _id creation for subdocuments if not needed
);

// Define the NotificationSchema as a subschema (optional but recommended for consistency)
const NotificationSchema = new Schema(
	{
		id: { type: String, required: true },
		type: { type: String, enum: ['friend-request', 'system'], required: true },
		title: { type: String, required: true },
		content: { type: String, required: true },
		fromUserId: { type: String },
		timestamp: { type: Date, default: Date.now },
	},
	{ _id: false }, // Disable automatic _id creation for subdocuments
);

// Define the UserSchema
const UserSchema: Schema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	country: { type: String, required: true },
	gender: { type: String, enum: ['male', 'female', 'other'], required: true },
	age: { type: Number, required: true },
	password: { type: String, required: true },
	sessionToken: { type: String, required: false },
	isOnline: { type: Boolean, default: false },
	friendsList: [FriendSchema], // Use the FriendSchema here
	notifications: [NotificationSchema], // Use the NotificationSchema here
});

export const User = mongoose.model<IUser>('User', UserSchema);
