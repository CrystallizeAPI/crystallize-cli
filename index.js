#!/usr/bin/env node
'use strict';

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

const minVersion = 12;

if (major < minVersion) {
  console.error(`
You are running Node.js v${currentNodeVersion}
Crystallize CLI requires Node ${minVersion} or higher.
Please update your version of Node.
`);
  process.exit(1);
}

require('./src/cli.js');
