'use strict';

const { logError, logInfo, logSuccess } = require('@crystallize/cli-utils');
const {
  initialiseRepository,
  cloneRepository
} = require('@crystallize/cli-utils/git');
const chalk = require('chalk');

const remote = 'https://github.com/CrystallizeAPI/';

const boilerplates = {
  nextjs: `${remote}crystallize-nextjs-boilerplate`,
  'react-native': `${remote}crystallize-react-native-boilerplate`,
  flutter: `${remote}crystallize-flutter-boilerplate`
};

/**
 * Clones the remote of the specified boilerplate into the project path and
 * reinitialises the repository with an initial commit.
 *
 * @param {string} projectName The ame of the project
 * @param {string} projectPath The path of the project
 * @param {string} boilerplate The key of the boilerplate to use
 */
const createBoilerplateProject = async (
  projectName,
  projectPath,
  boilerplate
) => {
  const remote = boilerplates[boilerplate];
  if (!remote) {
    logError(
      `The boilerplate "${boilerplate}" does not exist, possible options include:`,
      `"${Object.keys(boilerplates).join('", "')}"`
    );
    return process.exit(0);
  }

  logInfo(
    `Creating project "${projectName}" with boilerplate "${boilerplate}"`
  );

  if (!cloneRepository(remote, projectPath)) {
    process.exit(1);
  }

  initialiseRepository(projectPath);

  console.log();
  logSuccess(
    `Done! Your project has been created in ${chalk.green(projectPath)}`
  );
  console.log();
};

module.exports = {
  boilerplates,
  createBoilerplateProject
};
