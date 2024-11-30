/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly DATABASE_URL: string;
		}
	}
}

export {};
