#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text, Box, Newline } = require('ink');

const { UncontrolledTextInput } = importJsx('../ui-modules/ink-text-input');
const Select = importJsx('../ui-modules/select');

function GetMultilingual({ onChange }) {
	const [add, setAdd] = React.useState(false);

	if (add) {
		return (
			<>
				<Box>
					<Box marginRight={1}>
						<Text>Enter the supported languages:</Text>
					</Box>
					<UncontrolledTextInput
						placeholder="en,de"
						onSubmit={(query) => onChange(query ? query.split(',') : ['en'])}
					/>
				</Box>
				<Box flexDirection="column">
					<Text dimColor>
						The language codes needs to match the ones in Crystallize
						<Newline />
						<Text dimColor>
							Read more about it here:
							https://crystallize.com/learn/user-guides/getting-started/configuring-languages
						</Text>
					</Text>
				</Box>
			</>
		);
	}

	return (
		<>
			<Text>Want to add enable multiple languages?</Text>
			<Select
				compact
				initialSelected={1}
				options={[
					{
						label: 'Yes please',
						value: 'yes',
					},
					{
						label: 'No thanks',
						value: 'no',
					},
				]}
				onChange={(item) => {
					if (item.value === 'yes') {
						setAdd(true);
					} else {
						onChange(null);
					}
				}}
			/>
		</>
	);
}

module.exports = GetMultilingual;
