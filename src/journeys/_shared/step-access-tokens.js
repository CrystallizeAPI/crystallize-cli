#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Newline, Box } = require('ink');
const { UncontrolledTextInput } = require('ink-text-input');

const Select = importJsx('../../ui-modules/select');
const { config, CONF_ACCESS_TOKENS } = require('../../config');
const { createAPICaller } = require('../../cli-utils/fetch-from-crystallize');
const { highlightColor } = require('../../shared');

async function verifyTokens({ id, secret }) {
	const callPIM = createAPICaller('https://pim.crystallize.com/graphql', {
		headers: {
			'X-Crystallize-Access-Token-Id': id,
			'X-Crystallize-Access-Token-Secret': secret,
		},
	});
	try {
		await callPIM({
			query: `
						{
							me {
								id
							}
						}
					`,
		});

		return true;
	} catch (e) {
		return false;
	}
}

function GetAccessTokens({ onDone }) {
	const existingTokens = React.useRef(config.get(CONF_ACCESS_TOKENS));
	const [verifiedExistingTokens, setVerifiedExistingTokens] = React.useState(
		false
	);
	const [askForTokens, setAskForTokens] = React.useState(false);

	React.useEffect(() => {
		async function verifyExistingTokens() {
			const verified = await verifyTokens(existingTokens.current);
			if (!verified) {
				config.delete(CONF_ACCESS_TOKENS);
				existingTokens.current = null;
			}
			setVerifiedExistingTokens(true);
		}

		if (existingTokens.current && !verifiedExistingTokens) {
			verifyExistingTokens();
		}
	});

	if (existingTokens.current && !verifiedExistingTokens) {
		return (
			<Box>
				<Text>Verifying existing Crystallize Access Tokens...</Text>
			</Box>
		);
	}

	if (!askForTokens && existingTokens.current) {
		return (
			<Box flexDirection="column" key="access-tokens-found-existing">
				<Text>Found existing Crystallize Access Tokens. Want to use it?</Text>
				<Select
					compact
					onChange={(answer) => {
						if (answer.value === 'yes') {
							onDone(existingTokens.current);
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
	const [gotValidKeys, setGotValidKeys] = React.useState(false);
	const [invalidKeys, setInvalidKeys] = React.useState(false);

	React.useEffect(() => {
		async function verify() {
			const valid = await verifyTokens({ id, secret });

			if (valid) {
				setInvalidKeys(false);
				setGotValidKeys(true);
			} else {
				setInvalidKeys(true);
				setId('');
				setSecret('');
			}
		}

		if (id && secret) {
			verify();
		}
	}, [id, secret, gotValidKeys]);

	if (gotValidKeys) {
		return (
			<Box flexDirection="column">
				<Text>Would you like to save the access tokens for future use?</Text>
				<Select
					compact
					onChange={(answer) => {
						if (answer.value === 'yes') {
							config.set(CONF_ACCESS_TOKENS, { id, secret });
						} else {
							config.delete(CONF_ACCESS_TOKENS);
						}
						onDone({
							id,
							secret,
						});
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
		<>
			<Box flexDirection="column" marginBottom={1}>
				<Text>
					Please provide Access Tokens to bootstrap the tenant
					<Newline />
					<Text dimColor>
						Learn about access tokens:
						https://crystallize.com/learn/developer-guides/access-tokens
					</Text>
				</Text>
			</Box>
			{invalidKeys && (
				<Box flexDirection="column" marginBottom={1}>
					<Text color={highlightColor}>
						⚠️ Invalid tokens supplied. Please try again ⚠️
					</Text>
				</Box>
			)}
			<Box flexDirection="column">
				{!id ? (
					<>
						<Text>Access Token ID: </Text>
						<UncontrolledTextInput
							key="access-token-id"
							placeholder="access-token-id"
							mask="*"
							onSubmit={(val) => setId(val)}
						/>
					</>
				) : (
					<>
						<Text>Access Token Secret: </Text>
						<UncontrolledTextInput
							key="access-token-secret"
							placeholder="access-token-secret"
							mask="*"
							onSubmit={(val) => setSecret(val)}
						/>
					</>
				)}
			</Box>
		</>
	);
}

module.exports = { GetAccessTokens };
