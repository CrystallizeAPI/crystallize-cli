#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');
const { UncontrolledTextInput } = require('ink-text-input');

const { createAPICaller } = require('../../cli-utils/fetch-from-crystallize');
const Select = importJsx('../../ui-modules/select');
const { highlightColor } = require('../../shared');
const { GetAccessTokens } = importJsx('./step-access-tokens');

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
						<Text dimColor>This would add shapes, items, topics and more</Text>
						<Newline />
						<Text dimColor>
							⚠️ Warning: this will alter the tenant and use your bandwidth to
							upload data to the tenant
						</Text>
					</Text>
					<Select
						onChange={(answer) => resolveStep(answer.value)}
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
												A few different kinds of products. Some stories to go
												along with it in multiple languages.
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
												Content heavy tenant with a story driven ecommerce
												<Newline />
												<Text dimColor>
													Example implementation: https://voyage.superfast.shop
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

module.exports = {
	stepsBootstrapExampleTenant,
	stepBootstrapTenant: [askIfBootstrapTenant, ...stepsBootstrapExampleTenant],
};
