const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const { logInfo } = require('./log');

/**
 * Determines whether yarn is installed.
 */
const shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Installs Node dependencies using either npm or Yarn.
 *
 * @param {boolean} useYarn Should Yarn be used for installing dependencies?
 * @param {array} dependencies Array of dependencies to install
 */
const installNodeDependencies = (useYarn, dependencies, devDependencies) => {
  let command;
  let dependencyArgs;
  let devDependencyArgs;

  if (useYarn) {
    logInfo(`Installing dependencies with yarn: ${dependencies.join(', ')}`);
    command = 'yarnpkg';
    dependencyArgs = ['add'].concat(dependencies);
    devDependencyArgs = ['add', '-D'].concat(devDependencies);
  } else {
    logInfo(`Installing dependencies with npm: ${dependencies.join(', ')}`);
    command = 'npm';
    dependencyArgs = ['install', '--save', '--loglevel', 'error'].concat(
      dependencies
    );
    devDependencyArgs = [
      'install',
      '--save',
      '-D',
      '--loglevel',
      'error'
    ].concat(devDependencies);
  }

  spawn.sync(command, dependencyArgs, { stdio: 'inherit' });
  return spawn.sync(command, devDependencyArgs, { stdio: 'inherit' });
};

module.exports = {
  shouldUseYarn,
  installNodeDependencies
};
