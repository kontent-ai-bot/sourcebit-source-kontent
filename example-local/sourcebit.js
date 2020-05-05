module.exports = {
  plugins: [
    {
      module: require('/Users/martinm/Documents/git-projects/sourcebit-source-kontent'),
      options: {
        projectId: '773d6338-72da-008c-4abd-392f5747f354',
        languageCodenames: [
          'en-US'
        ]
      }
    },
    {
      module: require('sourcebit-transform-assets'),
      options: {
        assetPath: function(entry,asset) {
        return [
          "images",
          [asset.__metadata.id, asset.fileName].join("-")
        ].join("/");
        },
        publicUrl: function(entry,asset,assetPath) {
        return [
          "/images",
          [asset.__metadata.id, asset.fileName].join("-")
        ].join("/");
        }
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
        if (modelName === 'post' && projectId === '773d6338-72da-008c-4abd-392f5747f354' && source === '@kentico/sourcebit-source-kontent') {
          const { __metadata, 'content': content, layout, ...frontmatterFields } = entry;
          return {
            content: {
              body: fields['content'],
              frontmatter: { ...frontmatterFields, layout: fields['layout'] },
            },
            format: 'frontmatter-md',
            path: 'myArticles/' + createdAt.substring(0, 10) + '-' + utils.slugify(fields['title']) + '.md'
          };
        }
        }
      }
    }
  ]
}
