const execSync = require('child_process').execSync;
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
const installNodeDependencies = useYarn => {
  execSync(useYarn ? 'yarnpkg install' : 'npm install', {
    stdio: 'inherit'
  });
};

module.exports = {
  shouldUseYarn,
  installNodeDependencies
};
