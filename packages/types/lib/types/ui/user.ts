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
