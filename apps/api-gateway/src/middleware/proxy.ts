/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassThrough } from 'node:stream';
import axios from 'axios';
import type { Request, Response } from 'express';

const proxyMiddleware = (target: string) => async (req: Request, res: Response) => {
	try {
		const targetUrl = new URL(req.originalUrl, target);

		const headers: Record<string, string> = {};

		// Forward all headers from the original request
		Object.entries(req.headers).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				headers[key] = value.join(', ');
			} else if (value) {
				headers[key] = value.toString();
			}
		});

		console.log('Proxying request to:', targetUrl.toString());
		console.log('Headers:', headers);

		// Check for `multipart/form-data` requests
		if (req.headers['content-type']?.startsWith('multipart/form-data')) {
			console.log('Handling multipart/form-data request');

			const response = await axios({
				url: targetUrl.toString(),
				method: req.method as any,
				headers: {
					...headers,
					host: targetUrl.host, // Ensure the correct `Host` header is set
				},
				data: req.pipe(new PassThrough()), // Stream the original request body
				responseType: 'stream', // Ensure the response is streamed back
			});

			// Pipe the response back to the client
			res.status(response.status);
			response.data.pipe(res);
		} else {
			// Handle non-multipart requests normally
			const response = await axios({
				url: targetUrl.toString(),
				method: req.method as any,
				headers,
				data: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
			});

			console.log('Response from proxy:', response.status, response.headers, response.data);

			res.status(response.status).set(response.headers).send(response.data);
		}
	} catch (error: any) {
		console.error('Error in proxy middleware:', error.message || error);
		res.status(500).json({ error: 'Proxy error', details: error.message });
	}
};

export default proxyMiddleware;
