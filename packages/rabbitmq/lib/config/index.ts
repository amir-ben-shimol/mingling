import amqp from 'amqplib';

export const connectRabbitMQ = async () => {
	console.log('Connecting to RabbitMQ...');
	const RABBITMQ_URL = process.env['RABBITMQ_URL'];

	if (!RABBITMQ_URL) {
		throw new Error('RABBITMQ_URL is not defined');
	}

	console.log('RABBITMQ_URL:', RABBITMQ_URL);

	try {
		const connection = await amqp.connect(RABBITMQ_URL);
		const channel = await connection.createChannel();

		console.log('Connected to RabbitMQ');

		return { connection, channel };
	} catch (error) {
		console.error('Failed to connect to RabbitMQ:', error);

		throw error;
	}
};

export const listenToQueue = async (queueName: string, handler: (message: amqp.ConsumeMessage | null) => Promise<void>) => {
	const { channel } = await connectRabbitMQ();

	await channel.assertQueue(queueName, { durable: true });

	await channel.consume(queueName, async (message) => {
		try {
			if (message) {
				await handler(message);
				channel.ack(message); // Acknowledge message after processing
			}
		} catch (error) {
			console.error(`Error processing message from queue ${queueName}:`, error);
		}
	});
};

export const publishToQueue = async (queueName: string, message: object) => {
	const { channel } = await connectRabbitMQ();

	await channel.assertQueue(queueName, { durable: true });
	channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};
