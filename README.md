# Crystallize CLI

[![Build Status](https://travis-ci.org/CrystallizeAPI/crystallize-cli.svg?branch=master)](https://travis-ci.org/CrystallizeAPI/crystallize-cli)

Bootstrap an app running on the [headless ecommerce][1] and GraphQL based
[Product Information Management][2] service [Crystallize][3].

## Usage

You'll need the following installed to use Crystallize CLI:

- [Node.js][7] (>=12)

To create a new app using Crystallize, simply run the following command:

```sh
npx @crystallize/cli <project-name>
```

This will walk you through creating a project, allowing you to choose which
template and preferences you want to use.

### Templates

The default mode of the Crystallize CLI is to use a template. Each template has
different options that can be chosen to configure the initial project to suit
your needs.

Current templates include:

- Next.js + React
- Gatsby + React
- React Native (beta)

## Contributing

If you'd like to help improve our CLI tool, check out the [contributing
guidelines][9] for an overview of the codebase and structure.

[1]: https://crystallize.com/product
[2]: https://crystallize.com/product/product-information-management
[3]: https://crystallize.com/
[4]: https://github.com/CrystallizeAPI/crystallize-nextjs-boilerplate
[5]: https://github.com/CrystallizeAPI/crystallize-react-native-boilerplate
[6]: https://github.com/CrystallizeAPI/crystallize-flutter-boilerplate
[7]: https://nodejs.org
[9]:
  https://github.com/CrystallizeAPI/crystallize-cli/blob/master/CONTRIBUTING.md
