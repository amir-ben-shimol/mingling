const inflintConfig = {
	aliases: {
		'[UIComponent]': `UI([A-Z][a-z0-9]+)((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?`,
	},
	rules: {
		'apps/mobile/src/lib/{data,types,utils,helpers}/**/*': [2, 'kebab-case'],
		'apps/mobile/src/lib/{hooks,providers}/**/*': [2, 'camelCase'],
		'apps/mobile/src/components/{layouts,modules}/*': [2, 'PascalCase.Point'],
		'apps/mobile/src/components/ui/*': [2, '[UIComponent]'],

		'packages/types/lib/types/**/*': [2, 'kebab-case'],
	},
};

module.exports = inflintConfig;
