#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');
const { UncontrolledTextInput } = require('ink-text-input');

const Select = importJsx('../ui-modules/select');

const { config, CONF_ACCESS_TOKENS } = require('../config');

function GetAccessTokens({ onDone }) {
	const existingConfig = React.useRef(config.get(CONF_ACCESS_TOKENS));
	const [askForTokens, setAskForTokens] = React.useState(false);

	if (!askForTokens && existingConfig.current) {
		console.log('existingConfig.current', existingConfig.current);
		return (
			<Box flexDirection="column" key="access-tokens-found-existing">
				<Text>Found existing Crystallize Access Tokens. Want to use it?</Text>
				<Select
					onChange={(answer) => {
						if (answer.value === 'yes') {
							onDone(existingConfig.current);
						} else {
							if (answer.value === 'remove') {
								config.delete(CONF_ACCESS_TOKENS);
							}
							setAskForTokens(true);
						}
					}}
					options={[
						{
							value: 'yes',
							render: <Text>Yes, please</Text>,
						},
						{
							value: 'no',
							render: <Text>No thanks</Text>,
						},
						{
							value: 'remove',
							render: (
								<Text>Wait, what? Remove the stored access tokens please</Text>
							),
						},
					]}
				/>
			</Box>
		);
	}

	return <AskForAccessTokens onDone={onDone} />;
}

function AskForAccessTokens({ onDone }) {
	const [id, setId] = React.useState('');
	const [secret, setSecret] = React.useState('');
	const [isDone, setIsDone] = React.useState(false);

	React.useEffect(() => {
		if (isDone) {
			onDone({ id, secret });
		}
	}, [isDone, onDone, id, secret]);

	if (id && secret) {
		return (
			<Box flexDirection="column">
				<Text>Would you like to save the access tokens for future use?</Text>
				<Select
					onChange={(answer) => {
						if (answer.value === 'yes') {
							config.set(CONF_ACCESS_TOKENS, { id, secret });
						} else {
							config.delete(CONF_ACCESS_TOKENS);
						}
						setIsDone(true);
					}}
					options={[
						{
							value: 'yes',
							render: <Text>Yes, please</Text>,
						},
						{
							value: 'no',
							render: <Text>No thanks</Text>,
						},
					]}
				/>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Text>
				Please provide Crystallize Access Tokens to bootstrap the tenant
				<Newline />
				<Text dimColor>
					Learn about access tokens:
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
	);
}

module.exports = { GetAccessTokens };
