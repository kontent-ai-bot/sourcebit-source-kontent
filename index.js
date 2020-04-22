const pkg = require("./package.json");
const kontentItems = require("./build/src/core/sourceNodes.items");
const kontentTypes = require("./build/src/core/sourceNodes.types");
const normalize = require("./build/src/normalize");

module.exports.name = pkg.name;

module.exports.options = {
  kontentProjectId: {
    private: false
  },
  languageCodenames: {
    private: false
  }
};

module.exports.bootstrap = async ({
  debug,
  getPluginContext,
  log,
  options,
  refresh,
  setPluginContext
}) => {
  const context = getPluginContext();

  if (context && context.entries) {
    log(`Loaded ${context.entries.length} entries from cache`);
  } else {
    const kontentConfig = {
      projectId: options.projectId,
      languageCodenames: options.languageCodenames
    };

    const items = await kontentItems.kontentItemsSourceNodes(kontentConfig);
    const types = await kontentTypes.kontentTypesSourceNodes(kontentConfig);

    setPluginContext({
      items,
      types
    });
  }

  if (options.watch) {
    console.error("Watch mode is not supported at this time");
  }
};

module.exports.transform = ({
  data,
  debug,
  getPluginContext,
  log,
  options
}) => {
  const { items, types } = getPluginContext();

  const normalizedModels = normalize.getNormalizedModels(types, options);
  const normalizedEntries = normalize.getNormalizedEntries(
    items,
    normalizedModels,
    options
  );

  return {
    ...data,
    models: data.models.concat(normalizedModels),
    objects: data.objects.concat(normalizedEntries)
  };
};

module.exports.getSetup = ({
  chalk,
  context,
  currentOptions,
  data,
  debug,
  getSetupContext,
  inquirer,
  ora,
  setSetupContext
}) => {
  const questions = [
    {
      type: "input",
      name: "projectId",
      message: "What is the Kontent projectId?",
      validate: value =>
        value.length > 0 ? true : "The project Id cannot be empty."
    },
    {
      type: "input",
      name: "languageCodenames",
      message: "What are the Kontent languages codenames (separated by space)?",
      validate: value =>
        value.length > 0 ? true : "The language codenames cannot be empty."
    }
  ];

  return async () => {
    const answers = await inquirer.prompt(questions);
    return answers;
  };
};

module.exports.getOptionsFromSetup = ({
  answers,
  debug,
  getSetupContext,
  setSetupContext
}) => {
  return {
    projectId: answers.projectId,
    languageCodenames: answers.languageCodenames.split(" ")
  };
};
