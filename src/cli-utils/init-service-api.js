#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function initServiceAPI({ answers, projectPath }) {
	const envVars = {
		CRYSTALLIZE_TENANT_IDENTIFIER: answers.tenant,
	};

	const envLocalVars = {
		JWT_SECRET: 'super-secret-jwt-token',
		EMAIL_FROM: 'example@crystallize.com',
		CRYSTALLIZE_SECRET_TOKEN: '',
		CRYSTALLIZE_SECRET_TOKEN_ID: '',
		KLARNA_PASSWORD: '',
		KLARNA_USERNAME: '',
		STRIPE_SECRET_KEY: '',
		STRIPE_PUBLISHABLE_KEY: '',
		VIPPS_CLIENT_ID: '',
		VIPPS_CLIENT_SECRET: '',
		VIPPS_MERCHANT_SERIAL: '',
		VIPPS_SUB_KEY: '',
		SENDGRID_API_KEY: '',
		MOLLIE_API_KEY: '',
		SERVICE_CALLBACK_HOST: '',
	};

	// Copy the selected platform template up to root
	fs.copySync(
		path.resolve(projectPath, 'platform-templates/vercel'),
		path.resolve(projectPath, '.'),
		{ overwrite: true, recursive: true }
	);

	// Delete the platform template
	fs.removeSync(path.resolve(projectPath, 'platform-templates'));

	/*
	// Include Stripe credentials if stripe is selected
	if (answers.paymentMethods.includes('stripe')) {
		envLocalVars.STRIPE_SECRET_KEY = '';
		envLocalVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = '';
	}

	// Include Klarna credentials if klarna is selected
	if (answers.paymentMethods.includes('klarna')) {
		envLocalVars.KLARNA_USERNAME = '';
		envLocalVars.KLARNA_PASSWORD = '';
	}

	// Include Vipps credentials if selected
	if (answers.paymentMethods.includes('vipps')) {
		envLocalVars.VIPPS_CLIENT_ID = '';
		envLocalVars.VIPPS_CLIENT_SECRET = '';
		envLocalVars.VIPPS_MERCHANT_SERIAL = '';
		envLocalVars.VIPPS_SUB_KEY = '';
	}

	// Include Mollie credentials if selected
	if (answers.paymentMethods.includes('mollie')) {
		envLocalVars.MOLLIE_API_KEY = '';
	}

	envLocalVars.SENDGRID_API_KEY = '';
	*/

	// Update .env file
	fs.writeFileSync(
		path.resolve(projectPath, '.env'),
		Object.keys(envVars)
			.map((key) => `${key}=${envVars[key]}`)
			.join(os.EOL) + os.EOL
	);

	// Update .env.local file
	fs.writeFileSync(
		path.resolve(projectPath, '.env.local'),
		Object.keys(envLocalVars)
			.map((key) => `${key}=${envLocalVars[key]}`)
			.join(os.EOL) + os.EOL
	);
}

module.exports = initServiceAPI;
