#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function initNuxtJS({ answers, projectPath }) {
	try {
		const envVars = {
			CRYSTALLIZE_TENANT_IDENTIFIER: answers.tenant,
			SERVICE_API_URL: answers.serviceAPIURL,
			SITE_URL: '<https://your-public-site-domain>',
		};

		// Set locale
		const lng = answers.locale || 'en';

		// Update app.config.json file.
		fs.writeFileSync(
			path.resolve(projectPath, 'app.config.json'),
			JSON.stringify(
				{
					locale: {
						locale: lng,
						displayName: lng,
						appLanguage: 'en-US',
						crystallizeCatalogueLanguage: lng,
						crystallizePriceVariant: 'default',
					},
				},
				null,
				3
			)
		);

		// Update .env file
		fs.writeFileSync(
			path.resolve(projectPath, '.env'),
			Object.keys(envVars)
				.map((key) => `${key}=${envVars[key]}`)
				.join(os.EOL) + os.EOL
		);

		// Add a sensible .gitignore
		fs.writeFileSync(
			path.resolve(projectPath, '.gitignore'),
			`${require('./default-gitignore')}

# nuxt.js build output
.nuxt

# Nuxt generate
dist

# vuepress build output
.vuepress/dist`
		);
	} catch (error) {
		console.log(error);
	}
}

module.exports = initNuxtJS;
