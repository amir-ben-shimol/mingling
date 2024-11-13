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
