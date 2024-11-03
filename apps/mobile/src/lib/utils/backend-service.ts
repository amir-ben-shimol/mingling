import type { HttpMethod, ResponseData } from '@/types/api/http';
import { ErrorResponseEnum } from '../types/enums/http';
import { useApiErrorStore } from '../store/useApiErrorStore';
import { getAsyncStorage, setAsyncStorage } from './async-storage';

const MAX_RETRY_COUNT = 10;

async function fetcher<R = unknown, D = unknown>(path: string, method: HttpMethod, data?: D, retryCount = 0): Promise<ResponseData<R>> {
	const { setIsRetrying } = useApiErrorStore.getState();

	const token = await getAsyncStorage('token');
	const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

	const headers = new Headers();

	headers.append('Content-Type', 'application/json');
	token && headers.append('Authorization', `Bearer ${token}`);

	if (retryCount > 0) {
		setIsRetrying(true);
	}

	const response = await fetch(`${baseUrl}${path}`, {
		method: method,
		headers,
		body: data ? JSON.stringify(data) : undefined,
	});

	if (response.status === ErrorResponseEnum.NetworkError && retryCount < MAX_RETRY_COUNT) {
		await new Promise((resolve) => {
			setTimeout(resolve, 1000);
		});

		return fetcher<R, D>(path, method, data, retryCount + 1);
	}

	if (response.status === ErrorResponseEnum.Unauthorized) {
		throw new Error('Unauthorized');
	}

	if (response.status === ErrorResponseEnum.NotFound) {
		throw new Error('End point not found');
	}

	if (response.status === ErrorResponseEnum.BadRequest) {
		throw new Error('Bad request');
	}

	// else if (response.status === ErrorResponseEnum.NetworkError && retryCount >= MAX_RETRY_COUNT) {
	// 	setApiError(response.status, 'קיימת בעיה בחיבור לרשת');
	// }

	setIsRetrying(false);

	const responseData = (await response.json()) as ResponseData<R>;

	const responseToken = response.headers.get('x-access-token');

	if (responseToken) {
		setAsyncStorage('token', responseToken);
	}

	return responseData;
}

const BackendService = {
	get<R = unknown>(path: string): Promise<ResponseData<R>> {
		return fetcher<R>(path, 'GET');
	},
	post<R = unknown, D = unknown>(path: string, data?: D): Promise<ResponseData<R>> {
		return fetcher<R, D>(path, 'POST', data);
	},
	patch<R = unknown, D = unknown>(path: string, data?: D): Promise<ResponseData<R>> {
		return fetcher<R, D>(path, 'PATCH', data);
	},
	delete<R = unknown>(path: string): Promise<ResponseData<R>> {
		return fetcher<R>(path, 'DELETE');
	},
};

export { BackendService };
