#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');

const Select = importJsx('../ui-modules/select');

const stepBootstrapTenant = [
	{
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
							<Text dimColor>
								This would add shapes, topics, languages, price variants
							</Text>
						</Text>
						<Select
							onChange={(answer) => resolveStep(answer)}
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
	},
	{
		when({ answers }) {
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
												Example implementation: http://furniture.superfast.shop
												<Newline />
												<Text dimColor>
													Our often used furniture tenant with products, topics,
													grids in multiple languages
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
												Example implementation: http://voyage.superfast.shop
												<Newline />
												<Text dimColor>
													Content heavy tenant with a story driven ecommerce
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

module.exports = { stepBootstrapTenant };
