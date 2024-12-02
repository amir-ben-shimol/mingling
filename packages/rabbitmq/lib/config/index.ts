import amqp from 'amqplib';

export const connectRabbitMQ = async () => {
	console.log('Connecting to RabbitMQ...');
	const RABBITMQ_URL = process.env['RABBITMQ_URL'];

	if (!RABBITMQ_URL) {
		throw new Error('RABBITMQ_URL is not defined');
	}

	console.log('RABBITMQ_URL:', RABBITMQ_URL);

	const maxRetries = 10;
	const retryDelay = 5000;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const connection = await amqp.connect(RABBITMQ_URL);
			const channel = await connection.createChannel();

			console.log('Connected to RabbitMQ');

			return { connection, channel };
		} catch (error) {
			console.error(`Attempt ${attempt} failed: Failed to connect to RabbitMQ`, error);

			if (attempt === maxRetries) {
				console.error('Max retries reached. Unable to connect to RabbitMQ.');

				throw error;
			}

			await new Promise((resolve) => {
				setTimeout(resolve, retryDelay);
			});
		}
	}

	throw new Error('Unexpected error in connectRabbitMQ');
};

export const listenToQueue = async (queueName: string, handler: (message: amqp.ConsumeMessage | null) => Promise<void>) => {
	const connection = await connectRabbitMQ();

	if (!connection || !connection.channel) {
		throw new Error('RabbitMQ connection or channel is undefined.');
	}

	const { channel } = connection;

	await channel.assertQueue(queueName, { durable: true });

	await channel.consume(queueName, async (message) => {
		try {
			if (message) {
				await handler(message);
				channel.ack(message);
			}
		} catch (error) {
			console.error(`Error processing message from queue ${queueName}:`, error);
		}
	});
};

export const publishToQueue = async (queueName: string, message: object) => {
	const connection = await connectRabbitMQ();

	if (!connection || !connection.channel) {
		throw new Error('RabbitMQ connection or channel is undefined.');
	}

	const { channel } = connection;

	await channel.assertQueue(queueName, { durable: true });
	channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};
