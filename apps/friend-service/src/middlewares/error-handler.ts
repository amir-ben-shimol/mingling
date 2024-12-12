import type { Request, Response } from 'express';

/**
 * Error-handling middleware for catching and processing errors.
 */
export const errorHandler = (err: Error, _: Request, res: Response): void => {
	// Log the error for debugging purposes
	console.error('__Error__:', err.message, '\nStack:', err.stack);
	console.log('ya`if');

	// Determine the HTTP status code and error message
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500; // Default to 500 if no status is set
	const errorMessage = err.message || 'Internal Server Error';

	// Send the error response
	res.status(statusCode).json({
		error: errorMessage,
		stack: process.env.NODE_ENV === 'production' ? undefined : err.stack, // Hide stack in production
	});
};
