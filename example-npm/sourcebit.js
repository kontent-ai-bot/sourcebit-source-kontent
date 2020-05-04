module.exports = {
  plugins: [
    {
      module: require("@kentico/sourcebit-source-kontent"),
      options: {
        projectId: "00676a8d-358c-0084-f2f2-33ed466c480a",
        languageCodenames: ["en-US", "cs-CZ"]
      }
    },
    {
      module: require("sourcebit-target-jekyll"),
      options: {
        writeFile: function(entry, utils) {
          // This function is invoked for each entry and its return value determines
          // whether the entry will be written to a file. When an object with `content`,
          // `format` and `path` properties is returned, a file will be written with
          // those parameters. If a falsy value is returned, no file will be created.
          const { __metadata: meta, ...fields } = entry;
          if (!meta) return;
          const { createdAt = "", modelName, projectId, source } = meta;
          if (
            modelName === "article" &&
            projectId === "00676a8d-358c-0084-f2f2-33ed466c480a" &&
            source === "sourcebit-source-kontent"
          ) {
            const {
              __metadata,
              content: content,
              layout,
              ...frontmatterFields
            } = entry;
            return {
              content: {
                body: fields["content"],
                frontmatter: { ...frontmatterFields, layout: "test-layout" }
              },
              format: "frontmatter-md",
              path:
                "_posts/" +
                createdAt.substring(0, 10) +
                "-" +
                utils.slugify(fields["title"]) +
                ".md"
            };
          }
        }
      }
    }
  ]
};
