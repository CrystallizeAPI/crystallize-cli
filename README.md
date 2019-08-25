# Crystallize CLI

Bootstrap a React app running on the [headless ecommerce][1] and GraphQL based
[Product Information Management][2] service [Crystallize][3].

## Installation

```sh
yarn global add @crystallize/cli
# or
npm install -g @crystallize/cli
```

## Usage

To create a new project with Crystallize simply run the following command:

```sh
crystallize <project-name>
```

This will walk you through creating a project, allowing you to choose which
template and preferences you want to use.

### Boilerplate

You can also initialise a project through one of the various boilerplates
provided by Crystallize. The boilerplate can be used in place of a template but
does not provide any customisation options.

```sh
crystallize <project-name> -b react
```

The current boilerplates include:

- [react][4]: A boilerplate for React powered by Next.js
- [react-native][5]: A boilerplate for React Native
- [flutter][6]: A boilerplate for Flutter

[1]: https://crystallize.com/product
[2]: https://crystallize.com/product/product-information-management
[3]: https://crystallize.com/
[4]: https://github.com/CrystallizeAPI/crystallize-frontend-boilerplate
[5]: https://github.com/CrystallizeAPI/crystallize-react-native-boilerplate
[6]: https://github.com/CrystallizeAPI/crystallize-flutter-boilerplate
