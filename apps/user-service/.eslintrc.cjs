module.exports = {
	root: true,
	extends: ['../../.eslintrc.cjs'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},

	rules: {
		'import/exports-last': ['off'],
	},

	overrides: [
		{
			files: ['./postcss.config.js', '_templates/**/*.cjs'],
			rules: {
				'unicorn/no-empty-file': 'off',
			},
		},
		{
			files: ['./@types/**/*.d.ts'],
			rules: {
				'@typescript-eslint/consistent-type-definitions': 'off',
			},
		},
	],

	settings: {
		react: {
			version: 'detect',
		},
	},
};
