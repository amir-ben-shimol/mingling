/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly APP_ENV: 'local' | 'development' | 'qa' | 'production';
			readonly EXPO_PUBLIC_APP_ENV: 'local' | 'development' | 'qa' | 'production';
			readonly EXPO_PUBLIC_BACKEND_URL: string;
			readonly EXPO_PUBLIC_RUN_WITH_MOCK: 'true' | 'false';
			readonly EXPO_PUBLIC_CODEPUSH_KEY: string;
			readonly EXPO_PUBLIC_CODEPUSH_SERVER_URL: string;
		}
	}
}

export {};
