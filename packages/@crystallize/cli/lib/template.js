'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const os = require('os');
const path = require('path');
const spawn = require('cross-spawn');

const templates = [
  {
    name: 'Next.js + React',
    value: 'nextjs-react',
    type: 'react'
  }
];

const rootQuestions = [
  {
    type: 'list',
    name: 'template',
    message: 'Which template would you like to use?',
    choices: templates
  }
];

const reactTemplateQuestions = [
  {
    type: 'confirm',
    name: 'now',
    message: 'Use Now (zeit.co/now) for deployments?',
    default: true
  }
];

const createTemplateProject = async (projectName, projectPath) => {
  const answers = await inquirer.prompt(rootQuestions);
  console.log(
    chalk.blue('info'),
    `Creating project "${projectName}" with template "${answers.template}"`
  );

  const template = templates.find(t => t.value === answers.template);
  if (template.type === 'react') {
    await createReactProject(projectName, projectPath);
  } else {
    console.error(chalk.red('error'), 'Unknown template type');
    process.exit(1);
  }
};

/**
 * Creates a new React project and asks React project specific questions.
 *
 * @param {string} projectName The name of the project
 */
const createReactProject = async projectName => {
  const answers = await inquirer.prompt(reactTemplateQuestions);
  const root = path.resolve(projectName);

  fs.ensureDirSync(projectName);
  console.log(
    chalk.blue('info'),
    `Creating your new Crystallize project in ${chalk.green(root)}`
  );

  console.log(chalk.blue('info'), 'Creating initial package.json');
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {}
  };

  fs.writeFileSync(
    path.resolve(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  process.chdir(root);

  // Dependencies required to bootstrap the project
  const dependencies = []; // Skipping '@crystallize/react-scripts' until published
  if (answers.now) {
    dependencies.push('now');
  }

  // Install dependencies
  console.log(
    chalk.blue('info'),
    `Installing dependencies: ${dependencies.join(', ')}`
  );
  spawn.sync(
    'npm',
    ['install', '--save', '--loglevel', 'error'].concat(dependencies),
    { stdio: 'inherit' }
  );

  if (process.env.DEV) {
    // Link the package instead of npm install
    console.log(
      chalk.blue('dev'),
      'Running "npm link @crystallize/react-scripts"'
    );
    spawn.sync('npm', ['link', '@crystallize/react-scripts'], {
      stdio: 'inherit'
    });
  }

  // Run project's init script
  const scriptsPath = path.resolve(
    process.cwd(),
    'node_modules/@crystallize/react-scripts/scripts/init.js'
  );
  const init = require(scriptsPath);
  init(root, projectName);
};

module.exports = {
  createTemplateProject
};
