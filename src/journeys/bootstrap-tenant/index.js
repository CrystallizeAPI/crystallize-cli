#!/usr/bin/env node
'use strict';

const React = require('react');
const { Text, Newline, Box } = require('ink');
const importJsx = require('import-jsx');
const { UncontrolledTextInput } = require('ink-text-input');

const { highlightColor } = require('../../shared');
const Tips = importJsx('../../cli-utils/tips');
const { bootstrapTenant } = require('../_shared/bootstrap-tenant');
const { stepsBootstrapExampleTenant, ShowBootstrapWarning } = importJsx(
	'../_shared/step-bootstrap-tenant'
);

function progressText(progress) {
	const arr = [];
	arr.length = 20;
	arr.fill('-');

	const filled = [];
	filled.length = parseInt(progress * 20, 10);
	filled.fill('=');
	arr.splice(0, filled.length, ...filled);

	return `[${arr.join('')}]`;
}

const areaIdToName = new Map();
areaIdToName.set('media', 'Media');
areaIdToName.set('shapes', 'Shapes');
areaIdToName.set('grids', 'Grids');
areaIdToName.set('items', 'Items');
areaIdToName.set('languages', 'Languages');
areaIdToName.set('priceVariants', 'Price variants');
areaIdToName.set('vatTypes', 'VAT types');
areaIdToName.set('topicMaps', 'Topic maps');

function AreaStatus({ id, progress, warnings }) {
	const name = areaIdToName.get(id) || id;

	return (
		<>
			<Box flexDirection="column">
				<Text>
					{progressText(progress)} |{' '}
					{parseInt(progress * 100)
						.toString()
						.padStart('3')}
					% | {name}
				</Text>
			</Box>
			{warnings
				? warnings.map((warn, index) => (
						<Box key={index} marginLeft={1}>
							<Text>
								⚠ {warn.message} ({warn.code})
							</Text>
						</Box>
				  ))
				: null}
		</>
	);
}

function RunBootstrapper({ answers, onDone }) {
	const [status, setStatus] = React.useState(null);

	React.useEffect(() => {
		(async function go() {
			const result = await bootstrapTenant({
				tenant: answers.tenant,
				tenantSpec: answers.bootstrapTenant,
				id: answers.ACCESS_TOKEN_ID,
				secret: answers.ACCESS_TOKEN_SECRET,
				onUpdate(status) {
					setStatus(status);
				},
			});
			onDone(result);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!status) {
		return null;
	}

	const keys = Object.keys(status);
	const dynamicStatuses = keys.filter((k) => !['media', 'items'].includes(k));

	return (
		<>
			{dynamicStatuses.map((area) => (
				<AreaStatus key={area} id={area} {...status[area]} />
			))}
			<AreaStatus id="media" {...status.media} />
			<AreaStatus id="items" {...status.items} />
		</>
	);
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
	<>
		<Text>
			<Text underline>Crystallize Headless PIM</Text>
			<Newline />
			<Text>Let's bootstrap a tenant (BETA)</Text>
		</Text>
		<ShowBootstrapWarning />
	</>
);

module.exports = {
	baseAnswers,
	welcomeMessage,
	steps,
};
