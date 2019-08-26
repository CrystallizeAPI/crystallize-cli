const chalk = require('chalk');
const execSync = require('child_process').execSync;

const logDebug = (...parts) => {
  if (process.env.DEV) {
    console.log(chalk.blue('debug'), ...parts);
  }
};

const logError = (...parts) => console.log(chalk.red('error'), ...parts);
const logInfo = (...parts) => console.log(chalk.blue('info'), ...parts);
const logSuccess = (...parts) => console.log(chalk.green('success'), ...parts);
const logWarning = (...parts) => console.log(chalk.yellow('warning'), ...parts);

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
  logDebug,
  logError,
  logInfo,
  logSuccess,
  logWarning,
  shouldUseYarn
};
