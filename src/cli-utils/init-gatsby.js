const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function initGatsby({ answers, projectPath }) {
	const appConfig = {
		locales: [],
	};

	// Set locales
	(answers.multilingual || ['en']).forEach(function addToConfig(lng, index) {
		appConfig.locales.push({
			...(index === 0 && { isDefault: true }),
			displayName: lng,
			urlPrefix: answers.multilingual ? lng : '',
			appLanguage: 'en-US',
			crystallizeCatalogueLanguage: lng,
			priceVariant: 'default',
		});
	});

	// Update app.config.json file
	fs.writeFileSync(
		path.resolve(projectPath, 'app.config.json'),
		JSON.stringify(appConfig, null, 3)
	);

	// Setup Crystallize config
	fs.writeFileSync(
		path.resolve(projectPath, '.env'),
		[`GATSBY_CRYSTALLIZE_TENANT_ID=${answers.tenant}`].join(os.EOL),
		'utf-8'
	);
}

module.exports = initGatsby;
