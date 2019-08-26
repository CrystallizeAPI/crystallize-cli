'use strict';

const { logError, logSuccess } = require('@crystallize/cli-utils');
const fs = require('fs-extra');
const meow = require('meow');
const path = require('path');
const logo = require('../logo');

const { boilerplates, createBoilerplateProject } = require('./boilerplate');
const { createTemplateProject } = require('./template');

const helpMessage = `
  ${logo}

  Crystallize CLI

  Usage
    $ crystallize <project-name>

  Options
    --boilerplate, -b <name>  Create a project with a specific boilerplate
    --use-npm                 Use npm instead of yarn
`;

const meowOptions = {
  flags: {
    boilerplate: {
      type: 'string',
      alias: 'b'
    },
    useNpm: {
      type: 'boolean'
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
  logError('A folder with this project name already exists');
  return process.exit(0);
}

const { boilerplate } = cli.flags;

const handleSuccess = () => {
  logSuccess('Done! Have fun out there!');
  process.exit(0);
};

const handleError = err => {
  logError(err.message, err);
  process.exit(1);
};

if (boilerplate) {
  createBoilerplateProject(projectName, projectPath, boilerplate)
    .then(handleSuccess)
    .catch(handleError);
} else {
  createTemplateProject(projectName, projectPath, cli.flags)
    .then(handleSuccess)
    .catch(handleError);
}
