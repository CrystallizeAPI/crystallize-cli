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
}

module.exports = initNextJSContentCommerce;
