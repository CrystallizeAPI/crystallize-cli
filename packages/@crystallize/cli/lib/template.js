'use strict';

const {
  logDebug,
  logError,
  logInfo,
  logSuccess,
  shouldUseYarn,
  cloneRepository,
  installNodeDependencies
} = require('@crystallize/cli-utils');
const chalk = require('chalk');
const Conf = require('conf');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const inquirer = require('inquirer');
const isEqual = require('lodash/isEqual');
const os = require('os');
const path = require('path');
const { boilerplates } = require('./boilerplate');

const config = new Conf({ projectName: 'crystallize' });
const defaultOptions = config.get('defaults', {});
const paymentMethods = config.get('defaults.react.paymentMethods', {});

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
    name: 'shopToUse',
    message: 'Which shop do you want to use?',
    choices: [
      {
        value: 'teddy-bear-shop',
        name: 'The teddy bear shop - prefilled with lots of teddy bears'
      },
      'My very own tenant please'
    ]
  },
  {
    type: 'input',
    name: 'tenantId',
    message: 'Your tenant identifier (https://crystallize.com/signup)',
    default: 'teddy-bear-shop',
    when: answers => answers.shopToUse !== 'teddy-bear-shop'
  },
  {
    type: 'list',
    name: 'template',
    message: 'Which template would you like to use?',
    choices: templates
  }
];

const arrayToObject = (array = []) =>
  array.reduce((obj, item) => {
    obj[item] = true;
    return obj;
  }, {});

const reduceOptions = answers => ({
  ...arrayToObject(answers.options),
  paymentMethods: arrayToObject(answers.paymentMethods)
});

const reactTemplateQuestions = [
  {
    type: 'checkbox',
    name: 'options',
    message: 'Which features would you like to use?',
    choices: [
      {
        name: 'Use ZEIT Now (https://zeit.co/now) for deployments',
        value: 'useNow',
        checked: (defaultOptions.react && defaultOptions.react.useNow) || true
      },
      {
        name: 'Add payment methods for checkout',
        value: 'customisePayment',
        checked:
          (defaultOptions.react && defaultOptions.react.customisePayment) ||
          true
      },
      {
        name: 'Use SendGrid (https://sendgrid.com) for emails',
        value: 'useSendGrid',
        checked: defaultOptions.react && defaultOptions.react.useSendGrid
      }
    ]
  },
  {
    type: 'checkbox',
    message: 'Which payment methods would you like to use?',
    name: 'paymentMethods',
    choices: [
      {
        name: 'Stripe (https://stripe.com)',
        value: 'stripe',
        checked: paymentMethods.stripe
      },
      {
        name: 'Klarna (https://www.klarna.com)',
        value: 'klarna',
        checked: paymentMethods.klarna
      }
    ],
    when: answers => answers.options.find(opt => opt === 'customisePayment')
  },
  {
    type: 'confirm',
    name: 'configureTokens',
    message:
      'Configure tokens and API keys now? (You can configure these in your .env file later)',
    default:
      (defaultOptions.react && defaultOptions.react.configureTokens) || true
  },
  {
    type: 'input',
    name: 'crystallizeAccessTokenId',
    message:
      'Crystallize Access Token ID (https://pim.crystallize.com/settings/access-tokens)',
    default: 'crystallize',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods.find(method => method === 'stripe')
  },
  {
    type: 'input',
    name: 'crystallizeAccessTokenSecret',
    message:
      'Crystallize Access Token Secret (https://pim.crystallize.com/settings/access-tokens)',
    default: 'crystallize',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods.find(method => method === 'stripe')
  },
  {
    type: 'input',
    name: 'stripePublishableKey',
    message:
      'Stripe Publishable Key (https://dashboard.stripe.com/test/apikeys)',
    default: 'stripe',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods.find(method => method === 'stripe')
  },
  {
    type: 'input',
    name: 'stripeSecretKey',
    message: 'Stripe Secret Key (https://dashboard.stripe.com/test/apikeys)',
    default: 'stripe',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods.find(method => method === 'stripe')
  },
  {
    type: 'input',
    name: 'klarnaUsername',
    message: 'Klarna Username (https://playground.eu.portal.klarna.com)',
    default: 'klarna',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods.find(method => method === 'klarna')
  },
  {
    type: 'input',
    name: 'klarnaPassword',
    message: 'Klarna Password (https://playground.eu.portal.klarna.com)',
    default: 'klarna',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods.find(method => method === 'klarna')
  },
  {
    type: 'input',
    name: 'ngrokUrl',
    message:
      'Please provide an HTTPS ngrok endpoint (https://ngrok.com/) for testing Klarna order confirmation locally',
    default: 'klarna',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods.find(method => method === 'klarna')
  },
  {
    type: 'input',
    name: 'sendGridApiKey',
    message: 'SendGrid API Key (https://app.sendgrid.com/settings/api_keys)',
    default: 'sendgrid',
    when: answers =>
      answers.configureTokens &&
      answers.options.find(option => option === 'useSendGrid')
  },
  {
    type: 'confirm',
    name: 'saveDefaults',
    message: 'Save these template settings as default?',
    default: true,
    when: answers => {
      const options = reduceOptions(answers);
      return !isEqual(defaultOptions.react, options);
    }
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
  const tenantId = answers.tenantId || 'teddy-bear-shop';
  const template = templates.find(t => t.value === answers.template);
  if (template.type === 'react') {
    await createReactProject(projectName, projectPath, tenantId, flags);
  } else {
    logError(`Unknown template type: "${template.type}`);
    process.exit(1);
  }
};

/**
 * Creates a new React project and asks React project specific questions.
 *
 * @param {string} projectName The name of the project
 * @param {string} projectPath The path of the project
 * @param {string} tenantId The id of the shop to use
 * @param {object} flags Flags specified via the cli
 */
const createReactProject = async (
  projectName,
  projectPath,
  tenantId,
  flags
) => {
  const answers = await inquirer.prompt(reactTemplateQuestions);
  const options = reduceOptions(answers);

  if (answers.saveDefaults) {
    logInfo('Saving default template preferences');
    logInfo('Note: This will not save any tokens or keys');
    config.set('defaults.react', options);
  }

  const templateOptions = {
    tenantId,
    crystallizeAccessTokenId: answers.crystallizeAccessTokenId || 'crystallize',
    crystallizeAccessTokenSecret:
      answers.crystallizeAccessTokenSecret || 'crystallize',
    paymentCredentials: {},
    ...options
  };

  if (options.paymentMethods.stripe) {
    templateOptions.paymentCredentials.stripeSecretKey =
      answers.stripeSecretKey || 'stripe';
    templateOptions.paymentCredentials.stripePublishableKey =
      answers.stripePublishableKey || 'stripe';
  }

  if (options.paymentMethods.klarna) {
    templateOptions.paymentCredentials.klarnaUsername =
      answers.klarnaUsername || 'klarna';
    templateOptions.paymentCredentials.klarnaPassword =
      answers.klarnaPassword || 'klarna';
    templateOptions.paymentCredentials.ngrokUrl = answers.ngrokUrl || 'klarna';
  }

  if (options.useSendGrid) {
    templateOptions.sendGridApiKey = answers.sendGridApikey || 'sendgrid';
  }

  cloneRepository(boilerplates['react'], projectPath);
  logInfo(`Creating a new Crystallize project in ${chalk.green(projectPath)}`);

  process.chdir(projectPath);
  fs.removeSync(path.resolve('package-lock.json'));

  const oldPackageJson = fs.readFileSync(path.resolve('package.json'), 'utf-8');
  const oldPackageJsonObj = JSON.parse(oldPackageJson);

  const scripts = oldPackageJsonObj.scripts;
  delete scripts['postinstall'];
  delete scripts['greet'];

  if (templateOptions.useNow) {
    delete oldPackageJsonObj.dependencies['express'];
    delete oldPackageJsonObj.dependencies['body-parser'];
    delete oldPackageJsonObj.dependencies['cookie-parser'];
    scripts['dev'] = scripts['now-dev'];
  } else {
    delete oldPackageJsonObj.dependencies['now'];
    delete oldPackageJsonObj.dependencies['@nerdenough/mjml-ncc-bundle'];
  }

  delete scripts['now-dev'];

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts,
    dependencies: {
      ...oldPackageJsonObj.dependencies,
      '@crystallize/react-scripts': 'latest'
    },
    devDependencies: {
      ...oldPackageJsonObj.devDependencies
    }
  };

  fs.writeFileSync(
    path.resolve(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  // Install dependencies
  const useYarn = !flags.useNpm && shouldUseYarn();
  installNodeDependencies(useYarn);

  if (process.env.DEV) {
    // Link the package instead of npm install
    logDebug('Running "npm link @crystallize/react-scripts"');
    execSync('npm link @crystallize/react-scripts', {
      stdio: 'inherit'
    });
  }

  // Run project's init script
  const scriptsPath = path.resolve(
    process.cwd(),
    'node_modules/@crystallize/react-scripts/scripts/init.js'
  );
  const init = require(scriptsPath);
  init(projectPath, templateOptions);

  showInstructions(projectPath, useYarn, templateOptions);
};

/**
 * Shows the postinstall instructions on the screen, such as how to run the
 * project in dev and prod modes.
 *
 * @param {string} projectPath The path of the project
 * @param {string} useYarn Should the commands be shown as yarn or npm?
 * @param {object} templateOptions User specified template configuration
 */
const showInstructions = (projectPath, useYarn, templateOptions) => {
  console.log();
  logSuccess(`Done! Your project has been created in ${projectPath}`);
  console.log();
  console.log(
    `Use ${chalk.green('now dev')} to run the app in development mode`
  );
  console.log(
    `Use ${chalk.green(
      useYarn ? 'yarn prod' : 'npm run prod'
    )} to run the app in production mode`
  );

  console.log();
  console.log(
    `Environment variables can be configured in ${chalk.blue('.env')}.`
  );

  if (templateOptions.useNow) {
    console.log();
    console.log(
      `Install now globally with ${chalk.green(
        useYarn ? 'yarn global add now' : 'npm install --global now'
      )}`
    );
    console.log(
      `Deploy to ZEIT Now (https://zeit.co/now) by running ${chalk.green(
        'now'
      )}`
    );
    console.log();
    console.log(
      `Note that you will need to manually add any secret api keys as a Now Secret. Secret names are defined in ${chalk.blue(
        'now.json'
      )}.`
    );
    console.log(
      `You can do this by running ${chalk.green(
        'now secrets add <secret-name> <secret-value>'
      )}`
    );
    console.log();
    console.log(
      `See ${chalk.blue(
        'https://zeit.co/docs/v2/serverless-functions/env-and-secrets'
      )} for more details.`
    );
  }

  console.log();
};

module.exports = {
  createTemplateProject
};
