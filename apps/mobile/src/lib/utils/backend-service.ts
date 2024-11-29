import type { HttpMethod, ResponseData } from '@/types/api/http';
import { ErrorResponseEnum } from '../types/enums/http';
import { useApiErrorStore } from '../store/useApiErrorStore';
import { getAsyncStorage, setAsyncStorage } from './async-storage';

const MAX_RETRY_COUNT = 10;

async function fetcher<R = unknown, D = unknown>(
	path: string,
	method: HttpMethod,
	data?: D,
	headers: HeadersInit = {},
	retryCount = 0,
): Promise<ResponseData<R>> {
	const { setIsRetrying } = useApiErrorStore.getState();

	const token = await getAsyncStorage('token');
	const baseUrl = process.env['EXPO_PUBLIC_BACKEND_URL'];

	const fetcherHeaders = new Headers(headers);

	if (!fetcherHeaders.has('Content-Type')) {
		fetcherHeaders.append('Content-Type', 'application/json');
	}

	if (token) {
		fetcherHeaders.append('Authorization', `Bearer ${token}`);
	}

	if (retryCount > 0) {
		setIsRetrying(true);
	}

	const response = await fetch(`${baseUrl}${path}`, {
		method,
		headers: fetcherHeaders,
		body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined, // Ensure undefined if no data
	});

	if (response.status === ErrorResponseEnum.NetworkError && retryCount < MAX_RETRY_COUNT) {
		await new Promise((resolve) => {
			setTimeout(resolve, 1000);
		});

		return fetcher<R, D>(path, method, data, headers, retryCount + 1);
	}

	if (response.status === ErrorResponseEnum.Unauthorized) throw new Error('Unauthorized');

	if (response.status === ErrorResponseEnum.NotFound) throw new Error('Endpoint not found');

	if (response.status === ErrorResponseEnum.BadRequest) throw new Error('Bad request');

	setIsRetrying(false);

	const responseData = (await response.json()) as ResponseData<R>;

	const responseToken = response.headers.get('x-access-token');

	if (responseToken) {
		setAsyncStorage('token', responseToken);
	}

	return responseData;
}

const BackendService = {
	get<R = unknown>(path: string, headers?: HeadersInit): Promise<ResponseData<R>> {
		return fetcher<R>(path, 'GET', undefined, headers);
	},
	post<R = unknown, D = unknown>(path: string, data?: D, headers?: HeadersInit): Promise<ResponseData<R>> {
		return fetcher<R, D>(path, 'POST', data, headers);
	},
	patch<R = unknown, D = unknown>(path: string, data?: D, headers?: HeadersInit): Promise<ResponseData<R>> {
		return fetcher<R, D>(path, 'PATCH', data, headers);
	},
	delete<R = unknown>(path: string, headers?: HeadersInit): Promise<ResponseData<R>> {
		return fetcher<R>(path, 'DELETE', undefined, headers);
	},
};

export { BackendService };
