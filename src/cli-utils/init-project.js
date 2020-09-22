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
	'Unpacking...',
	'Installing...',
	'Preparing project...',
	'Looking for car keys...',
	'Huh, internet is slow today...',
	'Wow, node_modules is getting big...',
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
		const interval = setInterval(() => {
			setFeedbackIndex((f) => {
				let newI = f + 1;
				if (newI === feedbacks.length) {
					newI = 0;
				}
				return newI;
			});
		}, 15000);
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

			exec(
				shouldUseYarn ? 'yarnpkg install' : 'npm install',
				{
					stdio: flags.info ? 'inherit' : 'ignore',
				},
				async function (err) {
					if (answers.nextjs) {
						await require('./init-nextjs')(allProps);
					} else if (answers.gatsby) {
						await require('./init-gatsby')(allProps);
					}

					resolveStep();
				}
			);
		}
	}, []);

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
