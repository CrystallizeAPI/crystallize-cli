#!/usr/bin/env node
'use strict';

const fetch = require('node-fetch');

function createAPICaller(uri, { headers } = {}) {
	return async function ({ query, variables }) {
		const body = JSON.stringify({ query, variables });

		const response = await fetch(uri, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				...headers,
			},
			body,
		});

		if (!response.ok) {
			throw new Error(await response.text());
		}

		return response.json();
	};
}

const callCrystallizeMarketingCatalogue = createAPICaller(
	'https://api.crystallize.com/crystallize_marketing/catalogue'
);

module.exports = {
	callCrystallizeMarketingCatalogue,
	createAPICaller,
};
