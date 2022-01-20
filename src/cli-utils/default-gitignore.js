#!/usr/bin/env node
'use strict';

module.exports = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Yarn Integrity file
.yarn-integrity

# local dotenv environment variables file
.env*.local

# OSX Finder folder settings
.DS_STORE

# Files containing sensitive variables
.env.*

# Vercel deployment settings
.vercel`;
