'use strict';

const { logInfo, initialiseRepository } = require('@crystallize/cli-utils');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

/**
 *
 * @param {string} projectPath The path of the project
 * @param {object} options Options for initial project config
 */
const init = (projectPath, options) => {
  configureTemplate(projectPath, options);
  configureEnvironment(projectPath, options);
  initialiseRepository(projectPath);
};

/**
 * Configures the project by adding, removing, and renaming files as needed.
 *
 * @param {string} projectPath
 * @param {object} options
 */
const configureTemplate = (projectPath, options) => {
  logInfo('Configuring project template');
  // fs.removeSync(path.resolve('.crystallize-greeting'));

  // Remove unnecessary server files
  // if (!options.useVercel) {
  //   fs.removeSync(path.resolve(projectPath, 'vercel.json'));
  // }
};

/**
 * Configures the environment variables for the project.
 *
 * @param {string} projectPath
 * @param {object} options
 */
const configureEnvironment = async (projectPath, options) => {
  logInfo('Configuring project environment');

  const envVars = {
    NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER: options.tenantId,
    JWT_SECRET: 'come-up-with-a-super-secret-token-here'
  };

  const envLocalVars = {
    CRYSTALLIZE_SECRET_TOKEN_ID: options.crystallizeAccessTokenId,
    CRYSTALLIZE_SECRET_TOKEN: options.crystallizeAccessTokenSecret
  };

  const appConfig = {
    locales: []
  };

  // Set payment methods
  appConfig.paymentProviders = Object.keys(options.paymentMethods);

  // Set locales
  (options.multilingualLanguages || 'en')
    .split(',')
    .forEach(function addToConfig(lng, index) {
      appConfig.locales.push({
        ...(index === 0 && { isDefault: true }),
        displayName: lng,
        urlPrefix: options.multilingualLanguages ? lng : '',
        appLanguage: 'en-US',
        crystallizeCatalogueLanguage: lng,
        defaultCurrency: 'USD'
      });
    });

  // include stripe credentials if stripe is selected
  if (options.paymentCredentials.stripeSecretKey) {
    envLocalVars.STRIPE_SECRET_KEY = options.paymentCredentials.stripeSecretKey;
    envLocalVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
      options.paymentCredentials.stripePublishableKey;
  }
  // include klarna credentials if klarna is selected
  if (options.paymentCredentials.klarnaUsername) {
    envLocalVars.KLARNA_USERNAME = options.paymentCredentials.klarnaUsername;
    envLocalVars.KLARNA_PASSWORD = options.paymentCredentials.klarnaPassword;
  }

  // Include vipps credentials if selected
  if (options.paymentCredentials.vippsClientId) {
    envLocalVars.VIPPS_CLIENT_ID = options.paymentCredentials.vippsClientId;
    envLocalVars.VIPPS_CLIENT_SECRET =
      options.paymentCredentials.vippsClientSecret;
    envLocalVars.VIPPS_MERCHANT_SERIAL =
      options.paymentCredentials.vippsMerchantSerial;
    envLocalVars.VIPPS_SUB_KEY = options.paymentCredentials.vippsSubKey;
  }

  if (options.sendGridApiKey) {
    envLocalVars.SENDGRID_API_KEY = options.sendGridApiKey;
  }

  // Update app.config.json file
  fs.writeFileSync(
    path.resolve(projectPath, 'app.config.json'),
    JSON.stringify(appConfig, null, 3)
  );

  // Update .env file
  fs.writeFileSync(
    path.resolve(projectPath, '.env'),
    Object.keys(envVars)
      .map(key => `${key}=${envVars[key]}`)
      .join(os.EOL) + os.EOL
  );

  // Update .env.local file
  fs.writeFileSync(
    path.resolve(projectPath, '.env.local'),
    Object.keys(envLocalVars)
      .map(key => `${key}=${envLocalVars[key]}`)
      .join(os.EOL) + os.EOL
  );

  // Cleanup payment providers
  require(path.resolve(
    projectPath,
    '_repo-utils/cleanup-payment-providers.js'
  ));
};

module.exports = init;
