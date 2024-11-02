import { type ErrorResponseEnum } from '../enums/http';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type ResponseData<T> = {
	readonly data: T;
	readonly ok: boolean;
	readonly status: number;
	readonly error: ErrorResponseEnum;
	readonly message?: string;
};
