'use strict';

const React = require('react');
const { Text, Newline, Box } = require('ink');
const importJsx = require('import-jsx');

const { DownloadProject } = importJsx('./cli-utils/download-project');
const { InitProject } = importJsx('./cli-utils/init-project');

const steps = [
	{
		type: 'select',
		message({ projectName }) {
			return (
				<Box>
					<Text>Please select a boilerplate for "{projectName}"</Text>
				</Box>
			);
		},
		options: [
			{
				label: 'Next.js',
				message: (
					<>
						<Text>Next.js</Text>
						<Newline />
						<Text dimColor>React, SSG &amp; SSR, Checkout</Text>
					</>
				),
				value: 'nextjs',
			},
			{
				label: 'Gatsby',
				message: (
					<>
						<Text>Gatsby</Text>
						<Newline />
						<Text dimColor>React, SSG</Text>
					</>
				),
				value: 'gatsby',
			},
			{
				label: 'React Native',
				value: 'rn',
			},
		],
		answer({ answers, answer }) {
			answers[answer.value] = {};
			answers.boilerplate = answer.label;
		},
		staticMessage(props) {
			return (
				<Text>
					All right <Text color="green">{props.answers.boilerplate}</Text> it is
				</Text>
			);
		},
	},
	{
		type: 'select',
		message({ projectName }) {
			return (
				<Text>
					Please select the Crystallize Tenant to use
					<Newline />
					<Text dimColor>
						Don't have a tenant yet? Create one at
						https://crystallize.com/signup
					</Text>
				</Text>
			);
		},
		options: [
			{
				value: 'our-demo-tenant',
				message: (
					<>
						<Text>Our demo tenant (furniture)</Text>
						<Newline />
						<Text dimColor>Lot's of demo data here already</Text>
					</>
				),
			},
			{
				value: 'own-tenant',
				message: (
					<>
						<Text>My own tenant</Text>
					</>
				),
			},
		],
		answer({ answers, answer }) {
			answers.tenant = answer.value;
		},
	},
	{
		type: 'input',
		message() {
			return <Text>Enter your tenant identifier</Text>;
		},
		when({ answers }) {
			return answers.tenant === 'own-tenant';
		},
	},
	{
		type: 'feedback',
		staticMessage(props) {
			return (
				<Text>
					Using tenant <Text color="green">{props.answers.tenant}</Text>
				</Text>
			);
		},
	},
	{
		message(props) {
			return <DownloadProject {...props} />;
		},
	},
	{
		message(props) {
			return <InitProject {...props} />;
		},
	},
];

module.exports = {
	steps,
};
