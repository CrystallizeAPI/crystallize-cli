const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function initNextJS({ answers, projectPath }) {
	const envVars = {
		NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER: answers.tenant,
		JWT_SECRET: 'come-up-with-a-super-secret-token-here',
	};

	const envLocalVars = {
		CRYSTALLIZE_SECRET_TOKEN_ID: '',
		CRYSTALLIZE_SECRET_TOKEN: '',
	};

	const appConfig = {
		locales: [],
	};

	// Set payment methods
	appConfig.paymentProviders = answers.paymentMethods;

	// Set locales
	(answers.multilingual || ['en']).forEach(function addToConfig(lng, index) {
		appConfig.locales.push({
			...(index === 0 && { isDefault: true }),
			displayName: lng,
			urlPrefix: answers.multilingual ? lng : '',
			appLanguage: 'en-US',
			crystallizeCatalogueLanguage: lng,
			priceVariant: 'default',
		});
	});

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

	// Update app.config.json file
	fs.writeFileSync(
		path.resolve(projectPath, 'app.config.json'),
		JSON.stringify(appConfig, null, 3)
	);

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

	// Cleanup payment providers
	require(path.resolve(
		projectPath,
		'_repo-utils/cleanup-payment-providers.js'
	));

	// Re-organize files for multilingual
	if (answers.multilingual) {
		const moveThis = [
			'confirmation',
			'index.js',
			// 'search.js',
			'[...catalogue].js',
			'checkout.js',
			'login.js',
		];
		await Promise.all(
			moveThis.map((m) =>
				fs.move(
					path.resolve(projectPath, `src/pages/${m}`),
					path.resolve(projectPath, `src/pages/[locale]/${m}`)
				)
			)
		);

		await fs.move(
			path.resolve(projectPath, `src/pages/_index.multilingual.redirect.js`),
			path.resolve(projectPath, `src/pages/index.js`)
		);
	} else {
		await fs.remove(
			path.resolve(projectPath, `src/pages/_index.multilingual.redirect.js`)
		);
	}
}

module.exports = initNextJS;
