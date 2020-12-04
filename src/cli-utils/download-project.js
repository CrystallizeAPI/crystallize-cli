'use strict';

const React = require('react');
const degit = require('degit');
const { Text, Box } = require('ink');
// const Spinner = require('ink-spinner').default;

const repos = {
	'Next.js': 'crystallize-nextjs-boilerplate#main',
	'Next.js - Content and commerce': 'content-commerce-boilerplate#main',
	Gatsby: 'crystallize-gatsby-boilerplate#main',
	'Nuxt.js': 'crystallize-nuxtjs-boilerplate#main',
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
				.then(resolveStep)
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
