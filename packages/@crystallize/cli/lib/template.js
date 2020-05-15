'use strict';

const { logError } = require('@crystallize/cli-utils');
const inquirer = require('inquirer');

const { createGatsbyProject } = require('./templates/gatsby');
const { createNextjsProject } = require('./templates/nextjs');

const defaultTenantId = 'furniture';

const templates = [
  {
    name: 'Next.js + React',
    value: 'nextjs',
    type: 'nextjs'
  },
  {
    name: 'Gatsby + React',
    value: 'gatsby',
    type: 'gatsby'
  }
];

const rootQuestions = [
  {
    type: 'list',
    name: 'shopToUse',
    message: 'Which shop do you want to use?',
    choices: [
      {
        value: defaultTenantId,
        name: 'Our template shop - prefilled with lots of juicy data'
      },
      'My very own tenant please'
    ]
  },
  {
    type: 'input',
    name: 'tenantId',
    message: 'Your tenant identifier (https://crystallize.com/signup)',
    default: defaultTenantId,
    when: answers => answers.shopToUse !== defaultTenantId
  },
  {
    type: 'list',
    name: 'template',
    message: 'Which template would you like to use?',
    choices: templates
  }
];

/**
 * Determines the type of project to be created and calls the corresponding
 * setup script for the matching template.
 *
 * @param {string} projectName The name of the project
 * @param {string} projectPath The path of the project
 * @param {object} flags Flags specified via the cli
 */
const createTemplateProject = async (projectName, projectPath, flags) => {
  const answers = await inquirer.prompt(rootQuestions);
  const tenantId = answers.tenantId || defaultTenantId;
  const template = templates.find(t => t.value === answers.template);
  if (template.type === 'nextjs') {
    await createNextjsProject(projectName, projectPath, tenantId, flags);
  } else if (template.type === 'gatsby') {
    await createGatsbyProject(projectName, projectPath, tenantId, flags);
  } else {
    logError(`Unknown template type: "${template.type}`);
    process.exit(1);
  }
};

module.exports = {
  createTemplateProject
};
