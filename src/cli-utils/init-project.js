'use strict';

const React = require('react');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { Text } = require('ink');
const execSync = require('child_process').execSync;

let began = false;

const feedbacks = [
	'Downloading modules...',
	'Still downloading modules...',
	'Installing...',
	'Preparing project...',
];

function InitProject({
	answers,
	projectName,
	projectPath,
	resolveStep,
	shouldUseYarn,
	flags,
}) {
	const [feedbackIndex, setFeedbackIndex] = React.useState(0);

	// Give different feedback messages
	React.useEffect(() => {
		const interval = setInterval(() => {
			setFeedbackIndex((f) => f + 1);
		}, 3000);
		return () => clearInterval(interval);
	});

	// Install node deps
	React.useEffect(() => {
		if (answers.gatsby || answers.nextjs) {
			if (began) {
				return;
			}

			began = true;

			// Navigate to the new folder
			process.chdir(projectPath);

			fs.removeSync(path.resolve('package-lock.json'));
			fs.removeSync(path.resolve('yarn.lock'));
			const oldPackageJson = JSON.parse(
				fs.readFileSync(path.resolve('package.json'), 'utf-8')
			);

			const packageJson = {
				...oldPackageJson,
				name: projectName,
				version: '1.0.0',
				private: true,
				dependencies: {
					...oldPackageJson.dependencies,
				},
				devDependencies: {
					...oldPackageJson.devDependencies,
				},
			};

			fs.writeFileSync(
				path.resolve(projectPath, 'package.json'),
				JSON.stringify(packageJson, null, 2) + os.EOL
			);

			execSync(shouldUseYarn ? 'yarnpkg install' : 'npm install', {
				stdio: flags.info ? 'inherit' : 'ignore',
			});

			resolveStep();
		}
	}, []);

	return <Text>{feedbacks[feedbackIndex]}</Text>;
}

module.exports = {
	InitProject,
};
