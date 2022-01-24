#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');
const { UncontrolledTextInput } = require('ink-text-input');

const { createAPICaller } = require('../../cli-utils/fetch-from-crystallize');
const Select = importJsx('../../ui-modules/select');
const { highlightColor } = require('../../shared');
const { bootstrapTenant } = require('../_shared/bootstrap-tenant');
const { GetAccessTokens } = importJsx('./step-access-tokens');

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

function BootstrapWarning() {
	return (
		<Box
			marginTop={1}
			marginBottom={1}
			flexDirection="column"
			borderStyle="classic"
			paddingX={1}
		>
			<Box>
				<Text>
					<Text underline>WARNING</Text>: this will
				</Text>
			</Box>
			<Text>
				- Alter your tenant
				<Newline />
				- Use your bandwidth to upload data
				<Newline />- Use the API count and bandwidth metrics for your tenant
			</Text>
		</Box>
	);
}

function EnsureTenantAccess({ answers, onDone }) {
	const [checking, setChecking] = React.useState(true);
	const [tenant, setTenant] = React.useState(answers.tenant);

	const callPIM = React.useMemo(
		() =>
			createAPICaller('https://pim.crystallize.com/graphql', {
				headers: {
					'X-Crystallize-Access-Token-Id': answers.ACCESS_TOKEN_ID,
					'X-Crystallize-Access-Token-Secret': answers.ACCESS_TOKEN_SECRET,
				},
			}),
		[answers.ACCESS_TOKEN_ID, answers.ACCESS_TOKEN_SECRET]
	);

	React.useEffect(() => {
		(async function check() {
			setChecking(true);

			const r = await callPIM({
				query: `
					{
						me {
							tenants {
								tenant {
									identifier
								}
							}
						}
					}
				`,
			});

			const tenants = r.data.me.tenants.map((t) => t.tenant.identifier);
			if (tenants.includes(tenant)) {
				onDone(tenant);
			} else {
				setChecking(false);
			}
		})();
	}, [tenant, callPIM, onDone]);

	if (checking) {
		return (
			<Box>
				<Text>Checking access to tenant "{tenant}"...</Text>
			</Box>
		);
	}

	return (
		<>
			<Box>
				<Text>You have no access to tenant "{tenant}"</Text>
			</Box>
			<Box>
				<Box marginRight={1}>
					<Text>Enter the identifier to a tenant that you have access to:</Text>
				</Box>
				<UncontrolledTextInput
					placeholder={tenant}
					onSubmit={(tenant) => setTenant(tenant)}
				/>
			</Box>
		</>
	);
}

const askIfBootstrapTenant = {
	when({ answers }) {
		return answers.useOwnTenant;
	},
	render({ resolveStep }) {
		return (
			<>
				<Box flexDirection="column">
					<Text>
						Would you like to bootstrap your tenant with example data?
						<Newline />
						<Text dimColor>
							This would populate your tenant with shapes, items, topics and
							more
						</Text>
					</Text>
					<BootstrapWarning />
					<Select
						onChange={(answer) => resolveStep(answer.value)}
						compact
						options={[
							{
								value: 'no',
								render: <Text>No thanks</Text>,
							},
							{
								value: 'yes',
								render: <Text>Yes please</Text>,
							},
						]}
					/>
				</Box>
			</>
		);
	},
	answer({ answers, answer }) {
		answers.bootstrapTenant = answer;

		// Automatically pick the correct tenant based on the boilerplate
		switch (answers.boilerplate) {
			case 'Next.js': {
				answers.bootstrapTenant = 'furniture';
				break;
			}
			case 'Next.js - Content and commerce': {
				answers.bootstrapTenant = 'voyage';
				break;
			}
			case 'Next.js - Subscription Commerce': {
				answers.bootstrapTenant = 'photofinder';
				break;
			}
			case 'Next.js - Conference': {
				answers.bootstrapTenant = 'conference-boilerplate';
				break;
			}
		}
	},
};

const stepsBootstrapExampleTenant = [
	{
		when({ answers }) {
			return answers.bootstrapTenant === 'yes';
		},
		render({ resolveStep }) {
			return (
				<>
					<Box flexDirection="column">
						<Text>What kind of tenant data would you like?</Text>
						<Select
							onChange={(answer) => resolveStep(answer.value)}
							options={[
								{
									value: 'furniture',
									render: (
										<>
											<Text>
												furniture
												<Newline />
												Retail commerce, with different kinds of products. Some
												stories to go along with it in multiple languages.
												<Newline />
												<Text dimColor>
													Example implementation:
													https://furniture.superfast.shop
												</Text>
											</Text>
										</>
									),
								},
								{
									value: 'voyage',
									render: (
										<>
											<Text>
												voyage
												<Newline />
												Content heavy with a story driven ecommerce
												<Newline />
												<Text dimColor>
													Example implementation: https://voyage.superfast.shop
												</Text>
											</Text>
										</>
									),
								},
								{
									value: 'photofinder',
									render: (
										<>
											<Text>
												photofinder
												<Newline />
												Software As A Service (SAAS), giving access to digital
												photographs. Perfectly matched to work with the SAAS
												boilerplate.
												<Newline />
												<Text dimColor>
													Example implementation:
													https://photofinder.superfast.shop
												</Text>
											</Text>
										</>
									),
								},
								{
									value: 'conference',
									render: (
										<>
											<Text>
												Conference
												<Newline />
												Conference boilerplate.
												<Newline />
												<Text dimColor>
													Example implementation:
													https://conference-boilerplate.netlify.app/
												</Text>
											</Text>
										</>
									),
								},
							]}
						/>
					</Box>
				</>
			);
		},
		answer({ answers, answer }) {
			answers.bootstrapTenant = answer;
		},
		staticMessage({ answers }) {
			return (
				<Text>
					Bootstrapped with example tenant{' '}
					<Text color={highlightColor}>{answers.bootstrapTenant}</Text>
				</Text>
			);
		},
	},
	{
		when({ answers }) {
			return answers.bootstrapTenant !== 'no';
		},
		render({ resolveStep }) {
			return <GetAccessTokens onDone={(tokens) => resolveStep(tokens)} />;
		},
		answer({ answers, answer }) {
			answers.ACCESS_TOKEN_ID = answer.id;
			answers.ACCESS_TOKEN_SECRET = answer.secret;
		},
	},
	{
		when({ answers }) {
			return answers.bootstrapTenant !== 'no';
		},
		render({ answers, resolveStep }) {
			return <EnsureTenantAccess onDone={resolveStep} answers={answers} />;
		},
		answer({ answers, answer }) {
			answers.tenant = answer;
		},
	},
];

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

module.exports = {
	BootstrapWarning,
	RunBootstrapper,
	stepsBootstrapExampleTenant,
	stepBootstrapTenant: [askIfBootstrapTenant, ...stepsBootstrapExampleTenant],
};
