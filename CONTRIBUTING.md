# Contributing to Crystallize CLI

## Project Structure

Crystallize CLI is a monorepo, meaning it is made up of a number of independent
sub-packages. You can find these packages in the `packages/@crystallize`
directory.

### Directory Structure

```
packages/
  @crystallize/
    cli/
    cli-utils/
    react-scripts/
```

### Package Description

#### [cli][0]

This is the global CLI command, run either as `crystallize` when installed
locally or `npx @crystallize/cli` when run with npx.

The two main files in this are `lib/template.js` and `lib/boilerplate.js`. When
the `--boilerplate, -b` flag is provided, the user will be taken through the
`lib/boilerplate.js` code path. If omitted, they will be taken through
`lib/template.js`.

#### [cli-utils][1]

This package contains CLI tools that can be shared across multiple packages,
such as logging helpers or checking whether yarn is installed.

#### [react-scripts][2]

This package contains the main logic related to the Next.js + React template.
The `scripts/init.js` file is called by the cli when this template is chosen,
and it is used to configure the template files based on the user selected
options.

[0]:
  https://github.com/CrystallizeAPI/crystallize-cli/tree/master/packages/%40crystallize/cli
[1]:
  https://github.com/CrystallizeAPI/crystallize-cli/tree/master/packages/%40crystallize/cli-utils
[2]:
  https://github.com/CrystallizeAPI/crystallize-cli/tree/master/packages/%40crystallize/react-scripts
