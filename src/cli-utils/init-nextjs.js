#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function initNextJS({ answers, projectPath }) {
	const envVars = {
		NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER: answers.tenant
	};

	const envLocalVars = {
		CRYSTALLIZE_SECRET_TOKEN_ID: '',
		CRYSTALLIZE_SECRET_TOKEN: '',
	};

	const appConfig = {
		locales: [],
	};

	// Set locales
	const locales = answers.multilingual || ['en'];
	locales.forEach(function addToConfig(lng) {
		appConfig.locales.push({
			locale: lng,
			displayName: lng,
			appLanguage: 'en-US',
			crystallizeCatalogueLanguage: lng,
			crystallizePriceVariant: 'default',
		});
	});

	let nextJsConfigContent = fs.readFileSync(
		path.resolve(projectPath, 'next.config.js'),
		'utf-8'
	);
	nextJsConfigContent = nextJsConfigContent.replace(
		`locales: ['en']`,
		`locales: ${JSON.stringify(locales)}`
	);
	nextJsConfigContent = nextJsConfigContent.replace(
		`defaultLocale: 'en'`,
		`defaultLocale: '${locales[0]}'`
	);
	fs.writeFileSync(
		path.resolve(projectPath, 'next.config.js'),
		nextJsConfigContent,
		'utf-8'
	);

	// Update app.config.json file
	fs.writeFileSync(
		path.resolve(projectPath, 'app.config.json'),
		JSON.stringify(appConfig, null, 3)
	);

	// Update .env file
	fs.writeFileSync(
		path.resolve(projectPath, '.env'),
		Object.keys(envVars)
			.map((key) => `${key}=${envVars[key]}`)
			.join(os.EOL) + os.EOL
	);

	// Update .env.local file
	fs.writeFileSync(
		path.resolve(projectPath, '.env.local'),
		Object.keys(envLocalVars)
			.map((key) => `${key}=${envLocalVars[key]}`)
			.join(os.EOL) + os.EOL
	);

	// Add a sensible .gitignore
	fs.writeFileSync(
		path.resolve(projectPath, '.gitignore'),
		`${require('./default-gitignore')}

# Next build output
.next`
	);
}

module.exports = initNextJS;
