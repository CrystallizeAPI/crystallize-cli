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
  fs.removeSync(path.resolve('.crystallize-greeting'));

  // Remove unnecessary server files
  if (options.useNow) {
    fs.removeSync(path.resolve(projectPath, 'server'));
  } else {
    fs.removeSync(path.resolve(projectPath, 'pages', 'api'));
    fs.removeSync(path.resolve(projectPath, 'now.json'));
  }
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
    GTM_ID: '',
    CRYSTALLIZE_GRAPH_URL_BASE: 'https://api.crystallize.com',
    CRYSTALLIZE_TENANT_ID: options.tenantId,
    MY_CRYSTALLIZE_SECRET_TOKEN_ID: options.crystallizeAccessTokenId,
    MY_CRYSTALLIZE_SECRET_TOKEN: options.crystallizeAccessTokenSecret,
    SECRET: 'secret'
  };

  // include stripe credentials if stripe is selected
  if (options.paymentCredentials.stripeSecretKey) {
    envVars.STRIPE_SECRET_KEY = options.paymentCredentials.stripeSecretKey;
    envVars.STRIPE_PUBLISHABLE_KEY =
      options.paymentCredentials.stripePublishableKey;
  }
  // include klarna credentials if klarna is selected
  if (options.paymentCredentials.klarnaUsername) {
    envVars.KLARNA_USERNAME = options.paymentCredentials.klarnaUsername;
    envVars.KLARNA_PASSWORD = options.paymentCredentials.klarnaPassword;
    envVars.NGROK_URL = options.paymentCredentials.ngrokUrl;
  }

  if (options.sendGridApiKey) {
    envVars.SENDGRID_API_KEY = options.sendGridApiKey;
  }

  if (options.tenantId) {
    envVars.CRYSTALLIZE_TENANT_ID = options.tenantId;
  }

  // Update .env file
  const envFileVars = Object.keys(envVars).map(key => `${key}=${envVars[key]}`);

  fs.writeFileSync(
    path.resolve(projectPath, '.env'),
    envFileVars.join(os.EOL) + os.EOL
  );

  if (options.useNow) {
    // Update now.json
    const nowJson = fs.readFileSync(
      path.resolve(projectPath, 'now.json'),
      'utf-8'
    );
    const nowJsonObj = JSON.parse(nowJson);
    nowJsonObj.env = envVars;

    if (options.sendGridApiKey) {
      nowJsonObj.env.SENDGRID_API_KEY = '@sendgrid-api-key';
    }

    nowJsonObj.env.MY_CRYSTALLIZE_SECRET_TOKEN_ID =
      '@crystallize-access-token-id';
    nowJsonObj.env.MY_CRYSTALLIZE_SECRET_TOKEN =
      '@crystallize-access-token-secret';

    if (options.paymentCredentials.klarnaUsername) {
      nowJsonObj.env.KLARNA_USERNAME = '@klarna-username';
      nowJsonObj.env.KLARNA_PASSWORD = '@klarna-password';
    }

    if (options.paymentCredentials.stripeSecretKey) {
      nowJsonObj.env.STRIPE_SECRET_KEY = '@stripe-secret-key';
      nowJsonObj.env.STRIPE_PUBLISHABLE_KEY = '@stripe-publishable-key';
    }

    fs.writeFileSync(
      path.resolve(projectPath, 'now.json'),
      JSON.stringify(nowJsonObj, null, 2) + os.EOL,
      'utf-8'
    );
  }
};

module.exports = init;
