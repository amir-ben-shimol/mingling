export type NotificationType = 'system' | 'friend-request';

export type NotificationVarient = 'info' | 'success' | 'warning' | 'error';

export type NotificationWithTimeout = Notification & {
	timeoutId?: NodeJS.Timeout;
	readonly remainingDuration: number;
	readonly startTime: number;
};

export type Notification = {
	readonly id: string;
	readonly type: NotificationType;
	readonly title: string;
	readonly content: string;
	readonly timestamp: Date;
	readonly varient?: NotificationVarient;
	readonly fromUserId: string;
	readonly toUserId?: string;
	readonly duration?: number;
	readonly isUnmounting?: boolean;
};
