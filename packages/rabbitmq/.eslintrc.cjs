module.exports = {
	root: true,
	extends: ['../../.eslintrc.cjs'],
	parserOptions: {
		ecmaVersion: 12,
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	overrides: [
		{
			files: ['./lib/store/**/*'],
			rules: {
				'import/exports-last': ['off'],
			},
		},
	],
	settings: {
		react: {
			version: 'detect',
		},
	},
};
