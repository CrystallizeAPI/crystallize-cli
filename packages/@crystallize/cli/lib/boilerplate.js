'use strict';

const { logError, logInfo } = require('@crystallize/cli-utils');
const fs = require('fs-extra');
const git = require('simple-git/promise');
const path = require('path');

const remote = 'https://github.com/CrystallizeAPI/';

const boilerplates = {
  react: `${remote}crystallize-frontend-boilerplate`,
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
  logInfo(`Cloning ${remote}`);

  await git().clone(remote, projectPath, {
    shallow: true
  });

  const gitPath = path.resolve(projectPath, '.git');

  logInfo(`Removing ${gitPath}`);
  fs.removeSync(gitPath);

  logInfo(`Initialising repo!`);
  await git(projectPath).init();
  await git(projectPath).add('-A');
  return git(projectPath).commit('Initial commit');
};

module.exports = {
  boilerplates,
  createBoilerplateProject
};
