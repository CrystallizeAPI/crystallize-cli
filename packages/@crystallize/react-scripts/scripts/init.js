'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const init = (appPath, appName) => {
  const { name: ownPackageName } = require(path.resolve(
    __dirname,
    '..',
    'package.json'
  ));
  const ownPath = path.resolve(appPath, 'node_modules', ownPackageName);
  const appPackage = require(path.resolve(appPath, 'package.json'));

  appPackage.scripts = {
    build: 'next build',
    start: 'node ./server'
  };

  appPackage.dependencies = appPackage.dependencies || {};
  appPackage.devDependencies = appPackage.devDependencies || {};

  // Options
  const useTypescript = appPackage.dependencies['typescript'];
  const useNow = appPackage.dependencies['now'];

  if (useNow) {
    appPackage.scripts = {
      ...appPackage.scripts,
      deploy: 'now',
      start: 'now dev'
    };
  }

  fs.writeFileSync(
    path.resolve(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  );

  const templatePath = path.resolve(
    ownPath,
    useTypescript ? 'template-typescript' : 'template'
  );

  if (!fs.existsSync(templatePath)) {
    console.log(
      chalk.red('error'),
      'Could not locate the supplied template:',
      chalk.green(templatePath)
    );
    return;
  }

  fs.copySync(templatePath, appPath);
};

module.exports = init;
