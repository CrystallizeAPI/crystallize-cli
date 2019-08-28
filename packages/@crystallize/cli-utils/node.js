const execSync = require('child_process').execSync;

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

module.exports = {
  shouldUseYarn
};
