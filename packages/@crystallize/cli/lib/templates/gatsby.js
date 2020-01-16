'use strict';

const {
  logDebug,
  logInfo,
  logSuccess,
  shouldUseYarn,
  cloneRepository,
  installNodeDependencies
} = require('@crystallize/cli-utils');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { boilerplates } = require('../boilerplate');

/**
 * Creates a new Gatsby + React project.
 *
 * @param {string} projectName The name of the project
 * @param {string} projectPath The path of the project
 * @param {string} tenantId The id of the shop to use
 * @param {object} flags Flags specified via the cli
 */
const createGatsbyProject = async (
  projectName,
  projectPath,
  tenantId,
  flags
) => {
  const templateOptions = {
    tenantId
  };

  cloneRepository(boilerplates['gatsby'], projectPath);
  logInfo(`Creating a new Crystallize project in ${chalk.green(projectPath)}`);

  process.chdir(projectPath);
  fs.removeSync(path.resolve('package-lock.json'));

  const oldPackageJson = fs.readFileSync(path.resolve('package.json'), 'utf-8');
  const oldPackageJsonObj = JSON.parse(oldPackageJson);
  const scripts = oldPackageJsonObj.scripts;

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts,
    dependencies: {
      ...oldPackageJsonObj.dependencies
    },
    devDependencies: {
      ...oldPackageJsonObj.devDependencies
    }
  };

  fs.writeFileSync(
    path.resolve(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  // Install dependencies
  const useYarn = !flags.useNpm && shouldUseYarn();
  installNodeDependencies(useYarn);

  // Setup Crystallize config
  fs.writeFileSync(
    path.resolve('crystallize-config'),
    [
      'CRYSTALLIZE_API_BASE=https://graph.crystallize.com',
      `CRYSTALLIZE_TENANT_ID=${tenantId}`
    ].join(os.EOL),
    'utf-8'
  );

  showInstructions(projectPath, useYarn, templateOptions);
};

/**
 * Shows the postinstall instructions on the screen, such as how to run the
 * project in dev and prod modes.
 *
 * @param {string} projectPath The path of the project
 * @param {string} useYarn Should the commands be shown as yarn or npm?
 * @param {object} templateOptions User specified template configuration
 */
const showInstructions = (projectPath, useYarn, templateOptions) => {
  console.log();
  logSuccess(`Done! Your project has been created in ${projectPath}`);
  console.log();
};

module.exports = { createGatsbyProject };
