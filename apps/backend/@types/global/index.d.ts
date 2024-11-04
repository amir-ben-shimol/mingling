declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly DATABASE_URL: string;
			readonly PORT: string;
			readonly SECRET_TOKEN_KEY: string;
			readonly REDIS_URL: string;
		}
	}
}

export {};
