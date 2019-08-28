const git = require('./git');
const log = require('./log');
const node = require('./node');

module.exports = {
  ...git,
  ...log,
  ...node
};
