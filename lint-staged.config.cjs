module.exports = {
	'apps/mobile/**/*.{ts,tsx,cjs}': 'pnpm --filter @mingling/mobile exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',

	'apps/backend/**/*.{ts,tsx,cjs}': 'pnpm --filter @mingling/backend exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',

	'packages/types/**/*.ts': 'pnpm --filter @mingling/types" exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',

	'!({apps,packages})**/*.{ts,js,cjs}': 'eslint -c ./.eslintrc.cjs --fix',
	'**/*.{ts,js,cjs,json,yaml}': 'prettier --write',
};
