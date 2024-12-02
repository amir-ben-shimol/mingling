import type { Request } from 'express';

export const getUserIdFromHeaders = (req: Request): string | null => {
	const xUserIdHeader = req.headers['x-user-id'];

	if (!xUserIdHeader) {
		console.warn('Missing x-user-id header');

		return null;
	}

	console.log('xUserIdHeader:', xUserIdHeader);

	try {
		const userId: string = xUserIdHeader as string;

		return userId;
	} catch (error) {
		console.error('Error parsing x-user header:', error);

		return null;
	}
};
