#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');
const { Bootstrapper, EVENT_NAMES } = require('@crystallize/import-utilities');

const Select = importJsx('../ui-modules/select');
const { highlightColor } = require('../shared');
const { GetAccessTokens } = importJsx('./access-tokens');

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
								render: <Text>Yes, please</Text>,
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

const bootstrapExampleTenant = [
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
];

function bootstrapTenant({ answers }) {
	return new Promise((resolve) => {
		try {
			const spec = fs.readFileSync(
				`../steps/specs/${answers.bootstrapTenant}.json`,
				'utf-8'
			);
			if (spec) {
				const bootstrapper = new Bootstrapper();

				bootstrapper.setAccessToken(
					answers.ACCESS_TOKEN_ID,
					answers.ACCESS_TOKEN_SECRET
				);

				bootstrapper.setTenantIdentifier(answers.tenant);

				bootstrapper.start();

				bootstrapper.on(EVENT_NAMES.DONE, resolve);
			}
		} catch (e) {
			console.log(e);
			resolve();
		}
	});
}

module.exports = {
	bootstrapTenant,
	stepBootstrapTenant: [askIfBootstrapTenant, ...bootstrapExampleTenant],
};
