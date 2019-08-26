# Crystallize CLI

Bootstrap an app running on the [headless ecommerce][1] and GraphQL based
[Product Information Management][2] service [Crystallize][3].

## Usage

You'll need to have [Node.js][7] (>=8) installed to use the CLI tool. Then, run
the following command in your terminal:

```sh
npx crystallize <project-name>
```

This will walk you through creating a project, allowing you to choose which
template and preferences you want to use.

### Templates

The default mode of the Crystallize CLI is to use a template. Each template has
different options that can be chosen to configure the initial project to suit
your needs.

Current templates include:

- Next.js + React

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
[7]: https://nodejs.org
