// src/config/redis-client.ts
import { createClient } from 'redis';

const redisClient = createClient({
	url: process.env.REDIS_URL || 'redis://redis:6379', // Default to 'redis' hostname in Docker if not specified
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
	try {
		await redisClient.connect();
		console.log('Connected to Redis');
	} catch (error) {
		console.error('Error connecting to Redis:', error);
	}
})();

export default redisClient;
