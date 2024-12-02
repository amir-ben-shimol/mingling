import { S3Client } from '@aws-sdk/client-s3';

const isProduction = process.env.NODE_ENV === 'production';

const s3 = new S3Client({
	region: process.env.S3_REGION,
	endpoint: process.env.S3_ENDPOINT,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY,
	},
	forcePathStyle: !isProduction,
});

if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
	console.warn('Warning: S3 credentials are missing');
}

export default s3;
