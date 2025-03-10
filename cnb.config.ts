import type { CnbConfig } from 'cnb';

const config: CnbConfig = {
	branchTypes: ['feat', 'fix', 'chore', 'style'],
	maxDescriptionLength: 20,
	skipTicketId: true,
};

export default config;
