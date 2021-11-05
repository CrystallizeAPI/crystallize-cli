#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

function initNextJSContentCommerce({ answers, projectPath }) {
	const envVars = {
		NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER: answers.tenant,
	};

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

# Next build output
.next`
	);

	// Remove boilerplate toolbar
	const appPath = path.resolve(projectPath, 'src/pages/index.js');
	const _app = fs.readFileSync(appPath, 'utf-8');
	const firstParts = _app.split('{/*crystallize-boilerplates-topbar-start*/}');

	// Check for presence of the code
	if (firstParts.length > 1) {
		const secondParts = firstParts[1].split(
			'{/*crystallize-boilerplates-topbar-end*/}'
		);
		fs.writeFileSync(appPath, firstParts[0] + secondParts[1]);
	}
}

module.exports = initNextJSContentCommerce;
