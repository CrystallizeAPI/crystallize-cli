#!/usr/bin/env node
'use strict';

const React = require('react');
const { Text, Newline, Box } = require('ink');
const importJsx = require('import-jsx');

const { UncontrolledTextInput } = importJsx('../../ui-modules/ink-text-input');
const { highlightColor } = require('../../shared');
const Tips = importJsx('../../cli-utils/tips');

const {
	stepsBootstrapExampleTenant,
	BootstrapWarning,
	RunBootstrapper,
} = importJsx('../_shared/step-bootstrap-tenant');

const steps = [
	{
		render({ resolveStep }) {
			return (
				<Box flexDirection="column">
					<Text>Enter the tenant identifier you want to bootstrap</Text>
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
		answer({ answers, answer }) {
			if (answer) {
				answers.bootstrapDuration = answer.duration;
			}
		},
	},
	{
		staticMessage({ answers }) {
			return (
				<Box marginY={1}>
					<Text>
						✨ <Text color={highlightColor}>{answers.tenant}</Text> is
						bootstrapped with {answers.bootstrapTenant} example data.
						{answers.bootstrapDuration && (
							<>
								<Newline />
								Duration: {answers.bootstrapDuration}
							</>
						)}
					</Text>
				</Box>
			);
		},
	},
];

const baseAnswers = {
	bootstrapTenant: 'yes',
};

const welcomeMessage = (
	<Box flexDirection="column">
		<Text>
			<Text underline>
				Crystallize - headless commerce for product storytellers
			</Text>
			<Newline />
			<Text>Let's bootstrap a tenant (BETA)</Text>
		</Text>
		<BootstrapWarning />
	</Box>
);

module.exports = {
	baseAnswers,
	welcomeMessage,
	steps,
};
