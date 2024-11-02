// types/express/index.d.ts
import type { IUser } from '../../src/models/user';

declare global {
	namespace Express {
		export interface Request {
			user?: IUser;
		}
	}
}
