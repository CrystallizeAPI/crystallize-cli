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
const configureEnvironment = (projectPath, options) => {
  logInfo('Configuring project environment');

  const envVars = {
    GTM_ID: '',
    CRYSTALLIZE_GRAPH_URL_BASE: 'https://graph.crystallize.com',
    CRYSTALLIZE_TENANT_ID: 'teddy-bear-shop',
    SECRET: 'secret'
  };

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
    nowJsonObj.alias = [options.nowAlias];

    fs.writeFileSync(
      path.resolve(projectPath, 'now.json'),
      JSON.stringify(nowJsonObj, null, 2) + os.EOL,
      'utf-8'
    );
  }
};

module.exports = init;
