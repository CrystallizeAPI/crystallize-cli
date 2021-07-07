#!/usr/bin/env node
'use strict';

const React = require('react');
const { Text, Newline, Box } = require('ink');
const importJsx = require('import-jsx');
const { UncontrolledTextInput } = require('ink-text-input');

const { highlightColor } = require('../../shared');
const Tips = importJsx('../../cli-utils/tips');
const { bootstrapTenant } = require('../_shared/bootstrap-tenant');
const { stepsBootstrapExampleTenant } = importJsx(
	'../_shared/step-bootstrap-tenant'
);

function RunBootstrapper({ answers, onDone }) {
	const [status, setStatus] = React.useState('Initiating...');

	React.useEffect(() => {
		(async function go() {
			await bootstrapTenant({
				tenant: answers.tenant,
				tenantSpec: answers.bootstrapTenant,
				id: answers.ACCESS_TOKEN_ID,
				secret: answers.ACCESS_TOKEN_SECRET,
				onUpdate(a) {
					setStatus(`Bootstrapping ${a.toLowerCase()}...`);
				},
			});
			onDone();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Text>{status}</Text>;
}

const steps = [
	{
		render({ resolveStep }) {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Which tenant would you like to bootstrap?</Text>
					</Box>
					<UncontrolledTextInput
						placeholder="my-tenant-identifier"
						onSubmit={resolveStep}
					/>
				</Box>
			);
		},
		answer({ answers, answer }) {
			answers.tenant = answer;
		},
		staticMessage({ answers }) {
			return (
				<Text>
					All right, using tenant{' '}
					<Text color={highlightColor}>{answers.tenant}</Text>
				</Text>
			);
		},
	},
	...stepsBootstrapExampleTenant,
	{
		render({ answers, resolveStep }) {
			return (
				<>
					<Text>Please wait. This will take a few minutes...</Text>
					<RunBootstrapper answers={answers} onDone={resolveStep} />
					<Newline />
					<Tips />
				</>
			);
		},
	},
	{
		staticMessage({ answers }) {
			return (
				<Text>
					✨ <Text color={highlightColor}>{answers.tenant}</Text> is
					bootstrapped with {answers.bootstrapTenant} example data
				</Text>
			);
		},
	},
];

const baseAnswers = {
	bootstrapTenant: 'yes',
};

const welcomeMessage = (
	<>
		<Text>
			<Text underline>Crystallize Headless PIM</Text>
			<Newline />
			<Text>Let's bootstrap a tenant</Text>
			<Newline />
			<Text dimColor>
				⚠️ Warning: it will take a few minutes and use your bandwidth to upload
				data to your tenant
			</Text>
		</Text>
	</>
);

module.exports = {
	baseAnswers,
	welcomeMessage,
	steps,
};
