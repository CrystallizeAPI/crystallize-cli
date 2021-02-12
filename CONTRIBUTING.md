# Contributing to Crystallize CLI

### Package Description

#### [cli][0]

This is the global CLI command, run either as `crystallize` when installed
locally or `npx @crystallize/cli` when run with npx.

The two main files in this are `lib/template.js` and `lib/boilerplate.js`. When
the `--boilerplate, -b` flag is provided, the user will be taken through the
`lib/boilerplate.js` code path. If omitted, they will be taken through
`lib/template.js`.

## Local Development

1. Clone the repo with
   `git clone https://github.com/CrystallizeAPI/crystallize-cli.git`.
2. Run `yarn` to install any required dependencies.
3. Run `npm link`. Running `crystallize` in your terminal should now reference
   your local copy of the package.

## Deployment

If you are a member of Crystallize you can deploy new versions of the pages by
running `yarn lerna`. This will walk you through versioning any packages you've
modified and publishing the packages to npm.

If you are not a member of Crystallize please submit a pull request and we'll be
happy to take a look 🙂.
