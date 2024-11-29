import mongoose from 'mongoose';

export const connectToDatabase = async () => {
	const mongoUri = process.env['DATABASE_URL'];

	try {
		if (!mongoUri) {
			throw new Error('DATABASE_URL is not defined');
		}

		await mongoose.connect(mongoUri);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	}
};
