#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');
const { UncontrolledTextInput } = require('ink-text-input');

const Select = importJsx('../ui-modules/select');

function GetAccessKeys({ onChange }) {
	const [id, setId] = React.useState('');
	const [secret, setSecret] = React.useState('');

	React.useEffect(() => {
		if (id && secret) {
			onChange({ id, secret });
		}
	}, [id, secret, onChange]);

	return (
		<>
			<Box flexDirection="column">
				<Text>
					Please provide Access Keys to bootstrap the tenant
					<Newline />
					<Text dimColor>
						Learn about access keys:
						https://crystallize.com/learn/developer-guides/access-tokens
					</Text>
				</Text>

				{!id ? (
					<>
						<Text>Access Key ID: </Text>
						<UncontrolledTextInput
							key="access-key-id"
							placeholder="access-key-id"
							onSubmit={(val) => setId(val)}
						/>
					</>
				) : (
					<>
						<Text>Access Key Secret: </Text>
						<UncontrolledTextInput
							key="access-key-secret"
							placeholder="access-key-secret"
							onSubmit={(val) => setSecret(val)}
						/>
					</>
				)}
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
	},
	{
		when({ answers }) {
			return answers.bootstrapTenant !== 'no';
		},
		render({ resolveStep }) {
			return <GetAccessKeys onChange={(keys) => resolveStep(keys)} />;
		},
		answer({ answers, answer }) {
			answers.ACCESS_TOKEN_ID = answer.id;
			answers.ACCESS_TOKEN_SECRET = answer.secret;
			console.log(JSON.stringify(answers, null, 1));
		},
	},
];

module.exports = {
	stepBootstrapTenant: [askIfBootstrapTenant, ...bootstrapExampleTenant],
};
