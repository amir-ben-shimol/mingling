// models/User.ts
import mongoose, { type Document, Schema } from 'mongoose';

export type IUser = Document & {
	firstName: string;
	lastName: string;
	email: string;
	country: string;
	gender: 'male' | 'female' | 'other';
	age: number;
	password: string;
};

const UserSchema: Schema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	country: { type: String, required: true },
	gender: { type: String, enum: ['male', 'female', 'other'], required: true },
	age: { type: Number, required: true },
	password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);
