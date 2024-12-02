import type { IUser } from '@mingling/database';

declare global {
	namespace Express {
		export interface Request {
			user?: IUser;
		}
	}
}
