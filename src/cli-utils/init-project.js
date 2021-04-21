#!/usr/bin/env node
'use strict';

const React = require('react');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { Text, Box } = require('ink');
const exec = require('child_process').exec;
// const Spinner = require('ink-spinner').default;

let began = false;

const feedbacks = [
	'Fetching the dependencies...',
	'Still fetching...',
	'Unpacking...',
	'Preparing files for install...',
	'Installing...',
	'Still installing...',
	'Growing that node_modules...',
	'Looking for car keys...',
	'Looking for the car...',
];

function InitProject(allProps) {
	const {
		answers,
		projectName,
		projectPath,
		resolveStep,
		shouldUseYarn,
		flags,
	} = allProps;
	const [feedbackIndex, setFeedbackIndex] = React.useState(0);

	// Give different feedback messages
	React.useEffect(() => {
		let timeout;
		let ms = 10000;

		function changeFeedback() {
			setFeedbackIndex((f) => {
				let newI = f + 1;
				if (newI === feedbacks.length) {
					newI = 0;
				}

				return newI;
			});

			ms += 3000;
			timeout = setTimeout(changeFeedback, ms);
		}

		timeout = setTimeout(changeFeedback, ms);

		return () => clearTimeout(timeout);
	});

	// Install node deps
	React.useEffect(() => {
		async function go() {
			if (began) {
				return;
			}

			began = true;

			if (answers['service-api']) {
				await require('./init-service-api')(allProps);
			}

			// Navigate to the new folder
			process.chdir(projectPath);

			// Remove any lock files
			fs.removeSync(path.resolve('package-lock.json'));
			fs.removeSync(path.resolve('yarn.lock'));

			// Update the package.json with proper name
			const oldPackageJson = JSON.parse(
				fs.readFileSync(path.resolve('package.json'), 'utf-8')
			);

			if (answers['service-api']) {
				delete oldPackageJson.scripts['dev:boilerplate'];
			}

			fs.writeFileSync(
				path.resolve(projectPath, 'package.json'),
				JSON.stringify(
					{
						...oldPackageJson,
						name: projectName,
						version: '1.0.0',
						private: true,
					},
					null,
					2
				) + os.EOL
			);

			if (answers.nextjs) {
				await require('./init-nextjs')(allProps);
			} else if (answers['nextjs-content-commerce']) {
				await require('./init-nextjs-content-commerce')(allProps);
			} else if (answers.gatsby) {
				await require('./init-gatsby')(allProps);
			} else if (answers.nuxtjs) {
				await require('./init-nuxtjs')(allProps);
			} else if (answers.rn) {
				await require('./init-rn')(allProps);
			}

			exec(
				shouldUseYarn ? 'yarnpkg install' : 'npm install',
				{
					stdio: flags.info ? 'inherit' : 'ignore',
				},
				async function (err) {
					if (err) {
						process.exit(1);
					}

					resolveStep();
				}
			);
		}
		go();
	});

	return (
		<>
			<Box>
				{/* <Box marginRight={1}>
					<Spinner type="dots" />
				</Box> */}
				<Text>{feedbacks[feedbackIndex]}</Text>
			</Box>
		</>
	);
}

module.exports = {
	InitProject,
};
