#!/usr/bin/env node
'use strict';

const fetch = require('node-fetch');

async function simplyFetchFromGraph({ query, variables }) {
	const body = JSON.stringify({ query, variables });

	const response = await fetch(
		'https://api.crystallize.com/crystallize_marketing/catalogue',
		{
			method: 'post',
			headers: {
				'content-type': 'application/json',
			},
			body,
		}
	);

	if (!response.ok) {
		throw new Error(await response.text());
	}

	return response.json();
}

module.exports = {
	simplyFetchFromGraph,
};
