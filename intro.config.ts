import type { IntroCliConfig } from 'intro-cli';

const config: IntroCliConfig = {
	bigTitle: {
		label: 'Mingling',
		color: 'blue',
		bold: true,
	},
	welcomeMessage: {
		label: 'Welcome to mingling repository!!',
		color: 'green',
		bold: true,
	},
	welcomeDivider: {
		label: '\n🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨\n',
		color: 'yellowBright',
		bold: false,
	},
	rulesTitle: {
		label: 'Please follow these guidelines:',
		color: 'redBright',
		bold: true,
	},
	rules: [
		{
			emoji: '🛂',
			label: {
				label: 'Follow the coding standards at all times.',
				color: 'magentaBright',
				bold: true,
			},
		},
		{
			emoji: '🚀',
			label: {
				label: 'Make sure Github actions tests are passed before asking for PR',
				color: 'magentaBright',
				bold: true,
			},
		},
		{
			emoji: '📦',
			label: {
				label: 'Commit messages should be clear and follow our guidelines.',
				color: 'magentaBright',
				bold: true,
			},
		},
	],
};

export default config;
