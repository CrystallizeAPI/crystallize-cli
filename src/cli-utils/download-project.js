'use strict';

const React = require('react');
const degit = require('degit');
const fs = require('fs-extra');
const { Text, Box } = require('ink');
// const Spinner = require('ink-spinner').default;

const repos = {
	'Next.js': 'crystallize-nextjs-boilerplate#main',
	'Next.js - Magazine': 'next-with-crystallize-example#examples-crystallize',
	Gatsby: 'crystallize-gatsby-boilerplate#main',
	'React Native': 'crystallize-react-native-boilerplate#master',
};

function DownloadProject({
	answers,
	projectName,
	projectPath,
	resolveStep,
	flags,
}) {
	React.useEffect(() => {
		if (projectName) {
			const emitter = degit(`CrystallizeAPI/${repos[answers.boilerplate]}`, {
				cache: false,
				force: true,
				verbose: true,
			});

			if (flags.info) {
				emitter.on('info', (info) => {
					console.log(info.message);
				});
			}

			emitter
				.clone(projectName)
				.then(() => {
					if (answers.boilerplate === 'Next.js - Magazine') {
						const tmpPath = `${projectPath}-${Date.now()}`;
						fs.renameSync(projectPath, tmpPath);
						fs.moveSync(
							`${tmpPath}/examples/commerce-crystallize`,
							projectPath
						);
						fs.rmdirSync(tmpPath, {
							recursive: true,
						});
					}

					setTimeout(() => resolveStep(), 50);
				})
				.catch((e) => console.log(e));
		}
	}, [answers.boilerplate, flags.info, projectName, projectPath, resolveStep]);

	return (
		<Box>
			{/* <Box marginRight={1}>
				<Spinner type="dots" />
			</Box> */}
			<Text>Downloading the {answers.boilerplate} boilerplate...</Text>
		</Box>
	);
}

module.exports = {
	DownloadProject,
};
