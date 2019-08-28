const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const path = require('path');
const { logInfo, logError } = require('./log');

/**
 * Initialises a repository and creates an initial commit. Deletes existing
 * .git folder if it already exists and reinitialises the repo.
 *
 * @param {string} projectPath The path of the project
 */
const initialiseRepository = projectPath => {
  logInfo('Initialising git repository');

  if (fs.existsSync(path.resolve(projectPath, '.git'))) {
    fs.removeSync(path.resolve(projectPath, '.git'));
  }

  try {
    execSync('git init', { stdio: 'ignore' });
    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit"', { stdio: 'ignore' });
    return true;
  } catch (err) {
    // Perhaps git is not installed
    logError('Unable to initialise a git repository');
    return false;
  }
};

/**
 * Clones a repository from the specified git remote.
 *
 * @param {string} remote The git remote to clone
 * @param {string} destination The destination folder
 */
const cloneRepository = (remote, destination) => {
  logInfo(`Cloning ${remote}`);

  try {
    execSync(`git clone --depth 1 ${remote} ${destination}`);
    return true;
  } catch (err) {
    // Perhaps git is not installed
    logError(`Unable to clone ${remote}`);
    return false;
  }
};

module.exports = {
  initialiseRepository,
  cloneRepository
};
