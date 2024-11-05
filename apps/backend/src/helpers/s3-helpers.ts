import type { PutObjectRequest } from '@aws-sdk/client-s3';

const getExtensionFromMimeType = (mimetype: string) => {
	switch (mimetype) {
		case 'image/jpeg': {
			return 'jpg';
		}
		case 'image/png': {
			return 'png';
		}
		case 'image/gif': {
			return 'gif';
		}
		default: {
			return 'jpg';
		}
	}
};

export const generateProfileImageKey = (userId: string, file: Express.Multer.File) => {
	const extension = getExtensionFromMimeType(file.mimetype);
	const timestamp = Date.now();

	return `${userId}/assets/profile-${timestamp}.${extension}`;
};

export const generateImageUrl = (params: PutObjectRequest) => {
	if (process.env.NODE_ENV === 'production') {
		return `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`;
	} else {
		return `http://localhost:9000/${params.Bucket}/${params.Key}`;
	}
};
