#!/usr/bin/env node
'use strict';

const React = require('react');
const gittar = require('gittar');
const { Text, Box } = require('ink');

const repos = {
	'Next.js': 'crystallize-nextjs-boilerplate#main',
	'Next.js - Content and commerce': 'content-commerce-boilerplate#main',
	Gatsby: 'crystallize-gatsby-boilerplate#main',
	'Nuxt.js - Content and product listing':
		'crystallize-nuxtjs-boilerplate#main',
	'React Native': 'crystallize-react-native-boilerplate#main',
	'Service API - Backend for any of the frontends':
		'service-api-boilerplate#with-cloudflare',
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

			gittar
				.fetch(repo, {
					force: true,
				})
				.then((a) => {
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
			<Text>Downloading the {answers.boilerplate} boilerplate...</Text>
		</Box>
	);
}

module.exports = {
	DownloadProject,
};
