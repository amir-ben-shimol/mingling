declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: 'development' | 'production';
			readonly CURRENT_IP: string;
			readonly DATABASE_URL: string;
			readonly PORT: string;
			readonly SECRET_TOKEN_KEY: string;
			readonly REDIS_URL: string;
			readonly S3_ACCESS_KEY: string;
			readonly S3_SECRET_KEY: string;
			readonly S3_BUCKET_NAME: string;
			readonly S3_REGION: string;
			readonly S3_ENDPOINT: string;
		}
	}
}

export {};
