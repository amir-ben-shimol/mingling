/* eslint-disable @typescript-eslint/no-explicit-any */
export type SignalingData = {
	type: 'offer' | 'answer' | 'candidate';
	data: any;
};
