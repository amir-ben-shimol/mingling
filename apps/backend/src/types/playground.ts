export type GroupData = {
	groupId: string;
	memberSocketIds: Set<string>;
	inPlayground: boolean;
	inChat: boolean;
	chatPartnerGroupId: string | null;
};
