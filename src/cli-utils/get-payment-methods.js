#!/usr/bin/env node
'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Text } = require('ink');

const Select = importJsx('../ui-modules/select');
const MultiSelect = importJsx('../ui-modules/multi-select');

function GetPaymentMethods({ onChange }) {
	const [add, setAdd] = React.useState(false);

	if (add) {
		return (
			<>
				<Text>Which payment providers?</Text>
				<MultiSelect
					compact
					options={[
						{
							label: 'Stripe',
							value: 'stripe',
							checked: true,
						},
						{
							label: 'Mollie',
							value: 'mollie',
							checked: true,
						},
						{
							label: 'Klarna',
							value: 'klarna',
							checked: true,
						},
						{
							label: 'Vipps',
							value: 'vipps',
							checked: true,
						},
					]}
					onChange={(items) => onChange(items.map((i) => i.value))}
				/>
			</>
		);
	}

	return (
		<>
			<Text>Want to add payment methods?</Text>
			<Select
				compact
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
						onChange([]);
					}
				}}
			/>
		</>
	);
}

module.exports = GetPaymentMethods;
