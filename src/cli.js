#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const React = require('react');
const importJsx = require('import-jsx');
const { render } = require('ink');
const meow = require('meow');
const execSync = require('child_process').execSync;

const ui = importJsx('./ui');

const cli = meow(
	`
	Usage
		$ @crystallize/cli <project-name>

	Options
		--info, --i Outputs each step info

	Examples
	  $ @crystallize/cli my-ecommerce
`,
	{
		flags: {
			info: {
				type: 'boolean',
				alias: 'i',
			},
		},
	}
);

const desiredProjectName = cli.input[0] || 'crystallize-app';

// Determine project name and path
let projectName = desiredProjectName;
let projectPath;
let freeDirectory = false;
let index = 0;
do {
	try {
		projectPath = path.resolve(projectName);
		fs.statSync(projectPath);
		projectName = `${desiredProjectName}-${index++}`;
	} catch (e) {
		freeDirectory = true;
	}
} while (!freeDirectory);

/**
 * Determines whether yarn is installed.
 */
const shouldUseYarn = (function () {
	try {
		execSync('yarnpkg --version', { stdio: 'ignore' });
		return true;
	} catch (e) {
		return false;
	}
})();

render(
	React.createElement(ui, {
		flags: cli.flags,
		projectName,
		projectPath,
		shouldUseYarn,
	})
);
