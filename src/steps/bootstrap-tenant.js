#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');

const Select = importJsx('../ui-modules/select');

const askIfBootstrapTenant = {
	when({ answers }) {
		return !answers['service-api'];
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
								render: (
									<>
										<Text>No thanks</Text>
									</>
								),
							},
							{
								value: 'yes',
								render: (
									<>
										<Text>Yes, please</Text>
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
};

const bootstrapExampleTenant = [
	{
		when({ answers }) {
			// console.log('answers.bootstrapTenant', answers.bootstrapTenant);
			return answers.bootstrapTenant === 'yes';
		},
		render({ resolveStep }) {
			return (
				<>
					<Box flexDirection="column">
						<Text>What kind of tenant example data would you like?</Text>
						<Select
							onChange={(answer) => resolveStep(answer)}
							options={[
								{
									value: 'furniture',
									render: (
										<>
											<Text>
												furniture
												<Newline />
												Our often used furniture tenant with products, topics,
												grids in multiple languages
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
	},
];

module.exports = {
	stepBootstrapTenant: [askIfBootstrapTenant, ...bootstrapExampleTenant],
};
