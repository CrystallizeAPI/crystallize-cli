'use strict';

const React = require('react');
const degit = require('degit');
const { Text } = require('ink');

const repos = {
	'Next.js': 'crystallize-nextjs-boilerplate#main',
	Gatsby: 'crystallize-gatsby-boilerplate#main',
	'React Native': 'crystallize-react-native-boilerplate#master',
};

function DownloadProject({ answers, projectName, resolveStep, flags }) {
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
				.then(() => resolveStep())
				.catch((e) => console.log(e));
		}
	}, [projectName, resolveStep]);

	return <Text>Downlading...</Text>;
}

module.exports = {
	DownloadProject,
};
