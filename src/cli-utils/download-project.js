#!/usr/bin/env node
'use strict';

const React = require('react');
const gittar = require('gittar');
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
			const repo = `CrystallizeAPI/${repos[answers.boilerplate]}`;

			gittar.fetch(repo).then((a) => {
				if (flags.info) {
					console.log(a);
				}

				gittar.extract(repo, projectPath);

				setTimeout(resolveStep, 2000);
			});
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
