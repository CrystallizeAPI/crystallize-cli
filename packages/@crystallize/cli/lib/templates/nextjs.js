'use strict';

const {
  logDebug,
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
const { boilerplates } = require('../boilerplate');

const config = new Conf({ projectName: 'crystallize' });
const defaultOptions = config.get('defaults', {});
const paymentMethods = config.get('defaults.gatsby.paymentMethods', {});

const arrayToObject = (array = []) =>
  array.reduce((obj, item) => {
    obj[item] = true;
    return obj;
  }, {});

const reduceOptions = answers => ({
  ...arrayToObject(answers.options),
  paymentMethods: arrayToObject(answers.paymentMethods)
});

const nextjsTemplateQuestions = [
  {
    type: 'checkbox',
    name: 'options',
    message: 'Which features would you like to use?',
    choices: [
      // {
      //   name: 'Use ZEIT Now (https://zeit.co/now) for deployments',
      //   value: 'useVercel',
      //   checked:
      //     (defaultOptions.react && defaultOptions.react.useVercel) || true
      // },
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
      'Configure tokens and API keys now? (You can configure these in your .env/.env.local file later)',
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
      answers.paymentMethods &&
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
      answers.paymentMethods &&
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
      answers.paymentMethods &&
      answers.paymentMethods.find(method => method === 'stripe')
  },
  {
    type: 'input',
    name: 'stripeSecretKey',
    message: 'Stripe Secret Key (https://dashboard.stripe.com/test/apikeys)',
    default: 'stripe',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods &&
      answers.paymentMethods.find(method => method === 'stripe')
  },
  {
    type: 'input',
    name: 'klarnaUsername',
    message: 'Klarna Username (https://playground.eu.portal.klarna.com)',
    default: 'klarna',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods &&
      answers.paymentMethods.find(method => method === 'klarna')
  },
  {
    type: 'input',
    name: 'klarnaPassword',
    message: 'Klarna Password (https://playground.eu.portal.klarna.com)',
    default: 'klarna',
    when: answers =>
      answers.configureTokens &&
      answers.paymentMethods &&
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
 * Creates a new Next.js + React project.
 *
 * @param {string} projectName The name of the project
 * @param {string} projectPath The path of the project
 * @param {string} tenantId The id of the shop to use
 * @param {object} flags Flags specified via the cli
 */
const createNextjsProject = async (
  projectName,
  projectPath,
  tenantId,
  flags
) => {
  const answers = await inquirer.prompt(nextjsTemplateQuestions);
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
  }

  if (options.useSendGrid) {
    templateOptions.sendGridApiKey = answers.sendGridApikey || 'sendgrid';
  }

  cloneRepository(boilerplates['nextjs'], projectPath);
  logInfo(`Creating a new Crystallize project in ${chalk.green(projectPath)}`);

  process.chdir(projectPath);
  fs.removeSync(path.resolve('package-lock.json'));

  const oldPackageJson = fs.readFileSync(path.resolve('package.json'), 'utf-8');
  const oldPackageJsonObj = JSON.parse(oldPackageJson);

  const scripts = oldPackageJsonObj.scripts;
  // delete scripts['postinstall'];
  // delete scripts['greet'];

  // if (templateOptions.useVercel) {
  //   delete oldPackageJsonObj.dependencies['express'];
  //   delete oldPackageJsonObj.dependencies['body-parser'];
  //   delete oldPackageJsonObj.dependencies['cookie-parser'];
  // } else {
  //   delete oldPackageJsonObj.dependencies['now'];
  //   delete oldPackageJsonObj.dependencies['@nerdenough/mjml-ncc-bundle'];
  //   delete scripts['now-dev'];
  // }

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: oldPackageJsonObj.scripts,
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
 */
const showInstructions = (projectPath, useYarn) => {
  console.log();
  logSuccess(`Done! Your project has been created in ${projectPath}`);
  console.log();
  console.log(
    `Run ${chalk.green(
      useYarn ? 'yarn dev' : 'npm run dev'
    )} to run the app in development mode`
  );
  console.log(
    `Run ${chalk.green(
      useYarn ? 'yarn prod' : 'npm run prod'
    )} to run the app in production mode`
  );

  console.log();
  console.log(
    `Environment variables can be configured in ${chalk.blue('.env')}.`
  );
  console.log(
    `Local/user specific environment variables can be configured in ${chalk.blue(
      '.env.local'
    )}.`
  );

  console.log();

  console.log(
    `Deploy to Vercel (https://vercel.com) by running ${chalk.green(
      useYarn ? 'yarn vercel' : 'npm run vercel'
    )}`
  );
  console.log();
  console.log(
    `Note that you will need to manually add any secret api keys as a Vercel Secret. Secret names are defined in ${chalk.blue(
      'vercel.json'
    )}.`
  );
  console.log(
    `You can do this by running ${chalk.green(
      (useYarn ? 'yarn ' : 'npm run ') +
        'vercel secrets add <secret-name> <secret-value>'
    )}`
  );
  console.log();
  console.log(
    `See ${chalk.blue(
      'https://vercel.com/docs/v2/serverless-functions/env-and-secrets'
    )} for more details.`
  );

  console.log();
};

module.exports = { createNextjsProject };
