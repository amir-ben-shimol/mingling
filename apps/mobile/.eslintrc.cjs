module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['../../.eslintrc.cjs'],
	parserOptions: {
		ecmaFeatures: {
			jsx: false,
		},
		ecmaVersion: 12,
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	rules: {
		'react/style-prop-object': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-require-imports': 'off',
	},
	overrides: [
		{
			files: ['./babel.config.js'],
			rules: {
				'unicorn/no-empty-file': 'off',
			},
		},
	],
	settings: {
		'import/ignore': ['react-native'],
		'react': {
			version: 'detect',
		},
	},
};
