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
	const [shapesDone, setShapesDone] = React.useState(false);
	const [priceVariantsDone, setPriceVariantsDone] = React.useState(false);
	const [languagesDone, setLanguagesDone] = React.useState(false);
	const [vatTypesDone, setVatTypesDone] = React.useState(false);
	const [topicsDone, setTopicsDone] = React.useState(false);
	const [itemsDone, setItemsDone] = React.useState(false);
	const [itemsCount, setItemsCount] = React.useState(0);
	const [gridsDone, setGridsDone] = React.useState(false);

	React.useEffect(() => {
		(async function go() {
			const result = await bootstrapTenant({
				tenant: answers.tenant,
				tenantSpec: answers.bootstrapTenant,
				id: answers.ACCESS_TOKEN_ID,
				secret: answers.ACCESS_TOKEN_SECRET,
				onUpdate(a) {
					if (a.items) {
						setItemsCount((c) => c + 1);
					} else if (a.done) {
						switch (a.done) {
							case 'shapes':
								return setShapesDone(true);
							case 'priceVariants':
								return setPriceVariantsDone(true);
							case 'languages':
								return setLanguagesDone(true);
							case 'vatTypes':
								return setVatTypesDone(true);
							case 'topics':
								return setTopicsDone(true);
							case 'items':
								return setItemsDone(true);
							case 'grids':
								return setGridsDone(true);
						}
					}
				},
			});
			onDone(result);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box>
			<Text>
				Languages {languagesDone ? '✔︎' : '...'}
				<Newline />
				Shapes {shapesDone ? '✔︎' : '...'}
				<Newline />
				Price Variants {priceVariantsDone ? '✔︎' : '...'}
				<Newline />
				Vat Types {vatTypesDone ? '✔︎' : '...'}
				<Newline />
				Topics {topicsDone ? '✔︎' : '...'}
				<Newline />
				Items{' '}
				{itemsDone
					? '✔︎'
					: itemsCount === 0
					? '...'
					: `(${itemsCount} processed)...`}
				<Newline />
				Grids {gridsDone ? '✔︎' : '...'}
			</Text>
		</Box>
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
			<Text>Let's bootstrap a tenant</Text>
			<Newline />
			<Text dimColor>
				⚠️ Warning: this will alter the tenant and use your bandwidth to upload
				data to the tenant
			</Text>
		</Text>
	</>
);

module.exports = {
	baseAnswers,
	welcomeMessage,
	steps,
};
