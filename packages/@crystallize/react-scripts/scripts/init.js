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
    NEXT_PUBLIC_CRYSTALLIZE_TENANT_ID: options.tenantId
  };

  const envLocalVars = {
    JWT_SECRET: 'come-up-with-a-good-secret-here',
    CRYSTALLIZE_SECRET_TOKEN_ID: options.crystallizeAccessTokenId,
    CRYSTALLIZE_SECRET_TOKEN: options.crystallizeAccessTokenSecret
  };

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

  if (options.sendGridApiKey) {
    envLocalVars.SENDGRID_API_KEY = options.sendGridApiKey;
  }

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

  // Update vercel.json
  const vercelJson = fs.readFileSync(
    path.resolve(projectPath, 'vercel.json'),
    'utf-8'
  );
  const vercelJsonObj = JSON.parse(vercelJson);
  vercelJsonObj.env = {};

  vercelJson.build = {
    env: {
      NEXT_PUBLIC_CRYSTALLIZE_TENANT_ID: options.tenantId
    }
  };

  if (options.sendGridApiKey) {
    vercelJsonObj.env.SENDGRID_API_KEY = '@sendgrid-api-key';
  }

  vercelJsonObj.env.CRYSTALLIZE_SECRET_TOKEN_ID =
    '@crystallize-access-token-id';
  vercelJsonObj.env.CRYSTALLIZE_SECRET_TOKEN =
    '@crystallize-access-token-secret';

  if (options.paymentCredentials.klarnaUsername) {
    vercelJsonObj.env.KLARNA_USERNAME = '@klarna-username';
    vercelJsonObj.env.KLARNA_PASSWORD = '@klarna-password';
  }

  if (options.paymentCredentials.stripeSecretKey) {
    vercelJsonObj.env.STRIPE_SECRET_KEY = '@stripe-secret-key';
    vercelJsonObj.build.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
      '@stripe-publishable-key';
  }

  fs.writeFileSync(
    path.resolve(projectPath, 'vercel.json'),
    JSON.stringify(vercelJsonObj, null, 2) + os.EOL,
    'utf-8'
  );
};

module.exports = init;
