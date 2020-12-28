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
		if (
			answers.gatsby ||
			answers.nextjs ||
			answers.nuxtjs ||
			answers['nextjs-content-commerce']
		) {
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

			fs.writeFileSync(
				path.resolve(projectPath, 'package.json'),
				JSON.stringify(
					{
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
					},
					null,
					2
				) + os.EOL
			);

			exec(
				shouldUseYarn ? 'yarnpkg install' : 'npm install',
				{
					stdio: flags.info ? 'inherit' : 'ignore',
				},
				async function (err) {
					if (err) {
						process.exit(1);
					}

					if (answers.nextjs) {
						await require('./init-nextjs')(allProps);
					} else if (answers['nextjs-content-commerce']) {
						await require('./init-nextjs-content-commerce')(allProps);
					} else if (answers.gatsby) {
						await require('./init-gatsby')(allProps);
					} else if (answers.nuxtjs) {
						await require('./init-nuxtjs')(allProps);
					}
					resolveStep();
				}
			);
		} else {
			resolveStep();
		}
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
