module.exports = {
	'apps/mobile/**/*.{ts,tsx,cjs}': 'pnpm --filter @mingling/mobile exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',

	'apps/backend/**/*.{ts,tsx,cjs}': 'pnpm --filter @mingling/backend exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',
	'apps/notifications-service/**/*.{ts,tsx,cjs}':
		'pnpm --filter @mingling/notifications-service exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',

	'packages/types/**/*.ts': 'pnpm --filter @mingling/types" exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',
	'packages/database/**/*.ts': 'pnpm --filter @mingling/database" exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',
	'packages/redis/**/*.ts': 'pnpm --filter @mingling/redis" exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',
	'packages/socket/**/*.ts': 'pnpm --filter @mingling/socket" exec eslint -c ./.eslintrc.cjs --ignore-path ./.eslintignore --fix',

	'!({apps,packages})**/*.{ts,js,cjs}': 'eslint -c ./.eslintrc.cjs --fix',
	'**/*.{ts,js,cjs,json,yaml}': 'prettier --write',
};
