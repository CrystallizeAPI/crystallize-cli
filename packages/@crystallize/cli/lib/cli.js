'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const meow = require('meow');
const path = require('path');

const { boilerplates, createBoilerplateProject } = require('./boilerplate');
const { createTemplateProject } = require('./template');

const helpMessage = `
  Usage
    $ crystallize <project-name>

  Options
    --boilerplate, -b <${Object.keys(boilerplates).join(
      '|'
    )}>  Create a project with a specific boilerplate
`;

const meowOptions = {
  flags: {
    boilerplate: {
      type: 'string',
      alias: 'b'
    }
  }
};

const cli = meow(helpMessage, meowOptions);

if (!cli.input[0]) {
  cli.showHelp();
  return process.exit(0);
}

const projectName = cli.input[0];
const projectPath = path.resolve(projectName);

if (fs.existsSync(projectPath)) {
  console.error(
    chalk.red('error'),
    'A folder with this project name already exists'
  );
  return process.exit(0);
}

const { boilerplate } = cli.flags;

if (boilerplate) {
  createBoilerplateProject(projectName, projectPath, boilerplate)
    .then(() => {
      console.log(chalk.green('success'), 'Done! Have fun out there!');
      process.exit(0);
    })
    .catch(err => {
      console.log(chalk.red('error'), err.message);
      console.log(err);
      process.exit(1);
    });
} else {
  createTemplateProject(projectName, projectPath)
    .then(() => {
      console.log(chalk.green('success'), 'Done! Have fun out there!');
      process.exit(0);
    })
    .catch(err => {
      console.log(chalk.red('error'), err.message);
      console.log(err);
      process.exit(1);
    });
}
