declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly MONGODB_URI: 'local' | 'development' | 'qa' | 'production';
		}
	}
}

export {};
