'use strict';

const { logError, logInfo, logWarning } = require('@crystallize/cli-utils');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

/**
 * Initiales a new git repository with an initial commit.
 */
const initialiseRepository = () => {
  logInfo('Initialising git repository');
  try {
    execSync('git init', { stdio: 'ignore' });
    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit"', { stdio: 'ignore' });
  } catch (err) {
    // Perhaps git is not installed
    logWarning('Unable to initialise a git repository, skipping');
    return false;
  }
};

/**
 *
 * @param {string} projectPath The path of the project
 * @param {object} options Options for initial project config
 */
const init = (projectPath, options) => {
  const { useNow, useTypescript } = options;

  const { name: ownPackageName } = require(path.resolve(
    __dirname,
    '..',
    'package.json'
  ));
  const ownPath = path.resolve(projectPath, 'node_modules', ownPackageName);
  const appPackage = require(path.resolve(projectPath, 'package.json'));

  appPackage.scripts = {
    build: 'next build',
    start: 'node ./server'
  };

  appPackage.dependencies = appPackage.dependencies || {};
  appPackage.devDependencies = appPackage.devDependencies || {};

  if (useNow) {
    appPackage.scripts = {
      ...appPackage.scripts,
      deploy: 'now',
      start: 'now dev'
    };
  }

  fs.writeFileSync(
    path.resolve(projectPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  );

  const templatePath = path.resolve(
    ownPath,
    useTypescript ? 'template-typescript' : 'template'
  );

  if (!fs.existsSync(templatePath)) {
    logError(
      'Could not locate the supplied template:',
      chalk.green(templatePath)
    );
    return;
  }

  fs.copySync(templatePath, projectPath);

  configureTemplate(projectPath, options);
  configureEnvironment(projectPath, options);

  initialiseRepository();
};

/**
 * Configures the project by adding, removing, and renaming files as needed.
 *
 * @param {string} projectPath
 * @param {object} options
 */
const configureTemplate = (projectPath, options) => {
  logInfo('Configuring project template');

  // Remove unnecessary server files
  if (options.useNow) {
    fs.removeSync(path.resolve(projectPath, 'server'));
  } else {
    fs.removeSync(path.resolve(projectPath, 'pages', 'api'));
    fs.removeSync(path.resolve(projectPath, 'now.json'));
  }

  // Rename gitignore to .gitignore
  fs.moveSync(
    path.resolve(projectPath, 'gitignore'),
    path.resolve(projectPath, '.gitignore')
  );
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
    CRYSTALLIZE_TENANT_ID: 'demo',
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
    fs.writeFileSync(
      path.resolve(projectPath, 'now.json'),
      JSON.stringify(nowJsonObj, null, 2) + os.EOL,
      'utf-8'
    );
  }
};

module.exports = init;
