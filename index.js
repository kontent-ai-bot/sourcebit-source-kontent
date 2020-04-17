const pkg = require("./package.json");
const kontentItems = require("./build/sourceNodes.items");
const kontentTypes = require("./build/sourceNodes.types");

module.exports.name = pkg.name;

module.exports.options = {
  watch: {
    // 👉 By default, the value of this option will be `false`.
    default: false,

    // 👉 The value for this option will be read from the `watch`
    // runtime parameter, which means that if the user starts
    // Sourcebit with `sourcebit fetch --watch`, then the value
    // of this option will be set to `true`, regardless of any
    // other value defined in the configuration file.
    runtimeParameter: "watch"
  },
  kontentProjectId: {
    private: false
  },
  kontentLanguages: { 
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

  // 👉 If there are entries in the cache, there's nothing that
  // needs to be done right now.
  if (context && context.entries) {
    log(`Loaded ${context.entries.length} entries from cache`);
  } else {

    const kontentConfig = {
      projectId: options.kontentProjectId,
      languageCodenames: options.kontentLanguageCodenames
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
  const projectEnvironment = 'master';

  const normalizedModels = types.map(type => {
    const model = {
      source: pkg.name,
      modelName: type.system.codename,
      modelLabel: type.system.name,
      projectId: options.kontentProjectId,
      projectEnvironment,
      fieldNames: type.elements.map(element => element.codename)
    };

    return model;
  })

  const normalizedEntries = items.map(item => {
    const model = normalizedModels.map(m => m.modelName === item.system.type);

    const normalizedEntryMetadata = {
      source: pkg.name,
      id: item.system.codename,
      modelName: model.modelName,
      modelLabel: model.modelLabel,
      projectId: options.kontentProjectId,
      projectEnvironment,
      createdAt: item.system.last_modified,
      updatedAt: item.system.last_modified
    }

    return {
      ...item,
      __metadata: normalizedEntryMetadata
    };
  });

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
      name: "kontentProjectId",
      message: "What is the Kontent projectId?",
      validate: value =>
        value.length > 0 ? true : "The project Id cannot be empty."
    },
    {
      type: "input",
      name: "kontentLanguageCodenames",
      message: "What are the Kontent languages codenames (seperataed by space)?",
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
    kontentProjectId: answers.kontentProjectId,
    kontentLanguageCodenames: answers.kontentLanguageCodenames.split(" ")
  };
};
