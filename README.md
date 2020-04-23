# sourcebit-source-kontent [WIP]

> A [Kontent](https://kontent.ai) source plugin for [Sourcebit](https://github.com/stackbithq/sourcebit)

## General

With this plugin, you can add Kontent as a data source for Sourcebit.

## ⚠ Disclaimer

This project/repository in a work in progress and is not ready for production use yet. The features and APIs might be (and probably will be) changed.

## Installation

To install the plugin and add it to your project, run:

```
npm install @kentico/sourcebit-source-kontent --save
```

> You don't need to run this command if you start Sourcebit using the [interactive setup process](#%EF%B8%8F-interactive-setup-process), as the CLI will install the plugin for you and add it as a dependency to your project.

## ⚙️ Configuration

The plugin accepts the following configuration parameters. They can be supplied in any of the following ways:

- In the `options` object of the plugin configuration block inside `sourcebit.js`, with the value of the _Property_ column as a key;
- As an environment variable named after the _Env variable_ column, when running the `sourcebit fetch` command;
- As part of a `.env` file, with the value of the _Env variable_ column separated by the value with an equals sign (e.g. `MY_VARIABLE=my-value`);
- As a CLI parameter, when running the `sourcebit fetch` command, using the value of the _Parameter_ column as the name of the parameter (e.g. `sourcebit fetch --my-parameter`).

| Property                   | Type   | Visibility | Default value | Env variable | Parameter | Description                                                                                                                                   |
| -------------------------- | ------ | ---------- | ------------- | ------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `projectId`                | String | Public     |               |              |           | The ID of the Kontent [project](https://docs.kontent.ai/tutorials/develop-apps/get-started/hello-world#a-creating-a-kentico-kontent-project). |  |
| `kontentLanguageCodenames` | Array  | Public     |               |              |           | Array of language codenames                                                                                                                   |  |

### Example configuration

_sourcebit.js_

```js
module.exports = {
  plugins: [
    {
      module: require("sourcebit-source-kontent"),
      options: {
        kontentProjectId: "00676a8d-358c-0084-f2f2-33ed466c480a",
        kontentLanguageCodenames: ["en-US", "cs-CZ"]
      }
    }
  ]
};
```

### Interactive setup process

This plugin offers an interactive setup process via the `npx create-sourcebit` command. It asks users for their Kontent projectId and and language codenames.

## 📥 Input

_N/A_

## 📤 Output

This plugin adds normalized entries to the `objects` data bucket and normalized model objects to the `models` data bucket.

## Local development

For local development you can use example in the `example` branch.

```
npm i
npm run build
```

## Release new version
Change version in package.json to 1.2.3 and push a commit with the message Release 1.2.3, the npm-publish action will create a new tag v1.2.3 and publish the package to the npm registry.

## Missing features:

- normalize assets
- preview/watch/polling
- multilingual support
