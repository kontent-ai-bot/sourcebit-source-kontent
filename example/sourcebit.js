module.exports = {
  plugins: [
    {
      module: require('/Users/martinm/Documents/git-projects/sourcebit-source-kontent'),
      options: {
        kontentProjectId: '00676a8d-358c-0084-f2f2-33ed466c480a',
        kontentLanguageCodenames: [
          'en-US'
        ]
      }
    },
    {
      module: require('sourcebit-target-jekyll'),
      options: {
        writeFile: function(entry,utils) {
        // This function is invoked for each entry and its return value determines
        // whether the entry will be written to a file. When an object with `content`,
        // `format` and `path` properties is returned, a file will be written with
        // those parameters. If a falsy value is returned, no file will be created.
        const { __metadata: meta, ...fields } = entry;
        if (!meta) return;
        const { createdAt = '', modelName, projectId, source } = meta;
        if (modelName === 'sample-data' && projectId === '12345' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: true,
            content: fields,
            format: 'json',
            path: '_data/sample-data.json'
          };
        }
        }
      }
    }
  ]
}
